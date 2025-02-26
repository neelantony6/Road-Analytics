import { Card } from "@/components/ui/card";
import StatsCard from "@/components/ui/stats-card";
import AccidentTrends from "@/components/charts/accident-trends";
import StateComparison from "@/components/charts/state-comparison";
import StateFilter from "@/components/filters/state-filter";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { firebaseService } from "@/lib/firebase";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoadingSpinner from "@/components/ui/loading-spinner";

function AccidentSearch({ data, states }: { data: any; states: string[] }) {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any | null>(null);

  const handleSearch = () => {
    if (selectedState && selectedYear && data[selectedState]) {
      const yearData = data[selectedState].years.find((year: any) => year.year === selectedYear);
      setSearchResults(yearData);
    } else {
      setSearchResults(null);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State:
        </label>
        <select
          id="state"
          value={selectedState || ""}
          onChange={(e) => setSelectedState(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
          Year:
        </label>
        <input
          type="number"
          id="year"
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
      </div>
      <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Search
      </button>
      {searchResults ? (
        <div className="mt-4">
          <p>Total Accidents: {searchResults.total_accidents}</p>
          <p>Fatal Accidents: {searchResults.fatal_accidents}</p>
          {/* Add other relevant data here */}
        </div>
      ) : null}
    </div>
  );
}


export default function Dashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const { data: accidentData, isLoading, error } = useQuery({
    queryKey: ["/api/accident-data"],
    queryFn: firebaseService.getAccidentData,
    retry: 2
  });

  const filteredData = useMemo(() => {
    if (!accidentData?.accident_data) return [];

    if (selectedState) {
      return { [selectedState]: accidentData.accident_data[selectedState] };
    }

    return accidentData.accident_data;
  }, [accidentData, selectedState]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load accident data. Please try again later.
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 text-xs opacity-70">
                Error: {error.message}
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground animate-pulse">
            Loading accident data...
          </p>
        </div>
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!accidentData?.accident_data) {
    return (
      <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            No accident data is currently available. Data will be initialized shortly.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalAccidents = Object.values(accidentData.accident_data).reduce(
    (sum: number, state: any) => sum + state.total_accidents,
    0
  );

  const totalFatalities = Object.values(accidentData.accident_data).reduce(
    (sum: number, state: any) => sum + state.fatal_accidents,
    0
  );

  const fatalityRate = ((totalFatalities / totalAccidents) * 100).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
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

      <AccidentSearch 
        data={accidentData.accident_data} 
        states={Object.keys(accidentData.accident_data)} 
      />

      <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Accident Trends Analysis</h2>
          <div className="bg-muted/50 p-4 rounded-lg">
            <StateFilter 
              states={Object.keys(accidentData.accident_data)}
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