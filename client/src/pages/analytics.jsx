import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, TrendingDown, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSpinner from "@/components/ui/loading-spinner";
import AccidentTrends from "@/components/charts/accident-trends";
import RoadAccidentGraph from "@/components/charts/road-accident-graph";

const mockData = {
  yearly_data: {
    "Tamil Nadu": {
      "2016": 71431,
      "2017": 65562,
      "2018": 63920,
      "2019": 57228
    },
    // ... (rest of the states data)
  }
};

function calculateTrends(data) {
  const states = Object.keys(data.yearly_data);
  const years = ["2016", "2017", "2018", "2019"];

  // Calculate overall trend
  const totalsByYear = years.map(year => 
    states.reduce((sum, state) => sum + data.yearly_data[state][year], 0)
  );

  const overallChange = ((totalsByYear[3] - totalsByYear[0]) / totalsByYear[0] * 100).toFixed(1);

  // Find states with most significant changes
  const stateChanges = states.map(state => {
    const change = ((data.yearly_data[state]["2019"] - data.yearly_data[state]["2016"]) 
      / data.yearly_data[state]["2016"] * 100).toFixed(1);
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
}

function AnalyticsView() {
  const trends = calculateTrends(mockData);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <AccidentTrends data={mockData} />
        </Card>
        <Card className="p-6">
          <RoadAccidentGraph data={mockData} />
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
            <span>
              Tamil Nadu consistently shows the highest number of accidents,
              but demonstrates a steady decline over the years.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
            <span>
              Most states show a downward trend in accident numbers from 2016 to 2019,
              indicating improving road safety measures.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
            <span>
              The top 5 states account for over 50% of total accidents,
              suggesting a need for focused intervention in these regions.
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default AnalyticsView;