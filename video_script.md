# Road Safety Analytics Platform - Video Script

## Introduction (30 seconds)
"Hi, I'm excited to showcase my Road Safety Analytics Platform. Let me walk you through the key components and code implementations."

## Part 1: Project Architecture (45 seconds)
"The project consists of three main components:
1. Frontend with React and JavaScript for data collection and visualization
2. Firebase Realtime Database for data storage
3. Analytics implementation for data processing"

## Part 2: Form Implementation [AR2] (2 minutes)

### Form Validation Code
```javascript
// Form validation schemas using Zod
const accidentReportSchema = z.object({
  // Location validation: Must be between 3-100 characters
  location: z.string()
    .min(3, "Please enter a more specific location")
    .max(100, "Location must not exceed 100 characters"),

  // Description validation: Requires detailed information
  description: z.string()
    .min(20, "Please provide more details")
    .max(500, "Description must not exceed 500 characters"),

  // Vehicle count validation: Must be between 1-10
  vehiclesInvolved: z.number()
    .int()
    .min(1, "At least one vehicle must be involved")
    .max(10, "For major incidents, contact emergency services")
});
```

### Firebase Integration
```javascript
// Firebase configuration setup
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Firebase service implementation
const firebaseService = {
  async submitAccidentReport(data) {
    const reportsRef = ref(db, 'accidentReports');
    return push(reportsRef, {
      ...data,
      timestamp: new Date().toISOString()
    });
  },

  async getAccidentReports() {
    const reportsRef = ref(db, 'accidentReports');
    const snapshot = await get(reportsRef);
    return snapshot.exists() ? Object.values(snapshot.val()) : [];
  }
};
```

### Form State Management
```javascript
// Form hooks setup with validation
const accidentForm = useForm({
  resolver: zodResolver(accidentReportSchema),
  defaultValues: {
    vehiclesInvolved: 1,
    injuryCount: 0,
    medicalAssistance: false,
    hitAndRun: false,
  },
});

// Real-time data fetching with TanStack Query
const { data: submittedReports = [] } = useQuery({
  queryKey: ['accidentReports'],
  queryFn: firebaseService.getAccidentReports,
  refetchInterval: 5000 // Auto-refresh every 5 seconds
});
```

## Part 3: UI Components (1.5 minutes)

### Theme Configuration
```javascript
// Tailwind theme configuration
const theme = {
  extend: {
    colors: {
      primary: "hsl(var(--primary))",
      secondary: "hsl(var(--secondary))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))"
    }
  }
};

// Component styling with Tailwind
<div className="container mx-auto p-4 max-w-4xl">
  <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r 
    from-primary to-primary/80 bg-clip-text text-transparent">
    Data Collection [AR2]
  </h1>
</div>
```

### Form Components
```javascript
// Radio group implementation for Yes/No options
<RadioGroup
  onValueChange={(value) => field.onChange(value === "yes")}
  defaultValue={field.value ? "yes" : "no"}
  className="flex flex-col space-y-1"
>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="yes" id="option-yes" />
    <label htmlFor="option-yes">Yes</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="no" id="option-no" />
    <label htmlFor="option-no">No</label>
  </div>
</RadioGroup>
```

## Part 4: Data Visualization (2 minutes)

### Chart Implementation
```javascript
// Sorting and data processing for visualization
const sortedReports = [...submittedReports].sort((a, b) => 
  new Date(b.timestamp) - new Date(a.timestamp)
);

// Data display with ScrollArea component
<ScrollArea className="h-[400px] w-full rounded-md border p-4">
  <div className="space-y-4">
    {sortedReports.map((report, index) => (
      <div key={index} className="border-b pb-4 last:border-0">
        <div className="flex justify-between items-start">
          <p className="font-medium">{report.location}</p>
          <p className="text-sm text-muted-foreground">
            {formatTimestamp(report.timestamp)}
          </p>
        </div>
      </div>
    ))}
  </div>
</ScrollArea>
```

## Part 5: Key Technical Features (1 minute)
"Let me highlight some key technical implementations:
1. Real-time data synchronization with Firebase
2. Form validation using Zod schemas
3. Responsive UI with Tailwind CSS
4. Interactive data visualization with ScrollArea"

## Conclusion (30 seconds)
"This project demonstrates:
- Modern JavaScript development practices
- Real-time data handling
- User-friendly form validation
- Responsive design principles

Thank you for watching!"

## Key Implementation Notes:
1. Form validation ensures data quality
2. Real-time updates keep data fresh
3. Responsive design works on all devices
4. Firebase integration provides scalability