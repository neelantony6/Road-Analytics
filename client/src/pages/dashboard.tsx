import { Card } from "@/components/ui/card";
import { useState, useMemo } from "react";
import StateFilter from "@/components/filters/state-filter";
// Assuming AccidentTrends and StateComparison components exist and have appropriate props
import AccidentTrends from "@/components/charts/accident-trends";
import StateComparison from "@/components/charts/state-comparison";
import AccidentSearch from "@/components/search/accident-search"; // Added import

const mockData = {
  "California": {
    total_accidents: 12500,
    fatal_accidents: 450,
    yearly_data: {
      "2019": { total: 4200, fatal: 150 },
      "2020": { total: 3800, fatal: 140 },
      "2021": { total: 4500, fatal: 160 }
    }
  },
  "Texas": {
    total_accidents: 11000,
    fatal_accidents: 400,
    yearly_data: {
      "2019": { total: 3600, fatal: 130 },
      "2020": { total: 3400, fatal: 125 },
      "2021": { total: 4000, fatal: 145 }
    }
  }
};

const mockAccidentTrendsData = {
  labels: ['2019', '2020', '2021', '2022'],
  total: [1200, 1100, 900, 950],
  fatal: [120, 100, 85, 90]
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
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Traffic Safety Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Overview of traffic accident statistics and trends
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total States</h3>
          <p className="text-3xl font-bold">{Object.keys(mockData).length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Accidents</h3>
          <p className="text-3xl font-bold">{totalAccidents}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Fatal Accidents</h3>
          <p className="text-3xl font-bold">{totalFatalities}</p>
        </Card>
      </div>

      <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Accident Trends Analysis</h2>
          <div className="bg-muted/50 p-4 rounded-lg">
            <AccidentSearch data={mockData} states={Object.keys(mockData)} />
            <StateFilter 
              states={Object.keys(mockData)}
              selectedState={selectedState}
              onStateChange={setSelectedState}
            />
          </div>
        </div>
        <AccidentTrends data={preparedAccidentTrendsData} /> {/* Use prepared mock data */}
      </Card>

      <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-semibold mb-6">State-wise Comparison</h2>
        <StateComparison data={filteredData} />
      </Card>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardView() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Traffic Safety Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Road Accident Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <iframe 
              src="/road_accident_trends.html" 
              className="w-full h-full border-0" 
              title="Road Accident Trends"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>State-wise Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <iframe 
              src="/top_states_accidents_2019.html" 
              className="w-full h-full border-0" 
              title="Top States by Accidents"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
