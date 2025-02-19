import { Card } from "@/components/ui/card";
import StatsCard from "@/components/ui/stats-card";
import AccidentTrends from "@/components/charts/accident-trends";
import StateComparison from "@/components/charts/state-comparison";
import StateFilter from "@/components/filters/state-filter";
import { useState } from "react";

// Sample static data
const sampleData = {
  "Maharashtra": { "total_accidents": 15234, "fatal_accidents": 3400 },
  "Delhi": { "total_accidents": 12000, "fatal_accidents": 2800 },
  "Tamil Nadu": { "total_accidents": 18050, "fatal_accidents": 4000 }
};

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filteredData = selectedState
    ? { [selectedState]: sampleData[selectedState] }
    : sampleData;

  const totalAccidents = Object.values(sampleData).reduce(
    (sum: number, state: any) => sum + state.total_accidents,
    0
  );

  const totalFatalities = Object.values(sampleData).reduce(
    (sum: number, state: any) => sum + state.fatal_accidents,
    0
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Traffic Accident Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard 
          title="Total Accidents" 
          value={totalAccidents.toLocaleString()} 
          description="Across all states"
        />
        <StatsCard 
          title="Fatal Accidents" 
          value={totalFatalities.toLocaleString()}
          description="Total fatalities recorded"
        />
      </div>

      <Card className="p-4">
        <div className="mb-4">
          <StateFilter 
            states={Object.keys(sampleData)}
            selectedState={selectedState}
            onStateChange={setSelectedState}
          />
        </div>
        <AccidentTrends data={filteredData} />
      </Card>

      <Card className="p-4">
        <StateComparison data={filteredData} />
      </Card>
    </div>
  );
}