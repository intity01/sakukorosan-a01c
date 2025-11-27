# 📁 Sakukoro Pomodoro - Project Structure

## 🏗️ โครงสร้างโปรเจค

```
sakukoro-pomodoro/
├── 📱 app/                      # Next.js App Router
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main page (entry point)
│
├── 🧩 components/               # React Components
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   ├── *-screen.tsx            # Screen components (Timer, Dashboard, Progress, Stats)
│   ├── *-dialog.tsx            # Dialog components
│   └── *.tsx                   # Other components
│
├── ⚡ electron/                 # Electron Main Process
│   ├── main.js                 # Main process entry
│   ├── preload.js              # Preload script (IPC bridge)
│   └── rate-limiter.js         # Rate limiting for IPC
│
├── 🪝 hooks/                    # Custom React Hooks
│   ├── use-mobile.ts           # Mobile detection
│   ├── use-performance.ts      # Performance monitoring
│   └── use-toast.ts            # Toast notifications
│
├── 📚 lib/                      # Utilities & Core Logic
│   ├── pomodoro-context.tsx    # Pomodoro state management
│   ├── themes.ts               # Theme configuration
│   ├── sounds.ts               # Sound effects
│   ├── security.ts             # Input sanitization
│   ├── analytics.ts            # Analytics tracking
│   ├── break-activities.ts     # Break activity suggestions
│   ├── config.ts               # App configuration
│   ├── debounce.ts             # Debounce utility
│   ├── idle-detector.ts        # Idle detection
│   ├── logger.ts               # Logging utility
│   ├── rate-limit.ts           # Rate limiting
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # General utilities
│
├── 🎨 public/                   # Static Assets
│   ├── *.png                   # Images & icons
│   ├── *.mp3                   # Sound files
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
│
├── 🎭 styles/                   # Additional Styles
│   └── globals.css             # Global CSS
│
├── 📝 types/                    # TypeScript Definitions
│   └── electron.d.ts           # Electron type definitions
│
├── 🔧 Configuration Files
│   ├── .env.example            # Environment variables template
│   ├── .env.local              # Local environment (dev)
│   ├── .env.production         # Production environment
│   ├── .gitignore              # Git ignore rules
│   ├── components.json         # shadcn/ui config
│   ├── next.config.mjs         # Next.js configuration
│   ├── next-env.d.ts           # Next.js types
│   ├── obfuscate.js            # Code obfuscation script
│   ├── obfuscator.config.json  # Obfuscator settings
│   ├── package.json            # Dependencies & scripts
│   ├── postcss.config.mjs      # PostCSS configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── README.md               # Project documentation
│
└── 📦 Build Output
    ├── .next/                  # Next.js build cache
    ├── out/                    # Static export output
    └── dist/                   # Electron build output
```

## 🎯 Key Components

### Main Application Flow
1. **app/page.tsx** - Entry point, handles screen navigation
2. **lib/pomodoro-context.tsx** - Global state management
3. **components/*-screen.tsx** - Individual screens
4. **electron/main.js** - Desktop app wrapper

### State Management
- Context API for global state
- localStorage for persistence
- IPC for Electron communication

### Styling
- Tailwind CSS for utility classes
- CSS variables for theming
- shadcn/ui for component library

## 🚀 Development Workflow

### Start Development
```bash
npm run electron:dev:simple
```

### Build for Production
```bash
npm run electron:build:win    # Windows
npm run electron:build:mac    # macOS
npm run electron:build:linux  # Linux
```

### Code Organization Rules
1. ✅ Components in `components/`
2. ✅ Business logic in `lib/`
3. ✅ Hooks in `hooks/`
4. ✅ Types in `types/` or inline
5. ✅ Static assets in `public/`

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `TimerScreen.tsx`)
- **Utilities**: camelCase (e.g., `debounce.ts`)
- **Hooks**: use-prefix (e.g., `use-toast.ts`)
- **Types**: PascalCase (e.g., `Task`, `Settings`)
- **Constants**: UPPER_SNAKE_CASE

## 🔒 Security Features

- Input sanitization in `lib/security.ts`
- Rate limiting in `electron/rate-limiter.js`
- CSP headers in `electron/main.js`
- No eval() or dangerous patterns

## 🎨 UI Architecture

- **Atomic Design**: ui/ → components/ → screens/
- **Responsive**: Mobile-first approach
- **Accessible**: ARIA labels, keyboard navigation
- **Themeable**: CSS variables + Tailwind

## 📊 Performance

- Code splitting with dynamic imports
- React.memo for expensive components
- Debounced inputs
- Optimized re-renders
