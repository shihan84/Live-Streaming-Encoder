# MediaLive Encoder

![AWS Elemental MediaLive Inspired Theme](https://img.shields.io/badge/Theme-AWS%20Elemental%20MediaLive-orange?style=for-the-badge&logo=amazon&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-cyan?style=for-the-badge&logo=tailwindcss&logoColor=white)

A professional, enterprise-grade live streaming encoder with SCTE-35 ad marker and scheduler support, inspired by AWS Elemental MediaLive. Built with Next.js 15, TypeScript, and featuring a stunning orange/dark gradient theme.

## 🎯 Features

### Core Functionality
- **Live Streaming Encoder**: Professional-grade video encoding with multiple input/output support
- **SCTE-35 Integration**: Complete ad marker and scheduling system
- **Multi-format Support**: RTMP, SRT, NDI, UDP, and DeckLink input sources
- **Real-time Monitoring**: System health, channel status, and performance metrics
- **Channel Management**: Create, configure, and manage multiple streaming channels
- **Encoding Profiles**: Advanced video/audio encoding presets and configurations
- **Event Scheduling**: Automated ad break scheduling and triggering
- **Professional UI**: AWS Elemental MediaLive-inspired dark theme with orange accents

### Technical Features
- **Next.js 15**: Latest Next.js with App Router and server components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS 4**: Modern utility-first CSS framework
- **shadcn/ui**: Professional UI component library
- **Prisma ORM**: Database management with SQLite
- **Docker Support**: Containerized deployment ready
- **WebSocket Support**: Real-time updates and notifications
- **REST API**: Complete backend API for all operations

### UI/UX Features
- **AWS Elemental MediaLive Theme**: Professional dark theme with orange gradients
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Real-time Updates**: Live status updates and monitoring
- **Professional Navigation**: Multi-level sidebar with collapsible sections
- **Interactive Dashboard**: Comprehensive system overview and metrics
- **Advanced Filtering**: Search and filter capabilities across all sections
- **Accessibility**: WCAG compliant with proper contrast and navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medialive-encoder.git
   cd medialive-encoder
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
medialive-encoder/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── streams/        # Stream management API
│   │   │   ├── adbreaks/       # Ad break management API
│   │   │   └── encoding/       # Encoding session API
│   │   ├── channels/          # Channel management page
│   │   ├── dashboard/         # Main dashboard
│   │   ├── inputs/            # Input sources management
│   │   ├── profiles/          # Encoding profiles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page (redirect)
│   ├── components/            # Reusable components
│   │   ├── layout/            # Layout components
│   │   │   ├── sidebar.tsx     # Navigation sidebar
│   │   │   └── header.tsx      # Page header
│   │   ├── theme-toggle.tsx   # Theme toggle
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utility libraries
│   │   ├── db.ts              # Database client
│   │   ├── socket.ts          # WebSocket logic
│   │   └── utils.ts           # Utility functions
│   └── app/
│       └── globals.css         # Global styles and AWS theme
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── docker-compose.yml         # Docker configuration
├── Dockerfile                 # Docker image
├── .gitignore                # Git ignore rules
├── package.json              # Project dependencies
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                 # This file
```

## 🎨 AWS Elemental MediaLive Theme

The application features a professional dark theme inspired by AWS Elemental MediaLive:

### Color Scheme
- **Primary Orange**: `#ff9900` (AWS brand color)
- **Dark Background**: `#0f1419` (Deep space gray)
- **Card Background**: `#1a1f36` (Dark blue-gray)
- **Text Primary**: `#ffffff` (White)
- **Text Secondary**: `#d1d5db` (Light gray)

### Theme Classes
- `.aws-gradient`: Main orange gradient for branding
- `.aws-gradient-dark`: Dark background gradients
- `.aws-metric-card`: Professional metric card styling
- `.aws-button-gradient`: Orange gradient buttons
- `.aws-progress-bar`: Orange gradient progress indicators
- `.aws-scrollbar`: Custom orange-themed scrollbars

### Visual Effects
- **Glass Morphism**: Backdrop blur effects on cards
- **Smooth Animations**: Hover transitions and pulsing indicators
- **Professional Gradients**: Multi-layer gradient backgrounds
- **Glow Effects**: Subtle glow on important elements

## 📊 API Documentation

### Streams API
- `GET /api/streams` - Get all streams
- `POST /api/streams` - Create new stream
- `GET /api/streams/[id]` - Get specific stream
- `PUT /api/streams/[id]` - Update stream
- `DELETE /api/streams/[id]` - Delete stream

### Ad Breaks API
- `GET /api/adbreaks` - Get all ad breaks
- `POST /api/adbreaks` - Create new ad break
- `GET /api/adbreaks/[id]` - Get specific ad break
- `PUT /api/adbreaks/[id]` - Update ad break
- `DELETE /api/adbreaks/[id]` - Delete ad break

### Encoding Sessions API
- `GET /api/encoding` - Get all encoding sessions
- `POST /api/encoding` - Start encoding session

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Application
NEXT_PUBLIC_APP_NAME="MediaLive Encoder"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# FFmpeg Configuration
FFMPEG_PATH="/usr/local/bin/ffmpeg"
FFMPEG_LOG_LEVEL="info"

# SCTE-35 Configuration
SCTE35_ENABLED=true
SCTE35_PROVIDER="YourProvider"
SCTE35_PROVIDER_ID="0x1"

# HLS Configuration
HLS_SEGMENT_DURATION=6
HLS_PLAYLIST_SIZE=5
HLS_OUTPUT_DIR="/var/www/hls"
```

### Database Schema

The application uses Prisma ORM with SQLite. The main entities include:

- **Streams**: Live streaming channel configurations
- **EncodingSessions**: Active encoding session tracking
- **AdBreaks**: SCTE-35 ad break scheduling and management
- **SystemSettings**: Application-wide configuration
- **SystemLogs**: Application logging and auditing

## 🐳 Docker Deployment

### Building the Image

```bash
docker build -t medialive-encoder .
```

### Running with Docker Compose

```bash
docker-compose up -d
```

### Docker Compose Configuration

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./data/app.db
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t medialive-encoder:latest .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 medialive-encoder:latest
   ```

### Traditional Server Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📈 Monitoring & Logging

### System Monitoring
- **CPU Usage**: Real-time CPU utilization tracking
- **Memory Usage**: Memory consumption monitoring
- **Disk Usage**: Storage space monitoring
- **Network I/O**: Network traffic monitoring

### Application Logging
- **System Logs**: Application-level logging
- **Error Tracking**: Error and exception logging
- **Performance Metrics**: Request timing and performance data
- **Audit Logs**: User actions and system changes

### Real-time Updates
- **WebSocket Support**: Live status updates
- **Event Notifications**: Real-time alert system
- **Health Checks**: System health monitoring
- **Metrics Dashboard**: Comprehensive performance metrics

## 🔒 Security Features

### Authentication & Authorization
- **Session Management**: Secure user sessions
- **Role-based Access**: User permission management
- **API Key Management**: Secure API key generation and management
- **Audit Logging**: Complete audit trail of user actions

### Data Protection
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries with Prisma
- **XSS Protection**: Content Security Policy implementation
- **CSRF Protection**: Cross-site request forgery prevention

### Network Security
- **HTTPS Support**: SSL/TLS encryption
- **CORS Configuration**: Cross-origin resource sharing setup
- **Rate Limiting**: API request rate limiting
- **Security Headers**: Comprehensive security header implementation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Code Style

- **TypeScript**: Strict TypeScript mode enabled
- **ESLint**: Code linting with Next.js rules
- **Prettier**: Code formatting (if configured)
- **Conventional Commits**: Commit message formatting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AWS Elemental MediaLive**: Inspiration for the UI/UX design
- **Next.js Team**: For the excellent React framework
- **shadcn/ui**: For the beautiful UI components
- **Tailwind CSS**: For the utility-first CSS framework
- **Prisma**: For the excellent ORM
- **SuperKabuki**: For the SCTE-35 libraries and tools

## 📞 Support

If you encounter any issues or have questions:

1. **Check the documentation**: Review this README and inline code comments
2. **Search existing issues**: Check GitHub Issues for similar problems
3. **Create a new issue**: Provide detailed information about your problem
4. **Join discussions**: Participate in GitHub Discussions

## 📊 Project Status

- ✅ **Core Architecture**: Next.js 15 with App Router
- ✅ **Database Layer**: Prisma ORM with SQLite
- ✅ **API Layer**: RESTful API endpoints
- ✅ **UI Components**: Professional interface with AWS theme
- ✅ **Real-time Features**: WebSocket support
- ✅ **Docker Support**: Containerization ready
- 🚧 **Advanced Features**: Additional encoding profiles and monitoring
- 🚧 **Testing**: Comprehensive test suite
- 🚧 **Documentation**: Extended API documentation

---

Built with ❤️ using Next.js, TypeScript, and inspired by AWS Elemental MediaLive