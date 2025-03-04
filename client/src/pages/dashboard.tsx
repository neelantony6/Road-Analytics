import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StateFilter from "@/components/state-filter";
import AccidentTrends from "@/components/charts/accident-trends";
import RoadAccidentGraph from "@/components/charts/road-accident-graph";
import AccidentSearch from "@/components/search/accident-search";

// Mock data matching the Python script's structure
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
    }
    // Add more states as needed
  }
};

// Prepare data for the bar chart
const top2019Data = {
  stateUT: Object.keys(mockData.yearly_data),
  accidents2019: Object.values(mockData.yearly_data).map(data => data["2019"])
};

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    if (!selectedState) return mockData;
    return {
      yearly_data: {
        [selectedState]: mockData.yearly_data[selectedState]
      }
    };
  }, [selectedState]);

  // Calculate totals for the statistics cards
  const totalAccidents2019 = Object.values(mockData.yearly_data)
    .reduce((sum, state) => sum + state["2019"], 0);

  const averageAccidents = Math.round(totalAccidents2019 / Object.keys(mockData.yearly_data).length);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Traffic Safety Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Overview of road accident statistics and trends across Indian states
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Accidents (2019)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAccidents2019.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average by State</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{averageAccidents.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>States Reporting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Object.keys(mockData.yearly_data).length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <StateFilter 
          states={Object.keys(mockData.yearly_data)} 
          selectedState={selectedState} 
          onStateChange={setSelectedState} 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="p-4">
          <AccidentTrends data={filteredData} />
        </Card>
        <Card className="p-4">
          <RoadAccidentGraph data={top2019Data} />
        </Card>
      </div>

      <AccidentSearch data={mockData.yearly_data} states={Object.keys(mockData.yearly_data)} />
    </div>
  );
}