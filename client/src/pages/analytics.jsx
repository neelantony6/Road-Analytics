import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { firebaseService } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

function AnalyticsView() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await firebaseService.getAnalyticsData();
        setAnalyticsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-8 w-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!analyticsData) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No data available for analysis.</AlertDescription>
      </Alert>
    );
  }

  const { accidentReports, trafficReports, safetySuggestions } = analyticsData;

  // Calculate total accidents by type
  const accidentsByType = accidentReports.reduce((acc, report) => {
    acc[report.accidentType] = (acc[report.accidentType] || 0) + 1;
    return acc;
  }, {});

  // Calculate average severity from traffic reports
  const averageSeverity = trafficReports.length > 0
    ? (trafficReports.reduce((sum, report) => sum + report.severity, 0) / trafficReports.length).toFixed(1)
    : 0;

  // Get suggestions by category
  const suggestionsByCategory = safetySuggestions.reduce((acc, suggestion) => {
    acc[suggestion.category] = (acc[suggestion.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Safety Analysis Dashboard [AR3]
        </h1>
        <p className="text-lg text-muted-foreground">
          Analysis of submitted accident reports and safety suggestions
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Total Reports</h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold">{accidentReports.length}</p>
            <p className="text-sm text-muted-foreground">Accident Reports Submitted</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Average Severity</h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold">{averageSeverity}</p>
            <p className="text-sm text-muted-foreground">From {trafficReports.length} Traffic Reports</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Safety Suggestions</h3>
          <div className="space-y-2">
            <p className="text-3xl font-bold">{safetySuggestions.length}</p>
            <p className="text-sm text-muted-foreground">Community Suggestions</p>
          </div>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Accidents by Type</h3>
          <div className="space-y-4">
            {Object.entries(accidentsByType).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="capitalize">{type.replace('_', ' ')}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Suggestions by Category</h3>
          <div className="space-y-4">
            {Object.entries(suggestionsByCategory).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center">
                <span className="capitalize">{category.replace('_', ' ')}</span>
                <span className="font-bold">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {accidentReports.slice(-5).reverse().map((report, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
                <p><strong>Location:</strong> {report.location}</p>
                <p><strong>Type:</strong> {report.accidentType.replace('_', ' ')}</p>
                <p><strong>Vehicles:</strong> {report.vehiclesInvolved}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AnalyticsView;