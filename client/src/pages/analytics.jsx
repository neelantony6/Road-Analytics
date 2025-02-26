import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { firebaseService } from "@/lib/firebase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AnalyticsView() {
  // Fetch accident data from Firebase
  const { data: accidentData, isLoading, error } = useQuery({
    queryKey: ["/api/accident-data"],
    queryFn: firebaseService.getAccidentData,
    retry: 2
  });

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load analytics data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground animate-pulse">
            Loading analytics data...
          </p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!accidentData?.accident_data) {
    return (
      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            No analytics data is currently available.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform data for the time series chart
  const timeSeriesData = Object.entries(accidentData.accident_data).map(([state, data]) => {
    return Object.entries(data.yearly_data).map(([year, stats]) => ({
      year,
      total: stats.total,
      fatal: stats.fatal,
      state
    }));
  }).flat();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Advanced Analytics
        </h1>
        <p className="text-lg text-muted-foreground">
          Detailed analysis of accident trends and patterns
        </p>
      </div>

      {/* Chart */}
      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Accident Trends Over Time</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total Accidents" stroke="#8884d8" />
              <Line type="monotone" dataKey="fatal" name="Fatal Accidents" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Key Findings and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Year-over-year increase in accident rates across most states</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Fatality rates showing slight decline in proportion to total accidents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Regional variations in accident patterns identified</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Implement targeted safety measures in high-risk areas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Enhance emergency response capabilities in accident-prone zones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Develop predictive models for accident prevention</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsView;
