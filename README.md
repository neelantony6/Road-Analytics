# Traffic Safety Analytics Platform

A web-based traffic safety analytics platform designed to visualize and analyze road accident data. I've designed this system to transform complex traffic incident information into intuitive, interactive visual insights.

## My Project Overview

I've built this application to help improve road safety by:
1. Collecting detailed accident reports with multiple data types (string, integer, boolean)
2. Providing comprehensive analytics of historical data
3. Enabling community safety suggestions

### Key Features I've Implemented

#### Data Collection [AR2]
- Multi-type form validation (string, integer, boolean fields)
- Real-time data submission to Firebase
- Instant feedback and validation
- Comprehensive reporting dashboard

#### Analytics Dashboard [AR3]
- Analysis of road accident trends (2016-2019)
- State-wise comparison and insights
- Interactive visualizations
- Data-driven recommendations

### Technologies I Used
- React with TypeScript for type-safe development
- Firebase Realtime Database for data storage
- Chakra UI for responsive design
- TanStack Query for efficient data management
- Advanced form validation with Zod

## My Development Process

### Setting Up the Project
1. Configured TypeScript for type safety
2. Integrated Firebase for real-time data storage
3. Implemented form validation with custom rules
4. Created responsive UI components

### Data Collection System
I designed the form to collect three different types of data:
- **String Data**: Location, description
- **Integer Data**: Number of vehicles, injury count
- **Boolean Data**: Medical assistance required, hit-and-run status

### Analytics Implementation
I analyzed government data to create:
- Trend analysis across states
- Year-over-year comparisons
- Interactive visualizations

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd traffic-safety-analytics
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Future Improvements
- Add more interactive visualizations
- Implement real-time updates
- Add user authentication
- Expand analytics capabilities

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details