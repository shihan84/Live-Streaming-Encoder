# 🚀 Cross-Platform Deployment Scripts

This directory contains comprehensive deployment scripts for both **Ubuntu 24.04** and **Windows** (with Docker Desktop and WSL 2).

## 📋 Supported Platforms

### ✅ Ubuntu 24.04
- Native Docker and Docker Compose installation
- Systemd service creation
- Full integration with Linux utilities

### ✅ Windows
- Docker Desktop with WSL 2 integration
- Batch scripts for service management
- Windows-specific configuration

## 🛠️ Deployment Scripts

### 1. Universal Deployment Script (`deploy.sh`)

**Platform**: Ubuntu 24.04 and Windows (WSL/Git Bash)

```bash
# Make the script executable (Linux)
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

**Features:**
- ✅ Automatic OS detection
- ✅ Dependency installation (Docker, Docker Compose, Git)
- ✅ Repository cloning and updating
- ✅ Environment configuration
- ✅ Directory structure creation
- ✅ Docker configuration setup
- ✅ Systemd service creation (Ubuntu)
- ✅ Windows batch scripts (Windows)
- ✅ Backup and monitoring scripts
- ✅ Service startup and health checks

### 2. Windows Deployment Script (`deploy-windows.bat`)

**Platform**: Windows (Command Prompt/PowerShell)

```cmd
# Run the deployment
deploy-windows.bat
```

**Features:**
- ✅ Docker Desktop detection
- ✅ Git installation check
- ✅ Repository setup
- ✅ Environment file creation
- ✅ Windows batch script generation
- ✅ Backup and monitoring scripts
- ✅ Service management scripts

## 📁 Generated Files and Scripts

### Configuration Files
- `.env` - Environment variables with random secrets
- `docker-compose.override.yml` - Production Docker configuration
- `data/`, `hls/`, `logs/`, `backups/` - Required directories

### Ubuntu Scripts
- `backup.sh` - Automated backup script
- `monitor.sh` - System monitoring script
- Systemd service: `/etc/systemd/system/streaming-encoder.service`

### Windows Scripts
- `start-streaming-encoder.bat` - Start all services
- `stop-streaming-encoder.bat` - Stop all services
- `restart-streaming-encoder.bat` - Restart all services
- `status-streaming-encoder.bat` - Check service status
- `logs-streaming-encoder.bat` - View service logs
- `backup.bat` - Windows backup script
- `monitor.bat` - Windows monitoring script

## 🚀 Quick Start

### Ubuntu 24.04

```bash
# Download and run the deployment script
curl -fsSL https://raw.githubusercontent.com/shihan84/Live-Streaming-Encoder/main/deploy.sh | bash

# Or clone and run manually
git clone https://github.com/shihan84/Live-Streaming-Encoder.git
cd Live-Streaming-Encoder
chmod +x deploy.sh
./deploy.sh
```

### Windows

```cmd
# Download and run the Windows deployment script
# (Open Command Prompt as Administrator)

curl -fsSL https://raw.githubusercontent.com/shihan84/Live-Streaming-Encoder/main/deploy-windows.bat -o deploy-windows.bat
deploy-windows.bat

# Or clone and run manually
git clone https://github.com/shihan84/Live-Streaming-Encoder.git
cd Live-Streaming-Encoder
deploy-windows.bat
```

## 🎯 Post-Deployment Access

### Web Interface
- **Dashboard**: http://localhost:3000
- **HLS Content**: http://localhost:8080/hls/
- **Health Check**: http://localhost:8080/health

### Management Commands

#### Ubuntu 24.04
```bash
# Systemd service management
sudo systemctl start streaming-encoder
sudo systemctl stop streaming-encoder
sudo systemctl restart streaming-encoder
sudo systemctl status streaming-encoder

# View logs
sudo journalctl -u streaming-encoder -f

# Docker commands
docker-compose logs -f [service-name]
docker-compose ps
docker-compose down

# Utility scripts
./backup.sh
./monitor.sh
```

#### Windows
```cmd
# Service management
start-streaming-encoder.bat
stop-streaming-encoder.bat
restart-streaming-encoder.bat
status-streaming-encoder.bat

# View logs
logs-streaming-encoder.bat

# Docker commands
docker-compose logs -f [service-name]
docker-compose ps
docker-compose down

# Utility scripts
backup.bat
monitor.bat
```

## 🔧 Prerequisites

### Ubuntu 24.04
- ✅ Ubuntu 24.04 LTS
- ✅ Internet connection
- ✅ sudo privileges (for system-wide installations)

### Windows
- ✅ Windows 10/11
- ✅ Docker Desktop with WSL 2 integration
- ✅ Git for Windows
- ✅ Command Prompt/PowerShell (Run as Administrator)

## 📊 What Gets Installed

### Ubuntu 24.04
- Docker CE
- Docker Compose
- Nginx
- SQLite3
- Git
- curl, wget, unzip, jq, net-tools
- Systemd service

### Windows
- Docker Desktop (must be pre-installed)
- Docker Compose (auto-installed if missing)
- Git for Windows (must be pre-installed)

## 🛡️ Security Features

### Generated Secrets
- Random NEXTAUTH_SECRET for application security
- Secure database file location
- Proper file permissions (Ubuntu)

### Network Configuration
- Firewall rules (Ubuntu)
- Port configuration (3000, 8080)
- CORS configuration for HLS streaming

### Backup System
- Automated database backups
- Configuration file backups
- Optional HLS content backups
- Backup rotation (7-day retention)

## 📈 Monitoring and Maintenance

### System Monitoring
- Real-time service status
- Resource usage monitoring
- Log aggregation
- Health check endpoints

### Backup Strategy
- Automated daily backups
- Configuration versioning
- Easy restoration process
- Backup rotation management

### Log Management
- Centralized logging
- Real-time log streaming
- Log rotation
- Error tracking

## 🚨 Troubleshooting

### Common Issues

#### Docker Permission Issues (Ubuntu)
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and log back in
# OR use newgrp
newgrp docker
```

#### Port Conflicts
```bash
# Check port usage
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8080

# Kill conflicting processes
sudo kill -9 <PID>
```

#### Service Won't Start
```bash
# Check Docker status
sudo systemctl status docker

# Check container logs
docker-compose logs

# Restart Docker
sudo systemctl restart docker
```

#### Windows Docker Issues
1. Ensure WSL 2 is enabled in Docker Desktop
2. Check Docker Desktop is running
3. Verify WSL 2 integration is enabled
4. Restart Docker Desktop if needed

## 🔄 Updates and Maintenance

### Application Updates
```bash
# Pull latest changes
git pull origin master

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### System Updates
```bash
# Ubuntu
sudo apt update && sudo apt upgrade -y

# Update Docker
sudo apt update
sudo apt install --only-upgrade docker-ce docker-ce-cli containerd.io
```

### Backup Management
```bash
# Manual backup
./backup.sh

# View backups
ls -la backups/

# Restore from backup
sqlite3 backups/db_<date>.db ".restore data/dev.db"
```

## 📚 Documentation

- **README.md** - Project overview and features
- **DEPLOYMENT.md** - Detailed deployment guide
- **TEST_RESULTS.md** - Comprehensive test results
- **deploy.sh** - Universal deployment script
- **deploy-windows.bat** - Windows deployment script

## 🤝 Support

### Getting Help
1. Check the generated scripts and logs
2. Review the documentation files
3. Check Docker and system logs
4. Verify all prerequisites are met

### Common Solutions
- **Port conflicts**: Change ports in docker-compose.override.yml
- **Permission issues**: Run scripts with appropriate privileges
- **Docker issues**: Restart Docker service
- **Network issues**: Check firewall and port settings

---

## 🎉 Deployment Complete!

After running the deployment script, you'll have a fully functional live streaming encoder with:

- ✅ **Web Dashboard** for stream management
- ✅ **SCTE-35 Ad Scheduling** capabilities
- ✅ **Real-time Monitoring** and logging
- ✅ **Automated Backups** and maintenance
- ✅ **Cross-platform** support
- ✅ **Production-ready** configuration

**Happy Streaming! 🎬**