# 🍅 SakuDoko

<div align="center">

![SakuDoko Logo](public/SakuDoko-mascot.png)

**A beautiful, feature-rich Pomodoro timer desktop app to boost your productivity**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Keyboard Shortcuts](#%EF%B8%8F-keyboard-shortcuts) • [Development](#-development)

</div>

---

## ✨ Features

### 🎯 Core Functionality
- **Pomodoro Timer** - Focus sessions with short and long breaks
- **Task Management** - Create, organize, and track tasks with categories & priorities
- **Progress Tracking** - Visual calendar showing your productivity streak
- **Statistics & Analytics** - Detailed insights into your work patterns
- **Daily Goals** - Set and achieve daily Pomodoro targets

### 🖥️ Desktop Integration
- **Taskbar Animations** - Visual notifications and progress on your taskbar
- **System Tray Icon** - Flash animations on timer completion
- **Desktop Notifications** - Native OS notifications for timer events
- **Progress Bar** - Real-time progress display on Windows taskbar
- **Borderless Window** - Minimal, modern interface

### 🎨 User Experience
- **Beautiful UI** - Modern design with gradients and smooth animations
- **Empty States** - Helpful prompts when you're just starting
- **Loading States** - Visual feedback for all async operations
- **Toast Notifications** - Instant feedback for user actions
- **Auto-return Timer** - Returns to timer after 1 minute of inactivity

### ♿ Accessibility
- **Keyboard Shortcuts** - Full keyboard navigation support
- **ARIA Labels** - Screen reader friendly
- **Reduced Motion** - Respects user's motion preferences
- **Focus Indicators** - Clear visual focus for keyboard navigation

### 💾 Data Management
- **Export/Import** - Backup and restore your data
- **Auto-cleanup** - Automatic cleanup of old data
- **localStorage** - Secure local data storage
- **Data Persistence** - Never lose your progress

---

## 📸 Screenshots

### Timer Screen
Beautiful timer with multiple modes (Focus, Short Break, Long Break)

### Dashboard
Task management with categories, priorities, and progress tracking

### Progress & Stats
Visual calendar and detailed statistics of your productivity

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/intity01/sakudoko.git
cd sakudoko
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Run in development mode**
```bash
npm run electron:dev
```

4. **Build for production**
```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

---

## 🎮 Usage

### Timer Modes
- **Focus** (25 min) - Concentrate on your task
- **Short Break** (5 min) - Quick rest between sessions
- **Long Break** (15 min) - Extended rest after 4 focus sessions

### Task Management
1. Click the **+** button to add a new task
2. Select category (Work, Study, Personal, Health)
3. Set priority (Low, Medium, High)
4. Add estimated Pomodoros
5. Schedule with date and time (optional)

### Customization
- Open Settings (ESC key)
- Adjust timer durations
- Set daily goals
- Toggle sound and notifications
- Enable/disable keyboard shortcuts

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause timer |
| `R` | Reset timer |
| `Tab` or `↑↓` | Navigate between screens |
| `←→` | Navigate (alternative) |
| `ESC` | Toggle settings |

---

## 🛠️ Development

### Tech Stack
- **Framework**: Next.js 16.0.0
- **Desktop**: Electron 39.0.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **Icons**: Lucide React

### Project Structure
```
sakudoko/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── *.tsx             # Feature components
├── electron/             # Electron main process
├── lib/                  # Utilities and context
├── public/               # Static assets
├── styles/              # Global styles
└── types/               # TypeScript definitions
```

### Development Commands
```bash
# Start development server
npm run electron:dev

# Build for production
npm run electron:build:win   # Windows
npm run electron:build:mac   # macOS
npm run electron:build:linux # Linux

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Variables
Create `.env.local` for development:
```env
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

---

## 🏗️ Architecture

### Error Handling
- Error Boundaries for React component errors
- Try-catch blocks for async operations
- Graceful fallbacks for all features

### Performance
- React.memo for optimized rendering
- Lazy loading for heavy components
- Efficient state management

### Memory Management
- Proper cleanup of timers and listeners
- No memory leaks
- Efficient data structures

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Naphatsadon**
- Email: aoom5961@gmail.com
- GitHub: [@intity01](https://github.com/intity01)

---

## 🙏 Acknowledgments

- Pomodoro Technique® by Francesco Cirillo
- UI inspiration from modern design trends
- Community feedback and contributions

---

## 📊 Project Status

✅ **Production Ready** - Version 1.0.0

- [x] Core timer functionality
- [x] Task management
- [x] Desktop integration
- [x] Data persistence
- [x] Accessibility features
- [x] Error handling
- [x] Performance optimization
- [x] Production build ready

---

## 📂 Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed project organization.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## 🐛 Known Issues

- None currently. Please report issues on GitHub.

## 🔮 Roadmap

- [ ] Cloud sync
- [ ] Mobile app
- [ ] Team collaboration
- [ ] Custom sound effects
- [ ] Multi-language support

---

<div align="center">

**Made with ❤️ and ☕**

If you like this project, please consider giving it a ⭐!

[Report Bug](https://github.com/intity01/sakudoko/issues) · [Request Feature](https://github.com/intity01/sakudoko/issues)

</div>
