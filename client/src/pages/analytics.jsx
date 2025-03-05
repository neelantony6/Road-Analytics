import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoadingSpinner from "@/components/ui/loading-spinner";
import AccidentTrends from "@/components/charts/accident-trends";
import RoadAccidentGraph from "@/components/charts/road-accident-graph";
import { firebaseService } from "@/lib/firebase";

function AnalyticsView() {
  const { data: accidentData, isLoading, error } = useQuery({
    queryKey: ['accidentData'],
    queryFn: firebaseService.getAccidentData
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load analytics data. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const calculateTrends = (data) => {
    if (!data || Object.keys(data).length === 0) return null;

    const states = Object.keys(data);
    const years = ["2016", "2017", "2018", "2019"];

    // Calculate overall trend
    const totalsByYear = years.map(year => 
      states.reduce((sum, state) => {
        const yearlyData = data[state]?.yearly_data || {};
        return sum + (yearlyData[year]?.total || 0);
      }, 0)
    );

    const overallChange = ((totalsByYear[3] - totalsByYear[0]) / totalsByYear[0] * 100).toFixed(1);

    // Find states with most significant changes
    const stateChanges = states.map(state => {
      const yearlyData = data[state]?.yearly_data || {};
      const change = ((yearlyData["2019"]?.total - yearlyData["2016"]?.total) 
        / yearlyData["2016"]?.total * 100).toFixed(1);
      return { state, change: Number(change) };
    });

    const mostImproved = stateChanges.sort((a, b) => a.change - b.change)[0];
    const mostDeclined = stateChanges.sort((a, b) => b.change - a.change)[0];

    return {
      overallChange: Number(overallChange),
      mostImproved,
      mostDeclined,
      totalAccidents2019: totalsByYear[3],
      totalAccidents2016: totalsByYear[0]
    };
  };

  const trends = calculateTrends(accidentData);

  if (!trends) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No analytics data available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Road Safety Analytics
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive analysis of road accident trends across Indian states (2016-2019)
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Overall Trend</h3>
          <div className="flex items-center gap-2">
            {trends.overallChange > 0 ? (
              <TrendingUp className="text-red-500" />
            ) : (
              <TrendingDown className="text-green-500" />
            )}
            <span className={trends.overallChange > 0 ? "text-red-500" : "text-green-500"}>
              {Math.abs(trends.overallChange)}% {trends.overallChange > 0 ? "increase" : "decrease"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            From {trends.totalAccidents2016.toLocaleString()} accidents in 2016 to{" "}
            {trends.totalAccidents2019.toLocaleString()} in 2019
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Most Improved State</h3>
          <div className="space-y-2">
            <p className="font-medium">{trends.mostImproved.state}</p>
            <p className="text-green-500 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              {Math.abs(trends.mostImproved.change)}% decrease
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Most Concerning State</h3>
          <div className="space-y-2">
            <p className="font-medium">{trends.mostDeclined.state}</p>
            <p className="text-red-500 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              {trends.mostDeclined.change}% increase
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6">
        <Card className="p-6">
          <RoadAccidentGraph data={accidentData} />
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
            <span>
              Data shows significant variations in accident rates across different states,
              highlighting the need for targeted safety measures.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
            <span>
              {trends.mostImproved.state} demonstrates the most improvement,
              suggesting effective safety initiatives that could be replicated.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
            <span>
              {trends.mostDeclined.state} shows concerning trends,
              indicating a need for immediate intervention and safety measures.
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default AnalyticsView;