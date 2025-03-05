import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AccidentSearchProps {
  data: any;
  states: string[];
}

export default function AccidentSearch({ data, states }: AccidentSearchProps) {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any>(null);

  const handleSearch = () => {
    if (selectedState && selectedYear && data[selectedState]) {
      const stateData = data[selectedState];
      if (stateData[selectedYear]) {
        setSearchResult({
          state: selectedState,
          year: selectedYear,
          total: stateData[selectedYear]
        });
      } else {
        console.log('No data found for selected year');
        setSearchResult(null);
      }
    } else {
      console.log('Please select both state and year');
      setSearchResult(null);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Search Accidents</h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {["2019", "2018", "2017", "2016"].map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {searchResult && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Search Results</h3>
            <p>State: {searchResult.state}</p>
            <p>Year: {searchResult.year}</p>
            <p>Total Accidents: {searchResult.total.toLocaleString()}</p>
          </div>
        )}
      </div>
    </Card>
  );
}