import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StateFilter from "@/components/state-filter";
import AccidentTrends from "@/components/charts/accident-trends";
import StateComparison from "@/components/charts/state-comparison";
import AccidentSearch from "@/components/search/accident-search";

const mockAccidentTrendsData = {
  labels: ['2019', '2020', '2021', '2022'],
  total: [1200, 1100, 900, 950],
  fatal: [120, 100, 85, 90]
};

// Mock data for the dashboard
const mockData = {
  California: { total_accidents: 4200, fatal_accidents: 320 },
  Texas: { total_accidents: 3800, fatal_accidents: 290 },
  Florida: { total_accidents: 3100, fatal_accidents: 240 },
  // Add more states as needed
};

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filteredData = selectedState
    ? { [selectedState]: mockData[selectedState] }
    : mockData;

  const totalAccidents = Object.values(mockData).reduce(
    (sum, state) => sum + state.total_accidents,
    0
  );

  const totalFatalities = Object.values(mockData).reduce(
    (sum, state) => sum + state.fatal_accidents,
    0
  );

  const preparedAccidentTrendsData = useMemo(() => ({
    yearly_data: mockAccidentTrendsData.labels.reduce((acc, year, i) => ({
      ...acc,
      [year]: {
        total: mockAccidentTrendsData.total[i],
        fatal: mockAccidentTrendsData.fatal[i]
      }
    }), {})
  }), []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Traffic Safety Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Overview of traffic accident statistics and trends
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Accidents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAccidents.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fatal Accidents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalFatalities.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>States Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Object.keys(mockData).length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <StateFilter 
          states={Object.keys(mockData)} 
          selectedState={selectedState} 
          onStateChange={setSelectedState} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <AccidentTrends data={preparedAccidentTrendsData} />
        <StateComparison data={filteredData} />
      </div>

      <AccidentSearch data={mockData} states={Object.keys(mockData)} />
    </div>
  );
}