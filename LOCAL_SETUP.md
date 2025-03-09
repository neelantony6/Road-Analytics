# Local Development Setup Guide

## 1. Project Structure
First, create the following folder structure on your local machine:

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

## 2. Essential Files
Copy these files from your Replit project:

1. Configuration Files:
   - `package.json`
   - `tsconfig.json`
   - `client/tsconfig.json`
   - `client/tsconfig.node.json`
   - `.env` (create this with your Firebase credentials)

2. Source Code:
   - All files from `client/src`
   - All components from `client/src/components`
   - All pages from `client/src/pages`

## 3. Environment Setup

Create a `.env` file in your project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=https://alt-coursework-default-rtdb.europe-west1.firebasedatabase.app
VITE_FIREBASE_APP_ID=your_app_id
```

## 4. VS Code Setup

1. Install these VS Code extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense

2. Create `.vscode/settings.json`:
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

## 5. Install Dependencies

Open terminal in your project root and run:
```bash
npm install
```

This will install all dependencies listed in your package.json.

## 6. Local Development

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at `http://localhost:5173`

## 7. Firebase Configuration

1. Make sure your Firebase project is set up with:
   - Realtime Database enabled
   - Authentication configured (if you're using it)
   - Your application domain added to authorized domains

2. Verify your Firebase configuration in `client/src/lib/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: "https://alt-coursework-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## 8. Running the Application

The application consists of three main sections:
- Dashboard [AR1]
- Data Collection [AR2]
- Analysis [AR3]

Make sure all components are working correctly after setting up locally.

## Troubleshooting

1. If you see module resolution errors:
   - Check your path aliases in tsconfig.json
   - Verify all dependencies are installed

2. If Firebase connections fail:
   - Verify your environment variables
   - Check Firebase Console for correct configuration

3. For TypeScript errors:
   - Run `npm install` to ensure all types are installed
   - Check for any missing type definitions

## Version Control

1. Initialize git:
```bash
git init
```

2. Create `.gitignore`:
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
