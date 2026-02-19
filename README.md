# Mission Control 🚀

[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)](https://github.com/samjamliaison/mission-control)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Compatible-blue)](https://openclaw.com/)

**Advanced Command Center Dashboard for OpenClaw Operations**

Mission Control is a comprehensive task management and operational dashboard designed specifically for OpenClaw environments. Built with Next.js and featuring real-time agent integration, advanced visualization, and enterprise-grade functionality.

## 🌟 Features Overview

### **Core Dashboard**
- **Real-time System Monitoring** - Live OpenClaw agent status, session tracking, and cron job management
- **Advanced Analytics** - Performance insights, team efficiency metrics, and activity feeds
- **Command Center Interface** - Military-inspired UI with glass morphism design
- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile devices

### **Task Management**
- **Dynamic Kanban Board** - Customizable columns with drag-and-drop functionality
- **Column Customization** - Rename, add/remove columns, custom colors, persistent settings
- **Time Tracking** - Start/stop timers on tasks, elapsed time display, session persistence
- **Bulk Operations** - Multi-select tasks, bulk status changes, assignee updates
- **Smart Filtering** - Filter by assignee, status, priority, and due dates
- **Task Templates** - Pre-configured templates for common task types
- **Keyboard Shortcuts** - Quick actions and navigation with hotkeys
- **Print Support** - Clean print layouts for offline task management

### **Team Management** 
- **Live Agent Status** - Real-time monitoring of all OpenClaw agents
- **Agent Chat Simulation** - Interactive chat interfaces with personality-based conversations
- **Team Performance** - Efficiency metrics, task completion rates, and workload distribution
- **Agent Profiles** - Detailed views with skills, expertise, and recent activity
- **Workspace Integration** - Direct connection to OpenClaw API for live data

### **Content Pipeline**
- **Content Creation Workflow** - From ideation to publication tracking
- **Multi-platform Support** - YouTube, Blog, X (Twitter), and custom platforms
- **Status Tracking** - Draft, review, scheduled, published states
- **Collaborative Features** - Team assignments and review processes
- **Export Capabilities** - JSON export for backup and analysis
- **Print Support** - Professional layouts for content planning

### **Calendar & Scheduling**
- **Event Management** - Create, edit, and track scheduled events
- **Agent Assignments** - Assign events to specific OpenClaw agents
- **Visual Calendar** - Monthly grid view with event details
- **Time-based Filtering** - View events by date ranges and agent assignments
- **Print Support** - Calendar layouts for offline planning

### **Memory System**
- **Knowledge Base** - Store and organize important information
- **Agent Memories** - Track insights and learnings from agent interactions
- **Search & Filter** - Quick access to stored knowledge
- **Tagging System** - Organize memories with custom tags
- **Export Features** - Backup and share knowledge bases

### **Advanced Features**
- **Starred/Favorites System** - Quick access to important items across all sections
- **Command Palette** - Global search and quick actions (Cmd/Ctrl+K)
- **Undo System** - Revert recent actions with confidence
- **Dark Mode** - Professional dark interface optimized for extended use
- **Activity Logging** - Comprehensive audit trail of all system actions
- **Export Tools** - CSV and JSON export for all data types
- **Offline Capabilities** - Print support for all major sections

### **Data Persistence**
- **LocalStorage Integration** - Client-side data persistence for offline work
- **Real-time Sync** - Live updates from OpenClaw APIs when connected
- **Data Export** - Backup capabilities for all stored information
- **Session Management** - Maintains state across browser sessions

### **User Experience**
- **Glass Morphism UI** - Modern, translucent design elements
- **Smooth Animations** - Framer Motion powered transitions and interactions
- **Loading States** - Skeleton loaders and progress indicators
- **Error Boundaries** - Graceful error handling and recovery
- **Accessibility** - Keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- OpenClaw environment (for live agent integration)

### Installation

```bash
# Clone the repository
git clone https://github.com/samjamliaison/mission-control.git
cd mission-control

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm run start
```

### Configuration

1. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

2. **OpenClaw Integration**
   - Ensure OpenClaw APIs are accessible
   - Configure agent endpoints in environment variables

3. **Development**
   ```bash
   # Development server with hot reload
   npm run dev

   # Run tests
   npm test

   # Lint and format
   npm run lint
   npm run format
   ```

## 📋 Usage

### Task Management
1. **Create Tasks** - Use the "Deploy Task" button or press `N`
2. **Organize** - Drag tasks between customizable columns
3. **Track Time** - Click the timer icon on any task card
4. **Bulk Actions** - Enable selection mode for multi-task operations
5. **Print** - Use the print button for offline task lists

### Team Monitoring  
1. **View Agents** - Real-time status of all OpenClaw agents
2. **Chat Simulation** - Click any agent to open chat interface
3. **Performance** - Monitor efficiency and task completion rates

### Content Pipeline
1. **Create Content** - Add new content items with platform targeting
2. **Track Progress** - Move through draft, review, and published states
3. **Collaborate** - Assign content to team members

### Calendar
1. **Schedule Events** - Click any date to create new events
2. **Assign Agents** - Delegate events to specific team members
3. **View Planning** - Monthly overview of all scheduled activities

## 🔧 Technical Stack

- **Framework**: Next.js 16.1.6 with Turbopack
- **UI Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Drag & Drop**: @hello-pangea/dnd
- **State Management**: React Hooks + LocalStorage
- **Build Tool**: Next.js with TypeScript
- **Deployment**: Vercel-ready with Docker support

## 🎨 Design System

Mission Control features a custom design system inspired by command centers and military operations:

- **Color Palette**: Dark theme with cyan accents and glass morphism
- **Typography**: Geist and Plus Jakarta Sans for professional readability
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design with desktop optimizations

## 📖 API Integration

### OpenClaw Endpoints
- `/api/agents` - Live agent status and management
- `/api/sessions` - Active session monitoring
- `/api/cron` - Scheduled task management
- `/api/tasks` - Task CRUD operations
- `/api/calendar` - Event management
- `/api/memory` - Knowledge base operations

### Data Flow
1. **Real-time Updates** - Live polling of OpenClaw APIs
2. **Local Persistence** - Client-side storage for offline capability
3. **Sync Strategy** - Merge remote and local changes intelligently

## 🔒 Security & Privacy

- **Client-side Data** - Sensitive information stays in browser
- **API Authentication** - Secure communication with OpenClaw services
- **Data Validation** - Input sanitization and type checking
- **Error Handling** - Graceful degradation for security failures

## 📱 Mobile Experience

Mission Control is fully responsive with mobile-optimized features:
- **Touch Interactions** - Optimized for mobile gestures
- **Compact Layouts** - Efficient use of screen space
- **Offline Capability** - Full functionality without internet
- **Performance** - Optimized loading and smooth animations

## 🤝 Contributing

We welcome contributions to Mission Control! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Component-based architecture
- Responsive design principles

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenClaw Team** - For the powerful agent framework
- **Next.js Team** - For the excellent React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For beautiful animations

## 📞 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/samjamliaison/mission-control/issues)
- **Discussions**: [GitHub Discussions](https://github.com/samjamliaison/mission-control/discussions)
- **Documentation**: [Wiki](https://github.com/samjamliaison/mission-control/wiki)

---

**Mission Control v1.0.0** - Built with ❤️ for the OpenClaw community

*"Command your operations with precision and style"*