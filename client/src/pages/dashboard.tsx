import { Card } from "@/components/ui/card";
import StatsCard from "@/components/ui/stats-card";
import AccidentTrends from "@/components/charts/accident-trends";
import StateComparison from "@/components/charts/state-comparison";
import StateFilter from "@/components/filters/state-filter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Road Safety Analytics Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive analysis of road traffic accidents across Indian states
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Accident Trends Analysis</h2>
          <div className="bg-muted/50 p-4 rounded-lg">
            <StateFilter 
              states={Object.keys(sampleData)}
              selectedState={selectedState}
              onStateChange={setSelectedState}
            />
          </div>
        </div>
        <AccidentTrends data={filteredData} />
      </Card>

      <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-semibold mb-6">State-wise Comparison</h2>
        <StateComparison data={filteredData} />
      </Card>

      <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow">
        <h2 className="text-2xl font-semibold mb-4">Key Insights & Recommendations</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">Key Findings</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
                <span>States with high population density show significantly higher accident rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
                <span>Urban areas report more accidents but maintain lower fatality rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
                <span>Night-time accidents have a 30% higher fatality rate</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-primary">Recommendations</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
                <span>Implement enhanced street lighting in high-risk areas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
                <span>Increase traffic patrol presence during peak accident hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
                <span>Deploy automated speed monitoring systems in urban areas</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}