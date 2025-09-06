#!/bin/bash

# =============================================================================
# Live Streaming Encoder - Cross-Platform Deployment Script
# Supports: Windows (WSL/Git Bash) and Ubuntu 24.04
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect operating system
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [[ -f /etc/ubuntu-release ]] && grep -q "Ubuntu 24.04" /etc/ubuntu-release; then
            OS="ubuntu24"
        else
            OS="linux"
        fi
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
        OS="windows"
    else
        OS="unknown"
    fi
    echo $OS
}

# Print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install dependencies based on OS
install_dependencies() {
    print_info "Installing dependencies for $OS..."
    
    case $OS in
        "ubuntu24")
            print_info "Updating package lists..."
            sudo apt update
            
            print_info "Installing required packages..."
            sudo apt install -y \
                curl \
                wget \
                git \
                docker.io \
                docker-compose-plugin \
                nginx \
                sqlite3 \
                unzip \
                jq \
                net-tools \
                ca-certificates \
                gnupg \
                lsb-release
            
            # Add Docker's official GPG key
            sudo mkdir -p /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            
            # Set up the repository
            echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
                sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
            
            # Install Docker CE
            sudo apt update
            sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            
            # Add user to docker group
            sudo usermod -aG docker $USER
            
            # Start and enable Docker
            sudo systemctl enable docker
            sudo systemctl start docker
            
            print_success "Dependencies installed successfully!"
            print_warning "Please log out and log back in to use Docker without sudo"
            ;;
            
        "windows")
            print_info "Checking for Docker Desktop on Windows..."
            
            if ! command_exists docker; then
                print_error "Docker Desktop is not installed!"
                print_info "Please install Docker Desktop for Windows from:"
                print_info "https://www.docker.com/products/docker-desktop/"
                print_info "Then enable WSL 2 integration in Docker Desktop settings."
                exit 1
            fi
            
            if ! command_exists docker-compose; then
                print_warning "Docker Compose not found. Installing Docker Compose..."
                # Download Docker Compose
                curl -SL https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-windows-x86_64.exe -o docker-compose.exe
                # Move to a directory in PATH
                if [[ -d "/c/Program Files/Docker/Docker/resources/bin" ]]; then
                    mv docker-compose.exe "/c/Program Files/Docker/Docker/resources/bin/"
                else
                    mv docker-compose.exe "/usr/local/bin/"
                fi
            fi
            
            print_success "Docker and Docker Compose are ready!"
            ;;
            
        *)
            print_error "Unsupported operating system: $OS"
            print_info "This script supports Ubuntu 24.04 and Windows (with Docker Desktop)"
            exit 1
            ;;
    esac
}

# Clone or update repository
setup_repository() {
    REPO_URL="https://github.com/shihan84/Live-Streaming-Encoder.git"
    REPO_DIR="Live-Streaming-Encoder"
    
    if [[ -d "$REPO_DIR" ]]; then
        print_info "Repository already exists. Updating..."
        cd "$REPO_DIR"
        git pull origin master
        cd ..
    else
        print_info "Cloning repository..."
        git clone "$REPO_URL" "$REPO_DIR"
    fi
    
    cd "$REPO_DIR"
    print_success "Repository setup complete!"
}

# Create environment file
create_env_file() {
    print_info "Creating environment file..."
    
    ENV_FILE=".env"
    
    if [[ -f "$ENV_FILE" ]]; then
        print_warning "Environment file already exists. Backing up..."
        cp "$ENV_FILE" "$ENV_FILE.backup"
    fi
    
    # Generate random secret
    SECRET=$(openssl rand -hex 32)
    
    cat > "$ENV_FILE" << EOF
# Database Configuration
DATABASE_URL=file:./dev.db

# Application Configuration
NODE_ENV=production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=$SECRET

# SCTE-35 Configuration
SCTE35_PROVIDER_ID=0x1
SCTE35_PROVIDER_NAME=YourProvider
SCTE35_AUTO_RETURN=true

# WebSocket Configuration
NEXT_PUBLIC_WS_URL=http://localhost:3000

# Docker Configuration (Windows only)
COMPOSE_CONVERT_WINDOWS_PATHS=1
EOF
    
    print_success "Environment file created successfully!"
}

# Create necessary directories
create_directories() {
    print_info "Creating necessary directories..."
    
    mkdir -p data
    mkdir -p hls
    mkdir -p logs
    mkdir -p backups
    
    print_success "Directories created successfully!"
}

# Setup Docker configuration
setup_docker() {
    print_info "Setting up Docker configuration..."
    
    # Create docker-compose.override.yml for production
    cat > docker-compose.override.yml << EOF
version: '3.8'
services:
  streaming-encoder:
    environment:
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
      - ./hls:/var/www/hls
      - ./logs:/app/logs
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G

  nginx:
    volumes:
      - ./hls:/usr/share/nginx/html/hls:ro
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./logs/nginx:/var/log/nginx
    restart: unless-stopped

  db:
    volumes:
      - ./data:/data
      - ./backups:/backups
    restart: unless-stopped
EOF
    
    print_success "Docker configuration created!"
}

# Create systemd service for Ubuntu
create_systemd_service() {
    if [[ "$OS" == "ubuntu24" ]]; then
        print_info "Creating systemd service..."
        
        sudo tee /etc/systemd/system/streaming-encoder.service > /dev/null << EOF
[Unit]
Description=Live Streaming Encoder Service
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/docker-compose up -d
ExecStop=/usr/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
        
        sudo systemctl daemon-reload
        sudo systemctl enable streaming-encoder.service
        
        print_success "Systemd service created and enabled!"
    fi
}

# Create Windows service scripts
create_windows_scripts() {
    if [[ "$OS" == "windows" ]]; then
        print_info "Creating Windows service scripts..."
        
        # Create start script
        cat > start-streaming-encoder.bat << EOF
@echo off
echo Starting Live Streaming Encoder...
cd /d "%~dp0"
docker-compose up -d
echo Services started successfully!
pause
EOF
        
        # Create stop script
        cat > stop-streaming-encoder.bat << EOF
@echo off
echo Stopping Live Streaming Encoder...
cd /d "%~dp0"
docker-compose down
echo Services stopped successfully!
pause
EOF
        
        # Create restart script
        cat > restart-streaming-encoder.bat << EOF
@echo off
echo Restarting Live Streaming Encoder...
cd /d "%~dp0"
docker-compose down
docker-compose up -d
echo Services restarted successfully!
pause
EOF
        
        # Create status script
        cat > status-streaming-encoder.bat << EOF
@echo off
echo Checking Live Streaming Encoder status...
cd /d "%~dp0"
docker-compose ps
pause
EOF
        
        chmod +x *.bat
        
        print_success "Windows service scripts created!"
    fi
}

# Create backup script
create_backup_script() {
    print_info "Creating backup script..."
    
    cat > backup.sh << 'EOF'
#!/bin/bash
set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Creating backup..."

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
if [[ -f "data/dev.db" ]]; then
    echo "Backing up database..."
    sqlite3 data/dev.db ".backup $BACKUP_DIR/db_$DATE.db"
fi

# Backup configuration files
echo "Backing up configuration..."
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" \
    .env \
    docker-compose.yml \
    docker-compose.override.yml \
    nginx.conf 2>/dev/null || true

# Backup HLS content (optional - comment out if not needed)
# echo "Backing up HLS content..."
# tar -czf "$BACKUP_DIR/hls_$DATE.tar.gz" hls/ 2>/dev/null || true

# Clean old backups (keep last 7 days)
echo "Cleaning old backups..."
find "$BACKUP_DIR" -name "*.db" -mtime +7 -delete 2>/dev/null || true
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete 2>/dev/null || true

echo "Backup completed: $BACKUP_DIR"
ls -la "$BACKUP_DIR" | tail -5
EOF
    
    chmod +x backup.sh
    
    # Create Windows backup script
    cat > backup.bat << EOF
@echo off
echo Creating backup...

set BACKUP_DIR=./backups
set DATE=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%

mkdir "%BACKUP_DIR%" 2>nul

if exist "data\dev.db" (
    echo Backing up database...
    sqlite3 data/dev.db ".backup %BACKUP_DIR%/db_%DATE%.db"
)

echo Backing up configuration...
tar -czf "%BACKUP_DIR%/config_%DATE%.tar.gz" .env docker-compose.yml docker-compose.override.yml nginx.conf 2>nul

echo Backup completed: %BACKUP_DIR%
dir "%BACKUP_DIR%"
EOF
    
    print_success "Backup scripts created!"
}

# Create monitoring script
create_monitoring_script() {
    print_info "Creating monitoring script..."
    
    cat > monitor.sh << 'EOF'
#!/bin/bash

echo "Live Streaming Encoder - System Monitor"
echo "========================================"

# Check if services are running
echo "Checking services..."
docker-compose ps

echo ""
echo "System Resources:"
echo "================="

# Check Docker containers
echo "Docker Containers:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

echo ""
echo "Disk Usage:"
echo "============"
df -h | grep -E "(Filesystem|/dev/sda|/dev/nvme)"

echo ""
echo "Application Logs (last 10 lines):"
echo "=================================="
docker-compose logs --tail=10 streaming-encoder

echo ""
echo "Recent System Logs:"
echo "=================="
if [[ -f "logs/system.log" ]]; then
    tail -10 logs/system.log
else
    echo "No system logs found."
fi

echo ""
echo "Health Checks:"
echo "=============="
echo "Dashboard: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health || echo "N/A")"
echo "HLS Server: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health || echo "N/A")"

echo ""
echo "Monitor completed at $(date)"
EOF
    
    chmod +x monitor.sh
    
    print_success "Monitoring script created!"
}

# Start services
start_services() {
    print_info "Starting Live Streaming Encoder services..."
    
    # Build and start services
    docker-compose down 2>/dev/null || true
    docker-compose build --no-cache
    docker-compose up -d
    
    # Wait for services to start
    print_info "Waiting for services to start..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Services started successfully!"
        
        echo ""
        echo "Service URLs:"
        echo "=============="
        echo "Dashboard: http://localhost:3000"
        echo "HLS Content: http://localhost:8080/hls/"
        echo "Health Check: http://localhost:8080/health"
        echo ""
        echo "Useful Commands:"
        echo "================="
        echo "View logs: docker-compose logs -f"
        echo "Stop services: docker-compose down"
        echo "Restart services: docker-compose restart"
        echo "Backup: ./backup.sh"
        echo "Monitor: ./monitor.sh"
        
    else
        print_error "Failed to start services!"
        docker-compose logs
        exit 1
    fi
}

# Main deployment function
main() {
    echo "=================================================================="
    echo "🎬 Live Streaming Encoder - Cross-Platform Deployment Script"
    echo "=================================================================="
    echo ""
    echo "Detected OS: $OS"
    echo ""
    
    # Check if running as root on Linux
    if [[ "$OS" == "ubuntu24" ]] && [[ $EUID -ne 0 ]]; then
        print_warning "Some operations require sudo privileges."
        print_info "You may be prompted for your password."
        echo ""
    fi
    
    # Installation steps
    print_info "Step 1: Installing dependencies..."
    install_dependencies
    
    print_info "Step 2: Setting up repository..."
    setup_repository
    
    print_info "Step 3: Creating environment configuration..."
    create_env_file
    
    print_info "Step 4: Creating directories..."
    create_directories
    
    print_info "Step 5: Setting up Docker configuration..."
    setup_docker
    
    print_info "Step 6: Creating utility scripts..."
    create_backup_script
    create_monitoring_script
    
    if [[ "$OS" == "ubuntu24" ]]; then
        print_info "Step 7: Creating systemd service..."
        create_systemd_service
    elif [[ "$OS" == "windows" ]]; then
        print_info "Step 7: Creating Windows service scripts..."
        create_windows_scripts
    fi
    
    print_info "Step 8: Starting services..."
    start_services
    
    echo ""
    echo "=================================================================="
    echo "🎉 Deployment completed successfully!"
    echo "=================================================================="
    echo ""
    echo "📋 Quick Start:"
    echo "==============="
    echo "1. Open your browser and go to: http://localhost:3000"
    echo "2. Configure your first stream in the Streams tab"
    echo "3. Schedule ad breaks in the Ad Scheduler tab"
    echo "4. Monitor system status in the Monitoring tab"
    echo ""
    echo "🛠️ Management Commands:"
    echo "======================"
    if [[ "$OS" == "ubuntu24" ]]; then
        echo "• Start service: sudo systemctl start streaming-encoder"
        echo "• Stop service: sudo systemctl stop streaming-encoder"
        echo "• Restart service: sudo systemctl restart streaming-encoder"
        echo "• View logs: sudo journalctl -u streaming-encoder -f"
    fi
    echo "• Docker logs: docker-compose logs -f [service-name]"
    echo "• Backup: ./backup.sh"
    echo "• Monitor: ./monitor.sh"
    echo ""
    if [[ "$OS" == "windows" ]]; then
        echo "🪟 Windows Scripts:"
        echo "=================="
        echo "• Start: start-streaming-encoder.bat"
        echo "• Stop: stop-streaming-encoder.bat"
        echo "• Restart: restart-streaming-encoder.bat"
        echo "• Status: status-streaming-encoder.bat"
        echo ""
    fi
    echo "📚 Documentation:"
    echo "==============="
    echo "• README.md - Project overview and features"
    echo "• DEPLOYMENT.md - Detailed deployment guide"
    echo "• TEST_RESULTS.md - Comprehensive test results"
    echo ""
    echo "🔧 Configuration Files:"
    echo "====================="
    echo "• .env - Environment variables"
    echo "• docker-compose.yml - Main Docker configuration"
    echo "• docker-compose.override.yml - Production overrides"
    echo "• nginx.conf - Nginx configuration"
    echo ""
    echo "🚀 Next Steps:"
    echo "============="
    echo "1. Configure your streams in the dashboard"
    echo "2. Set up your input sources (RTMP, HTTP, etc.)"
    echo "3. Configure output destinations"
    echo "4. Schedule ad breaks for your content"
    echo "5. Monitor system performance and logs"
    echo ""
    echo "=================================================================="
    echo "Happy Streaming! 🎬"
    echo "=================================================================="
    
    # Reminder for Ubuntu users
    if [[ "$OS" == "ubuntu24" ]] && [[ $EUID -ne 0 ]]; then
        echo ""
        print_warning "⚠️  Reminder: Log out and log back in to use Docker without sudo"
    fi
}

# Run main function
main "$@"