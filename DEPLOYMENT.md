# 🚀 Deployment Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git (for cloning the repository)
- Basic understanding of live streaming concepts

### 1. Clone the Repository
```bash
git clone https://github.com/shihan84/Live-Streaming-Encoder.git
cd Live-Streaming-Encoder
```

### 2. Start the Application
```bash
# Start all core services
docker-compose up -d

# Or start with all tools (FFmpeg, SCTE-35 tools, etc.)
docker-compose --profile tools up -d
```

### 3. Access the Application
- **Main Dashboard**: http://localhost:3000
- **HLS Content**: http://localhost:8080/hls/
- **Health Check**: http://localhost:8080/health

## 🐳 Docker Services

### Core Services (Always Running)
- **streaming-encoder**: Main Next.js application
- **db**: SQLite database
- **nginx**: HLS content delivery

### Tool Services (Optional)
- **ffmpeg-scte35**: FFmpeg with SCTE-35 patch
- **scte35-tools**: SCTE-35 utilities
- **hls-segmenter**: x9k3 HLS segmenter
- **redis**: Caching and sessions

## 📋 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=file:./dev.db

# Application
NODE_ENV=production
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# SCTE-35 Settings
SCTE35_PROVIDER_ID=0x1
SCTE35_PROVIDER_NAME=YourProvider
SCTE35_AUTO_RETURN=true

# WebSocket
NEXT_PUBLIC_WS_URL=http://localhost:3000
```

### System Configuration
Configure system settings through the dashboard UI:
1. Go to **Settings** tab
2. Configure FFmpeg path and parameters
3. Set HLS segmentation options
4. Configure SCTE-35 provider settings
5. Set output directories

## 🎥 Basic Usage

### 1. Create a Stream
1. Go to **Streams** tab
2. Fill in stream configuration:
   - Name: "Live Event"
   - Input URL: `rtmp://your-server/live/stream`
   - Output URL: `http://localhost:8080/hls/stream.m3u8`
   - Bitrate: 2500 kbps
   - Resolution: 1920x1080
   - Enable SCTE-35: ✅
3. Click **Start Encoding**

### 2. Schedule an Ad Break
1. Go to **Ad Scheduler** tab
2. Fill in ad break details:
   - Select Stream: Choose your stream
   - Scheduled Time: Future date/time
   - Duration: 30 seconds
   - Ad ID: "commercial-001"
   - Provider Name: "YourProvider"
3. Click **Schedule Ad Break**

### 3. Monitor the System
1. Go to **Monitoring** tab
2. View system status and metrics
3. Check real-time logs
4. Monitor encoding progress

## 🔧 Advanced Configuration

### Custom FFmpeg Build
```bash
# Build custom FFmpeg with SCTE-35
docker build -f Dockerfile.ffmpeg -t ffmpeg-scte35 .

# Build SCTE-35 tools
docker build -f Dockerfile.scte35 -t scte35-tools .

# Build HLS segmenter
docker build -f Dockerfile.x9k3 -t x9k3-segmenter .
```

### SCTE-35 Tools Usage
```bash
# Generate SCTE-35 sidecar file
docker-compose run --rm scte35-tools \
  python /app/scripts/scte35-tools.py sidecar \
  adbreaks.json --output sidecar.json

# Parse SCTE-35 from MPEG-TS
docker-compose run --rm scte35-tools \
  python /app/scripts/scte35-tools.py parse_ts \
  input.ts --output cues.json

# Inject SCTE-35 into HLS
docker-compose run --rm scte35-tools \
  python /app/scripts/scte35-tools.py inject_hls \
  playlist.m3u8 scte35_cues.json
```

### HLS Segmentation with x9k3
```bash
# Start HLS segmentation
docker-compose run --rm hls-segmenter \
  python /app/scripts/x9k3-segmenter.py start \
  --input rtmp://input.example.com/live/stream \
  --output stream \
  --bitrates 1000 2500 5000 \
  --resolutions 1280x720 1920x1080 1920x1080 \
  --scte35
```

## 📊 Monitoring

### System Health
```bash
# Check application health
curl http://localhost:3000/api/health

# Check nginx health
curl http://localhost:8080/health

# View container status
docker-compose ps
```

### Logs
```bash
# View application logs
docker-compose logs -f streaming-encoder

# View database logs
docker-compose logs -f db

# View nginx logs
docker-compose logs -f nginx

# View all logs
docker-compose logs -f
```

### Performance Monitoring
- **Encoding Progress**: Real-time progress in dashboard
- **System Metrics**: CPU, memory, disk usage
- **Stream Status**: Active streams and their status
- **Ad Break Tracking**: Scheduled and triggered ad breaks

## 🔒 Security

### Production Security
1. **Change Default Secrets**: Update NEXTAUTH_SECRET
2. **Use HTTPS**: Configure SSL certificates
3. **Firewall**: Restrict access to necessary ports
4. **Authentication**: Enable NextAuth.js for user management
5. **Rate Limiting**: Implement API rate limiting

### Network Security
```bash
# Expose only necessary ports
ports:
  - "3000:3000"   # Dashboard
  - "8080:80"     # HLS content
  - "1935:1935"   # RTMP input (optional)

# Use internal networking for services
networks:
  streaming-network:
    driver: bridge
    internal: true
```

## 🚀 Production Deployment

### Docker Compose Production
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  streaming-encoder:
    build: .
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:/data/prod.db
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
```

### Scaling
```bash
# Scale the application
docker-compose up -d --scale streaming-encoder=3

# Load balancing with nginx
upstream streaming_backend {
    server streaming-encoder:3000;
    server streaming-encoder:3001;
    server streaming-encoder:3002;
}
```

### Backup Strategy
```bash
# Backup database
docker-compose exec db sqlite3 /data/dev.db ".backup /backups/db_$(date +%Y%m%d).db"

# Backup configuration
tar -czf configs_$(date +%Y%m%d).tar.gz docker-compose.yml .env

# Backup HLS content (if needed)
tar -czf hls_$(date +%Y%m%d).tar.gz hls/
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check container logs
docker-compose logs streaming-encoder

# Check port conflicts
netstat -tulpn | grep :3000

# Restart services
docker-compose restart
```

#### 2. Database Issues
```bash
# Check database file
ls -la data/

# Recreate database
docker-compose down -v
docker-compose up -d
```

#### 3. Encoding Problems
```bash
# Check FFmpeg availability
docker-compose run --rm ffmpeg-scte35 ffmpeg -version

# Check input stream
ffplay rtmp://input.example.com/live/stream

# Check output directory
ls -la hls/
```

#### 4. WebSocket Issues
```bash
# Check WebSocket connectivity
curl -I http://localhost:3000/api/socketio/

# Check Socket.IO logs
docker-compose logs streaming-encoder | grep socket
```

### Performance Issues
```bash
# Monitor resource usage
docker stats

# Check encoding performance
docker-compose exec streaming-encoder ps aux

# Optimize FFmpeg settings
# Update system settings in dashboard
```

## 📚 API Reference

### Streams API
```bash
# Get all streams
GET /api/streams

# Create stream
POST /api/streams
{
  "name": "Stream Name",
  "inputUrl": "rtmp://...",
  "outputUrl": "http://...",
  "bitrate": 2500,
  "resolution": "1920x1080",
  "scte35Enabled": true
}
```

### Ad Breaks API
```bash
# Get all ad breaks
GET /api/adbreaks

# Create ad break
POST /api/adbreaks
{
  "streamId": "stream-id",
  "scheduledTime": "2025-01-01T12:00:00Z",
  "duration": 30,
  "adId": "ad-001"
}
```

### Encoding API
```bash
# Get encoding sessions
GET /api/encoding

# Start encoding
POST /api/encoding
{
  "streamId": "stream-id"
}
```

## 🤝 Support

### Getting Help
1. **Documentation**: Read this guide and TEST_RESULTS.md
2. **Issues**: Check GitHub issues
3. **Logs**: Review application and system logs
4. **Community**: Ask questions in discussions

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Happy Streaming! 🎬**