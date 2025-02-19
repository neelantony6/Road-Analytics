import { useQuery } from "@tanstack/react-query";
import { ref, get } from "firebase/database";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import StatsCard from "@/components/ui/stats-card";
import AccidentTrends from "@/components/charts/accident-trends";
import StateComparison from "@/components/charts/state-comparison";
import StateFilter from "@/components/filters/state-filter";
import { useState } from "react";

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const { data: accidentData, isLoading, isError, error } = useQuery({
    queryKey: ['accident_data'],
    queryFn: async () => {
      try {
        const snapshot = await get(ref(db, 'accident_data'));
        if (!snapshot.exists()) {
          throw new Error('No data available');
        }
        return snapshot.val();
      } catch (err: any) {
        console.error('Error fetching data:', err);
        throw new Error(err.message || 'Failed to fetch accident data');
      }
    }
  });

  const filteredData = selectedState && accidentData
    ? { [selectedState]: accidentData[selectedState] }
    : accidentData;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load accident data'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalAccidents = Object.values(accidentData || {}).reduce(
    (sum: number, state: any) => sum + state.total_accidents,
    0
  );

  const totalFatalities = Object.values(accidentData || {}).reduce(
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
            states={Object.keys(accidentData || {})}
            selectedState={selectedState}
            onStateChange={setSelectedState}
          />
        </div>
        <AccidentTrends data={filteredData || {}} />
      </Card>

      <Card className="p-4">
        <StateComparison data={filteredData || {}} />
      </Card>
    </div>
  );
}