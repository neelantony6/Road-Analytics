import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import RoadAccidentGraph from "@/components/charts/road-accident-graph";

// I collected this data from government reports to analyze road safety trends
const mockData = {
  yearly_data: {
    "Tamil Nadu": {
      "2016": 71431,
      "2017": 65562,
      "2018": 63920,
      "2019": 57228
    },
    "Madhya Pradesh": {
      "2016": 53972,
      "2017": 53399,
      "2018": 51397,
      "2019": 50669
    },
    "Karnataka": {
      "2016": 44403,
      "2017": 42542,
      "2018": 41707,
      "2019": 40658
    },
    "Maharashtra": {
      "2016": 39878,
      "2017": 35853,
      "2018": 35717,
      "2019": 32925
    },
    "Kerala": {
      "2016": 39420,
      "2017": 38470,
      "2018": 40181,
      "2019": 41111
    }
  }
};

// My custom analysis function to understand accident trends
function calculateTrends(data) {
  const states = Object.keys(data.yearly_data);
  const years = ["2016", "2017", "2018", "2019"];

  // Calculate overall trend
  const totalsByYear = years.map(year =>
    states.reduce((sum, state) => sum + data.yearly_data[state][year], 0)
  );

  const overallChange = ((totalsByYear[3] - totalsByYear[0]) / totalsByYear[0] * 100).toFixed(1);

  // Find which states improved the most and which need more attention
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
  const [selectedYear, setSelectedYear] = useState("2019");
  const trends = calculateTrends(mockData);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Road Safety Analytics Dashboard [AR3]
        </h1>
        <p className="text-lg text-muted-foreground">
          I've analyzed road accident data from 2016-2019 to understand safety trends across Indian states. 
          Here's what I found...
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

      {/* Trend Chart */}
      <div className="grid gap-6">
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