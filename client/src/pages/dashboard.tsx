import { Card } from "@/components/ui/card";
import StatsCard from "@/components/ui/stats-card";
import AccidentTrends from "@/components/charts/accident-trends";
import StateComparison from "@/components/charts/state-comparison";
import StateFilter from "@/components/filters/state-filter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

// Sample data - will be replaced with real data from the API
const sampleData = {
  "Maharashtra": { "total_accidents": 15234, "fatal_accidents": 3400 },
  "Delhi": { "total_accidents": 12000, "fatal_accidents": 2800 },
  "Tamil Nadu": { "total_accidents": 18050, "fatal_accidents": 4000 }
};

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const { data: reports } = useQuery({
    queryKey: ["/api/reports"],
  });

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

  const fatalityRate = ((totalFatalities / totalAccidents) * 100).toFixed(1);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Road Traffic Analysis Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of road traffic accidents across Indian states.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
          title="Total Accidents" 
          value={totalAccidents.toLocaleString()} 
          description="Total reported accidents across all states"
        />
        <StatsCard 
          title="Fatal Accidents" 
          value={totalFatalities.toLocaleString()}
          description="Total fatalities recorded"
        />
        <StatsCard 
          title="Fatality Rate" 
          value={`${fatalityRate}%`}
          description="Percentage of accidents resulting in fatalities"
        />
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Accident Trends Analysis</h2>
          <StateFilter 
            states={Object.keys(sampleData)}
            selectedState={selectedState}
            onStateChange={setSelectedState}
          />
        </div>
        <AccidentTrends data={filteredData} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">State-wise Comparison</h2>
        <StateComparison data={filteredData} />
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <div className="prose max-w-none">
          <ul className="list-disc pl-4 space-y-2">
            <li>States with high population density show higher accident rates</li>
            <li>Urban areas report more accidents but lower fatality rates</li>
            <li>Night-time accidents have a higher fatality rate</li>
            <li>Weather conditions significantly impact accident frequency</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}