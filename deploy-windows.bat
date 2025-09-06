@echo off
setlocal enabledelayedexpansion

REM =============================================================================
REM Live Streaming Encoder - Windows Deployment Script
REM Requires: Docker Desktop with WSL 2 integration
REM =============================================================================

echo.
echo ============================================================================
echo 🎬 Live Streaming Encoder - Windows Deployment Script
echo ============================================================================
echo.

REM Check if Docker is installed
echo Checking for Docker Desktop...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Desktop is not installed!
    echo Please install Docker Desktop for Windows from:
    echo https://www.docker.com/products/docker-desktop/
    echo Then enable WSL 2 integration in Docker Desktop settings.
    pause
    exit /b 1
)

echo [SUCCESS] Docker Desktop found!

REM Check if Docker Compose is available
echo Checking for Docker Compose...
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Docker Compose not found. Installing...
    curl -SL https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-windows-x86_64.exe -o docker-compose.exe
    if exist "C:\Program Files\Docker\Docker\resources\bin" (
        move docker-compose.exe "C:\Program Files\Docker\Docker\resources\bin\" >nul
    ) else (
        move docker-compose.exe "%USERPROFILE%\AppData\Local\Docker\cli-plugins\" >nul
    )
    echo [SUCCESS] Docker Compose installed!
) else (
    echo [SUCCESS] Docker Compose found!
)

REM Check if Git is installed
echo Checking for Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo Please install Git for Windows from:
    echo https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [SUCCESS] Git found!

REM Create working directory
set WORK_DIR=%CD%\Live-Streaming-Encoder
if not exist "%WORK_DIR%" (
    echo Creating working directory...
    mkdir "%WORK_DIR%"
)
cd /d "%WORK_DIR%"

REM Clone or update repository
echo.
echo Step 1: Setting up repository...
if exist ".git" (
    echo Repository already exists. Updating...
    git pull origin master
) else (
    echo Cloning repository...
    git clone https://github.com/shihan84/Live-Streaming-Encoder.git .
)

REM Create environment file
echo.
echo Step 2: Creating environment configuration...
if exist ".env" (
    echo Environment file already exists. Backing up...
    copy ".env" ".env.backup" >nul
)

REM Generate random secret
for /f "tokens=*" %%a in ('powershell -Command "[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))"') do set SECRET=%%a

echo NODE_ENV=production> .env
echo DATABASE_URL=file:./dev.db>> .env
echo NEXTAUTH_URL=http://localhost:3000>> .env
echo NEXTAUTH_SECRET=%SECRET%>> .env
echo SCTE35_PROVIDER_ID=0x1>> .env
echo SCTE35_PROVIDER_NAME=YourProvider>> .env
echo SCTE35_AUTO_RETURN=true>> .env
echo NEXT_PUBLIC_WS_URL=http://localhost:3000>> .env
echo COMPOSE_CONVERT_WINDOWS_PATHS=1>> .env
echo [SUCCESS] Environment file created!

REM Create necessary directories
echo.
echo Step 3: Creating directories...
if not exist "data" mkdir data
if not exist "hls" mkdir hls
if not exist "logs" mkdir logs
if not exist "backups" mkdir backups
echo [SUCCESS] Directories created!

REM Create Docker override configuration
echo.
echo Step 4: Setting up Docker configuration...
echo version: '3.8'> docker-compose.override.yml
echo.>> docker-compose.override.yml
echo services:>> docker-compose.override.yml
echo   streaming-encoder:>> docker-compose.override.yml
echo     environment:>> docker-compose.override.yml
echo       - NODE_ENV=production>> docker-compose.override.yml
echo     volumes:>> docker-compose.override.yml
echo       - ./data:/app/data>> docker-compose.override.yml
echo       - ./hls:/var/www/hls>> docker-compose.override.yml
echo       - ./logs:/app/logs>> docker-compose.override.yml
echo     restart: unless-stopped>> docker-compose.override.yml
echo     deploy:>> docker-compose.override.yml
echo       resources:>> docker-compose.override.yml
echo         limits:>> docker-compose.override.yml
echo           cpus: '2.0'>> docker-compose.override.yml
echo           memory: 4G>> docker-compose.override.yml
echo         reservations:>> docker-compose.override.yml
echo           cpus: '1.0'>> docker-compose.override.yml
echo           memory: 2G>> docker-compose.override.yml
echo.>> docker-compose.override.yml
echo   nginx:>> docker-compose.override.yml
echo     volumes:>> docker-compose.override.yml
echo       - ./hls:/usr/share/nginx/html/hls:ro>> docker-compose.override.yml
echo       - ./nginx.conf:/etc/nginx/nginx.conf:ro>> docker-compose.override.yml
echo       - ./logs/nginx:/var/log/nginx>> docker-compose.override.yml
echo     restart: unless-stopped>> docker-compose.override.yml
echo.>> docker-compose.override.yml
echo   db:>> docker-compose.override.yml
echo     volumes:>> docker-compose.override.yml
echo       - ./data:/data>> docker-compose.override.yml
echo       - ./backups:/backups>> docker-compose.override.yml
echo     restart: unless-stopped>> docker-compose.override.yml
echo [SUCCESS] Docker configuration created!

REM Create Windows service scripts
echo.
echo Step 5: Creating Windows service scripts...

REM Start script
echo @echo off> start-streaming-encoder.bat
echo echo Starting Live Streaming Encoder...>> start-streaming-encoder.bat
echo cd /d "%%~dp0">> start-streaming-encoder.bat
echo docker-compose up -d>> start-streaming-encoder.bat
echo echo Services started successfully!>> start-streaming-encoder.bat
echo pause>> start-streaming-encoder.bat

REM Stop script
echo @echo off> stop-streaming-encoder.bat
echo echo Stopping Live Streaming Encoder...>> stop-streaming-encoder.bat
echo cd /d "%%~dp0">> stop-streaming-encoder.bat
echo docker-compose down>> stop-streaming-encoder.bat
echo echo Services stopped successfully!>> stop-streaming-encoder.bat
echo pause>> stop-streaming-encoder.bat

REM Restart script
echo @echo off> restart-streaming-encoder.bat
echo echo Restarting Live Streaming Encoder...>> restart-streaming-encoder.bat
echo cd /d "%%~dp0">> restart-streaming-encoder.bat
echo docker-compose down>> restart-streaming-encoder.bat
echo docker-compose up -d>> restart-streaming-encoder.bat
echo echo Services restarted successfully!>> restart-streaming-encoder.bat
echo pause>> restart-streaming-encoder.bat

REM Status script
echo @echo off> status-streaming-encoder.bat
echo echo Checking Live Streaming Encoder status...>> status-streaming-encoder.bat
echo cd /d "%%~dp0">> status-streaming-encoder.bat
echo docker-compose ps>> status-streaming-encoder.bat
echo pause>> status-streaming-encoder.bat

REM Logs script
echo @echo off> logs-streaming-encoder.bat
echo echo Showing Live Streaming Encoder logs...>> logs-streaming-encoder.bat
echo cd /d "%%~dp0">> logs-streaming-encoder.bat
echo docker-compose logs -f>> logs-streaming-encoder.bat
echo pause>> logs-streaming-encoder.bat

echo [SUCCESS] Windows service scripts created!

REM Create backup script
echo.
echo Step 6: Creating backup script...
echo @echo off> backup.bat
echo set BACKUP_DIR=./backups>> backup.bat
echo set DATE=%%date:~10,4%%%%date:~4,2%%%%date:~7,2%%_%%time:~0,2%%%%time:~3,2%%>> backup.bat
echo.>> backup.bat
echo echo Creating backup...>> backup.bat
echo.>> backup.bat
echo mkdir "%%BACKUP_DIR%%" 2^>nul>> backup.bat
echo.>> backup.bat
echo if exist "data\dev.db" (>> backup.bat
echo     echo Backing up database...>> backup.bat
echo     sqlite3 data/dev.db ".backup %%BACKUP_DIR%%/db_%%DATE%%.db">> backup.bat
echo )>> backup.bat
echo.>> backup.bat
echo echo Backing up configuration...>> backup.bat
echo tar -czf "%%BACKUP_DIR%%/config_%%DATE%%.tar.gz" .env docker-compose.yml docker-compose.override.yml nginx.conf 2^>nul>> backup.bat
echo.>> backup.bat
echo echo Backup completed: %%BACKUP_DIR%%>> backup.bat
echo dir "%%BACKUP_DIR%%">> backup.bat
echo [SUCCESS] Backup script created!

REM Create monitoring script
echo.
echo Step 7: Creating monitoring script...
echo @echo off> monitor.bat
echo echo Live Streaming Encoder - System Monitor>> monitor.bat
echo echo ========================================>> monitor.bat
echo.>> monitor.bat
echo echo Checking services...>> monitor.bat
echo docker-compose ps>> monitor.bat
echo.>> monitor.bat
echo echo.>> monitor.bat
echo echo System Resources:>> monitor.bat
echo echo ================>> monitor.bat
echo echo Docker Containers:>> monitor.bat
echo docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}">> monitor.bat
echo.>> monitor.bat
echo echo.>> monitor.bat
echo echo Service URLs:>> monitor.bat
echo echo ==============>> monitor.bat
echo echo Dashboard: http://localhost:3000>> monitor.bat
echo echo HLS Content: http://localhost:8080/hls/>> monitor.bat
echo echo Health Check: http://localhost:8080/health>> monitor.bat
echo.>> monitor.bat
echo echo Monitor completed at>> monitor.bat
echo date /t>> monitor.bat
echo time /t>> monitor.bat
echo [SUCCESS] Monitoring script created!

REM Start services
echo.
echo Step 8: Starting services...
echo Stopping existing services...
docker-compose down >nul 2>&1

echo Building and starting services...
docker-compose build --no-cache
if errorlevel 1 (
    echo [ERROR] Failed to build services!
    pause
    exit /b 1
)

docker-compose up -d
if errorlevel 1 (
    echo [ERROR] Failed to start services!
    docker-compose logs
    pause
    exit /b 1
)

echo Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check if services are running
docker-compose ps | find "Up" >nul
if errorlevel 1 (
    echo [ERROR] Failed to start services!
    docker-compose logs
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo 🎉 Deployment completed successfully!
echo ============================================================================
echo.
echo 📋 Quick Start:
echo ==============
echo 1. Open your browser and go to: http://localhost:3000
echo 2. Configure your first stream in the Streams tab
echo 3. Schedule ad breaks in the Ad Scheduler tab
echo 4. Monitor system status in the Monitoring tab
echo.
echo 🪟 Windows Scripts:
echo ==================
echo • Start: start-streaming-encoder.bat
echo • Stop: stop-streaming-encoder.bat
echo • Restart: restart-streaming-encoder.bat
echo • Status: status-streaming-encoder.bat
echo • Logs: logs-streaming-encoder.bat
echo • Backup: backup.bat
echo • Monitor: monitor.bat
echo.
echo 🛠️ Docker Commands:
echo ==================
echo • View logs: docker-compose logs -f [service-name]
echo • Stop services: docker-compose down
echo • Restart services: docker-compose restart
echo • View status: docker-compose ps
echo.
echo 📚 Documentation:
echo ===============
echo • README.md - Project overview and features
echo • DEPLOYMENT.md - Detailed deployment guide
echo • TEST_RESULTS.md - Comprehensive test results
echo.
echo 🚀 Next Steps:
echo =============
echo 1. Configure your streams in the dashboard
echo 2. Set up your input sources (RTMP, HTTP, etc.)
echo 3. Configure output destinations
echo 4. Schedule ad breaks for your content
echo 5. Monitor system performance and logs
echo.
echo 🔧 Configuration Files:
echo =====================
echo • .env - Environment variables
echo • docker-compose.yml - Main Docker configuration
echo • docker-compose.override.yml - Production overrides
echo • nginx.conf - Nginx configuration
echo.
echo ============================================================================
echo Happy Streaming! 🎬
echo ============================================================================
echo.

REM Display service URLs
echo Service URLs:
echo =============
echo Dashboard: http://localhost:3000
echo HLS Content: http://localhost:8080/hls/
echo Health Check: http://localhost:8080/health
echo.

pause