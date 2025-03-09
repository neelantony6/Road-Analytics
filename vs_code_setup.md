# VS Code Setup Guide for Road Safety Analytics Project

## Prerequisites
1. Install Visual Studio Code
2. Install Node.js (version 20.x recommended)
3. Install the following VS Code extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense

## Project Setup Steps

### 1. Create Project Structure
Create the following folder structure:
```
road-safety-analytics/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── charts/
│       │   ├── ui/
│       │   └── search/
│       ├── lib/
│       ├── pages/
│       ├── hooks/
│       └── types/
└── shared/
```

### 2. Environment Setup

Create `.env` file in the client directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_DATABASE_URL=https://alt-coursework-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 3. Install Dependencies

Run the following commands in the project root:
```bash
npm install
```

Key dependencies include:
- React and React DOM
- TypeScript
- Vite
- TanStack Query
- Chakra UI
- Firebase
- Zod
- React Hook Form
- Wouter
- Tailwind CSS

### 4. Configuration Files

Create the following configuration files:

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

#### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {}
  },
  plugins: [require("tailwindcss-animate")]
};
```

### 5. Scripts

Add these scripts to your package.json:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  }
}
```

### 6. Running the Project

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at `http://localhost:5173`

### 7. VS Code Workspace Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### 8. Firebase Setup

1. Go to Firebase Console
2. Create a new project
3. Enable Realtime Database
4. Set up Authentication if needed
5. Add your app's domain to authorized domains
6. Copy the configuration values to your .env file

### 9. Development Guidelines

1. Use the existing component structure in `src/components`
2. Follow the established routing pattern in `App.tsx`
3. Keep form validations in their respective components
4. Use the Firebase service for data operations
5. Maintain the existing theming system

### 10. Common Issues and Solutions

1. If you encounter module resolution errors:
   - Check the path aliases in tsconfig.json
   - Verify vite.config.ts aliases match
   
2. For Firebase connection issues:
   - Verify environment variables are correctly set
   - Check Firebase Console for correct configuration
   
3. For TypeScript errors:
   - Run `npm install` to ensure all types are installed
   - Check for any missing type definitions

### 11. Deployment

1. Build the project:
```bash
npm run build
```

2. The built files will be in the `dist` directory
3. Deploy to your preferred hosting service

### 12. Version Control

1. Initialize git:
```bash
git init
```

2. Add `.gitignore`:
```
node_modules
.env
dist
```

3. Make initial commit:
```bash
git add .
git commit -m "Initial commit"
```
