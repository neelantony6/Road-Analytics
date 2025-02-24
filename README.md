# Traffic Safety Analytics Platform

A web-based traffic safety analytics platform designed to visualize and analyze road accident data. The system leverages modern web technologies to transform complex traffic incident information into intuitive, interactive visual insights.

## Technologies Used
- React (Frontend)
- Express.js (Backend)
- Firebase (Real-time database)
- Plotly (Data visualization)
- TypeScript
- Tailwind CSS
- shadcn/ui

## Project Structure
```
├── client/               # Frontend React application
│   ├── public/          # Static files
│   └── src/             # Source files
├── server/              # Backend Express application
│   ├── src/            # Source files
│   └── dist/           # Compiled files
├── shared/              # Shared types and utilities
└── docs/               # Documentation
```

## Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher
- Visual Studio 2022 or later with Node.js development workload installed

## Getting Started

### Setting Up the Development Environment

1. Clone the repository:
```bash
git clone <repository-url>
cd traffic-safety-analytics
```

2. Configure Environment Variables:

Create `.env` files in both client and server directories:

For client/.env:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

For server/.env:
```
PORT=5000
DATABASE_URL=your_postgresql_database_url
```

3. Open in Visual Studio:
- Double-click `TrafficSafetyAnalytics.sln` to open in Visual Studio
- Right-click on the solution in Solution Explorer and select "Restore Node.js Packages"
- Build the solution

4. Running the Application:
- In Visual Studio:
  - Set startup projects (Right-click solution → Set Startup Projects)
  - Select "Multiple startup projects"
  - Set both Client and Server projects to "Start"
  - Press F5 to start debugging
- Alternatively, use the command line:
  ```bash
  # In server directory
  npm run dev

  # In client directory (separate terminal)
  npm run dev
  ```

## Development Scripts

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Backend (server/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Realtime Database
3. Copy your Firebase configuration from Project Settings
4. Update the environment variables in client/.env

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details