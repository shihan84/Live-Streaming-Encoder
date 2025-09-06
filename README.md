# 🎬 Live Streaming Encoder with SCTE-35 Ad Marker & Scheduler

A professional-grade live streaming encoder with comprehensive SCTE-35 ad marker support and scheduling capabilities, built with Docker and powered by superkabuki's SCTE-35 tools.

## ✨ Features

### 🎥 Core Streaming Features
- **Multi-bitrate Adaptive Bitrate (ABR) Streaming**
- **Real-time video encoding with FFmpeg**
- **HLS segmentation and delivery**
- **SCTE-35 ad marker injection**
- **Live stream monitoring and management**
- **WebSocket real-time status updates**

### 📺 SCTE-35 Ad Integration
- **SCTE-35 splice_insert and time_signal generation**
- **Ad break scheduling and automation**
- **Sidecar file generation**
- **HLS playlist SCTE-35 injection**
- **Provider ID and ad management**
- **Auto-return functionality**

### 🛠️ Professional Tools
- **FFmpeg with SCTE-35 patch (superkabuki/SCTE35_FFmpeg)**
- **threefive SCTE-35 library integration**
- **x9k3 HLS segmenter with SCTE-35 support**
- **adbreak3 fast SCTE-35 sidecar generation**
- **m3ufu SCTE-35 aware HLS parsing**

### 🎨 Modern Web Interface
- **Responsive dashboard with real-time updates**
- **Stream configuration and management**
- **Ad break scheduling interface**
- **System monitoring and logging**
- **Professional UI with shadcn/ui components**

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   FFmpeg +      │    │   SCTE-35       │
│   (Dashboard)   │◄──►│   SCTE-35       │◄──►│   Tools         │
│                 │    │   Encoder       │    │   (threefive,   │
│   WebSocket     │    │                 │    │    x9k3, etc.)  │
│   Real-time     │    │   HLS Output    │    │                 │
│   Updates       │    │                 │    │   Sidecar       │
└─────────────────┘    └─────────────────┘    │   Files         │
         │                     │              └─────────────────┘
         │                     │                       │
         ▼                     ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Database      │    │   Nginx         │    │   Redis         │
│   (SQLite)      │    │   HLS Serving   │    │   (Optional)    │
│                 │    │                 │    │                 │
│   Streams       │    │   Web Server    │    │   Caching       │
│   Ad Breaks     │    │                 │    │   Sessions       │
│   Sessions      │    │   CORS Support  │    │                 │
│   Logs          │    │                 │    │   Pub/Sub       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Basic understanding of live streaming concepts

### 1. Clone and Setup
```bash
git clone <repository-url>
cd live-streaming-encoder
```

### 2. Start the Application
```bash
# Start all services
docker-compose up -d

# Or start with specific profiles
docker-compose --profile tools up -d
```

### 3. Access the Application
- **Dashboard**: http://localhost:3000
- **HLS Content**: http://localhost:8080/hls/
- **Health Check**: http://localhost:8080/health

## 🐳 Docker Services

### Core Services
- **streaming-encoder**: Main Next.js application with dashboard
- **db**: SQLite database for storing configuration and logs
- **nginx**: Web server for HLS content delivery

### Tool Services (optional)
- **ffmpeg-scte35**: FFmpeg with SCTE-35 patch
- **scte35-tools**: SCTE-35 utilities (threefive, adbreak3, m3ufu)
- **hls-segmenter**: x9k3 HLS segmenter with SCTE-35
- **redis**: Caching and session management

## 📚 API Documentation

### Streams API
```bash
# Get all streams
GET /api/streams

# Create new stream
POST /api/streams
{
  "name": "Main Stream",
  "inputUrl": "rtmp://input.example.com/live/stream1",
  "outputUrl": "http://output.example.com/live/stream1.m3u8",
  "bitrate": 2500,
  "resolution": "1920x1080",
  "scte35Enabled": true
}

# Update stream
PUT /api/streams/[id]

# Delete stream
DELETE /api/streams/[id]
```

### Ad Breaks API
```bash
# Get all ad breaks
GET /api/adbreaks

# Create ad break
POST /api/adbreaks
{
  "streamId": "stream-id",
  "scheduledTime": "2024-01-15T14:30:00Z",
  "duration": 30,
  "adId": "ad001",
  "providerName": "YourProvider",
  "providerId": "0x1"
}

# Update ad break
PUT /api/adbreaks/[id]

# Delete ad break
DELETE /api/adbreaks/[id]
```

### Encoding Sessions API
```bash
# Get all encoding sessions
GET /api/encoding

# Start encoding session
POST /api/encoding
{
  "streamId": "stream-id"
}

# Update encoding session
PUT /api/encoding/[id]
{
  "status": "RUNNING",
  "progress": 75,
  "inputBytes": 1024000,
  "outputBytes": 512000
}

# Stop encoding session
DELETE /api/encoding/[id]
```

## 🔧 Configuration

### Environment Variables
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
```

### System Settings
Configure system settings through the dashboard UI or API:
- FFmpeg path and parameters
- HLS segmentation settings
- SCTE-35 provider configuration
- Output directories and paths

## 🎯 Usage Examples

### 1. Create a Live Stream
```bash
# Via API
curl -X POST http://localhost:3000/api/streams \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Live Event",
    "inputUrl": "rtmp://input.example.com/live/event",
    "outputUrl": "http://localhost:8080/hls/event.m3u8",
    "bitrate": 5000,
    "resolution": "1920x1080",
    "scte35Enabled": true
  }'
```

### 2. Schedule an Ad Break
```bash
# Via API
curl -X POST http://localhost:3000/api/adbreaks \
  -H "Content-Type: application/json" \
  -d '{
    "streamId": "stream-id",
    "scheduledTime": "2024-01-15T14:30:00Z",
    "duration": 30,
    "adId": "commercial-001",
    "providerName": "YourProvider"
  }'
```

### 3. Start Encoding
```bash
# Via API
curl -X POST http://localhost:3000/api/encoding \
  -H "Content-Type: application/json" \
  -d '{"streamId": "stream-id"}'
```

### 4. Generate SCTE-35 Sidecar File
```bash
# Using Docker tools
docker-compose run --rm scte35-tools \
  python /app/scripts/scte35-tools.py sidecar \
  adbreaks.json --output sidecar.json
```

## 🔍 Monitoring

### System Status
- **Encoder Status**: Real-time encoding status
- **SCTE-35 Service**: SCTE-35 marker generation status
- **HLS Segmenter**: Segmentation and injection status
- **Ad Scheduler**: Scheduled and triggered ad breaks

### Logs and Metrics
- **System Logs**: Comprehensive logging with different levels
- **Stream Metrics**: Bitrate, resolution, input/output bytes
- **Ad Break Metrics**: Scheduled, triggered, completed ad breaks
- **Performance Metrics**: Encoding progress and system health

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run database migrations
npm run db:push

# Run linting
npm run lint
```

### Building Custom Tools
```bash
# Build FFmpeg with SCTE-35
docker build -f Dockerfile.ffmpeg -t ffmpeg-scte35 .

# Build SCTE-35 tools
docker build -f Dockerfile.scte35 -t scte35-tools .

# Build HLS segmenter
docker build -f Dockerfile.x9k3 -t x9k3-segmenter .
```

## 📚 SCTE-35 Integration

### Supported SCTE-35 Commands
- **splice_insert**: Insert ad breaks with duration
- **time_signal**: Time-based ad break triggers
- **splice_null**: Null splice events
- **segmentation_descriptor**: Segment boundaries

### Integration with superkabuki Tools
- **SCTE35_FFmpeg**: FFmpeg with SCTE-35 pass-through
- **SCTE35_threefive**: Advanced SCTE-35 parsing and generation
- **SCTE35_x9k3**: HLS segmentation with SCTE-35 injection
- **adbreak3**: Fast SCTE-35 sidecar file generation
- **m3ufu**: SCTE-35 aware HLS playlist parsing

## 🔒 Security

### Best Practices
- **Input Validation**: All API inputs are validated
- **Authentication**: Ready for NextAuth.js integration
- **CORS**: Configured for HLS streaming
- **Rate Limiting**: Ready for production deployment
- **Secure Headers**: Nginx security headers configured

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale streaming-encoder=3

# Update services
docker-compose pull && docker-compose up -d
```

### Monitoring and Logging
- **Health Checks**: Built-in health check endpoints
- **Log Aggregation**: Centralized logging with different levels
- **Metrics**: Performance and usage metrics
- **Alerts**: Ready for integration with monitoring systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **superkabuki** for the excellent SCTE-35 tools and libraries
- **threefive** library for SCTE-35 parsing and generation
- **FFmpeg** for the powerful multimedia framework
- **Next.js** team for the amazing React framework
- **shadcn/ui** for the beautiful component library

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API examples

---

Built with ❤️ for professional live streaming. Powered by superkabuki's SCTE-35 tools 🎬
