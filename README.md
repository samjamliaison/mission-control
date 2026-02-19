# Mission Control 🚀

> Advanced task management dashboard for OpenClaw operations

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/samjamliaison/mission-control)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Mission Control is a premium, glass-morphism styled command center for managing tasks, content pipelines, team operations, and memory systems. Built with modern web technologies and designed for high-performance mission-critical operations.

## ✨ Features

### 🎯 **Task Management**
- **Kanban Board**: Drag-and-drop task organization with visual status tracking
- **Agent Assignment**: Assign tasks to team members (Hamza, Manus, Monica, Jarvis, Luna)
- **Priority Levels**: Low, Medium, High priority with visual indicators
- **Real-time Updates**: Instant synchronization with local storage persistence

### 🎬 **Content Pipeline**
- **Multi-Platform Support**: YouTube, Blog, X/Twitter content management
- **Status Tracking**: Idea → Script → Production → Review → Published
- **Rich Metadata**: Thumbnails, scripts, assignees, and platform-specific details
- **Visual Progress**: Glass-morphism cards with status-based styling

### 👥 **Team Dashboard**
- **Agent Profiles**: Individual team member management and status tracking
- **Efficiency Metrics**: Real-time performance monitoring
- **Role-Based Views**: Mission Commander, Chief of Staff, Creative Director roles
- **Interactive Agent Cards**: Detailed profiles with avatars and specializations

### 🧠 **Memory System**
- **Knowledge Base**: Persistent memory storage for important information
- **Search & Filter**: Quickly find relevant memories and insights
- **Categorization**: Organized memory entries with timestamps
- **Export/Import**: Backup and restore memory data

### 🏢 **Office View**
- **3D Workspace**: Interactive office environment visualization
- **Agent Workstations**: Individual workspace monitoring
- **System Status**: Real-time operational status displays
- **Ambient Animations**: Smooth, professional interface movements

### ⚙️ **Settings & Data Management**
- **Data Export/Import**: Full backup and restore capabilities
- **Storage Analytics**: Visual storage usage and statistics
- **Local Persistence**: Client-side data storage with localStorage
- **Privacy First**: All data stays on your device

## 🖼️ Screenshots

*Screenshots coming soon - the interface features a stunning dark glass-morphism design with cyan accents, animated gradients, and premium visual effects.*

## 🛠️ Tech Stack

### **Frontend**
- **[Next.js 16.1.6](https://nextjs.org/)** - React framework with App Router
- **[TypeScript 5.0](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Advanced animations

### **UI/UX**
- **[Lucide React](https://lucide.dev/)** - Beautiful icon system
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Hello Pangea DnD](https://github.com/hello-pangea/dnd)** - Drag and drop interactions
- **Custom Glass Morphism** - Premium visual effects

### **Development**
- **[Vitest](https://vitest.dev/)** - Fast unit testing
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[ESLint](https://eslint.org/)** - Code linting
- **Performance Optimizations** - Lazy loading, code splitting

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **yarn** or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samjamliaison/mission-control.git
   cd mission-control
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Or export static files
npm run build && npm run export
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── (routes)/          # Page routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles & design system
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── tasks/             # Task management
│   ├── pipeline/          # Content pipeline
│   ├── team/              # Team dashboard
│   ├── memory/            # Memory system
│   └── settings/          # Settings & data management
├── contexts/              # React contexts (Toast, etc.)
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## 🎨 Design System

Mission Control uses a custom **Command Center Theme** with:

- **Dark Terminal Luxury** aesthetic
- **Glass Morphism** effects with subtle transparency
- **Gradient Mesh Blobs** for organic visual depth
- **WCAG AA Compliant** contrast ratios (4.5:1+)
- **Subtle Noise Textures** for premium feel
- **Smooth Animations** with Framer Motion

### Color Palette

```css
/* Primary Colors */
--command-accent: #06b6d4 (cyan)
--command-success: #22c55e (green)
--command-warning: #f59e0b (amber)
--command-danger: #ef4444 (red)

/* Surface Colors */
--command-background: #09090b
--command-surface: rgba(255,255,255,0.03)
--command-border: rgba(255,255,255,0.06)
```

## 🧪 Testing

### Unit Tests
```bash
npm run test          # Run unit tests
npm run test:ui       # Run with UI
npm run test:coverage # Generate coverage report
```

### End-to-End Tests
```bash
npm run test:e2e      # Run E2E tests
npm run test:e2e:ui   # Run with Playwright UI
```

### All Tests
```bash
npm run test:all      # Run both unit and E2E tests
```

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `start` | Start production server |
| `lint` | Run ESLint |
| `test` | Run unit tests |
| `test:e2e` | Run E2E tests |

## 🐳 Production Deployment

Mission Control is **production-ready** with multiple deployment options:

### ✅ Build Status
- **Zero TypeScript errors**
- **All 21 pages compile successfully** 
- **Docker optimized with multi-stage build**
- **Health checks configured**
- **Standalone output enabled**

### Option 1: Docker (Recommended)

```bash
# Build production image
docker build -t mission-control .

# Run container
docker run -p 3000:3000 mission-control

# The app will be available at http://localhost:3000
```

### Option 2: Docker Compose

```bash
# Standard deployment
docker-compose up -d

# With nginx reverse proxy
docker-compose --profile with-nginx up -d
```

### Option 3: Node.js Server

```bash
# Build for production
npm run build

# Start production server
npm run start

# Test the build
curl -I http://localhost:3000
```

### Option 4: Platform Deployment

**Vercel (Recommended):**
1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

**Netlify:**
1. Build command: `npm run build`
2. Publish directory: `.next`

### Docker Configuration

The included Dockerfile provides:
- **Multi-stage build** for minimal image size
- **Node.js 20 Alpine** base image  
- **Non-root user** for security
- **Health checks** for container monitoring
- **Optimized layer caching**

### Environment Variables

```env
# Production
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create your feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow the existing patterns and use TypeScript
- **Testing**: Add tests for new features
- **Performance**: Maintain lazy loading and optimization practices
- **Accessibility**: Ensure WCAG AA compliance
- **Design**: Follow the glass-morphism design system

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help:

- **Open an Issue**: [GitHub Issues](https://github.com/samjamliaison/mission-control/issues)
- **Documentation**: Check the code comments and component documentation
- **Community**: Join discussions in the repository

## 🏆 Acknowledgments

- **OpenClaw Team** for the mission requirements and vision
- **Next.js Team** for the incredible framework
- **Vercel** for the deployment platform
- **Open Source Community** for the amazing tools and libraries

---

**Built with ❤️ for mission-critical operations** • [GitHub](https://github.com/samjamliaison/mission-control) • [Live Demo](https://mission-control.vercel.app)