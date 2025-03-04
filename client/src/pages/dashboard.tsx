import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StateFilter from "@/components/state-filter";
import AccidentTrends from "@/components/charts/accident-trends";
import RoadAccidentGraph from "@/components/charts/road-accident-graph";
import AccidentSearch from "@/components/search/accident-search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Complete data from the CSV file
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
    },
    "Uttar Pradesh": {
      "2016": 35612,
      "2017": 38783,
      "2018": 42568,
      "2019": 37537
    },
    "Rajasthan": {
      "2016": 23066,
      "2017": 23785,
      "2018": 21911,
      "2019": 23480
    },
    "Andhra Pradesh": {
      "2016": 24888,
      "2017": 24475,
      "2018": 24475,
      "2019": 21964
    },
    "Gujarat": {
      "2016": 21859,
      "2017": 19081,
      "2018": 18701,
      "2019": 17046
    },
    "Telangana": {
      "2016": 22811,
      "2017": 22484,
      "2018": 22224,
      "2019": 21570
    },
    "Chhattisgarh": {
      "2016": 13580,
      "2017": 13580,
      "2018": 13899,
      "2019": 13899
    },
    "West Bengal": {
      "2016": 13580,
      "2017": 13580,
      "2018": 13899,
      "2019": 13899
    },
    "Haryana": {
      "2016": 11234,
      "2017": 11258,
      "2018": 11238,
      "2019": 10944
    },
    "Bihar": {
      "2016": 8855,
      "2017": 8855,
      "2018": 8855,
      "2019": 8855
    },
    "Odisha": {
      "2016": 10532,
      "2017": 10855,
      "2018": 11262,
      "2019": 11064
    }
  }
};

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState("2019");
  const years = ["2016", "2017", "2018", "2019"];

  const filteredData = useMemo(() => {
    if (!selectedState) return mockData;
    return {
      yearly_data: {
        [selectedState]: mockData.yearly_data[selectedState]
      }
    };
  }, [selectedState]);

  // Calculate statistics for the selected year
  const statistics = useMemo(() => {
    const totalAccidents = Object.values(mockData.yearly_data)
      .reduce((sum, state) => sum + state[selectedYear], 0);

    const averageAccidents = Math.round(totalAccidents / Object.keys(mockData.yearly_data).length);

    const yearOverYearChange = (() => {
      if (selectedYear === "2016") return null;
      const prevYear = (parseInt(selectedYear) - 1).toString();
      const currentTotal = Object.values(mockData.yearly_data)
        .reduce((sum, state) => sum + state[selectedYear], 0);
      const prevTotal = Object.values(mockData.yearly_data)
        .reduce((sum, state) => sum + state[prevYear], 0);
      return ((currentTotal - prevTotal) / prevTotal * 100).toFixed(1);
    })();

    return { totalAccidents, averageAccidents, yearOverYearChange };
  }, [selectedYear]);

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

      <div className="mb-6">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year}>
                Year {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Accidents ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.totalAccidents.toLocaleString()}</p>
            {statistics.yearOverYearChange !== null && (
              <p className={`text-sm mt-2 ${
                Number(statistics.yearOverYearChange) > 0 
                  ? 'text-red-500' 
                  : 'text-green-500'
              }`}>
                {Number(statistics.yearOverYearChange) > 0 ? '↑' : '↓'} {
                  Math.abs(Number(statistics.yearOverYearChange))}% from previous year
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average by State ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.averageAccidents.toLocaleString()}</p>
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
          <RoadAccidentGraph data={mockData} />
        </Card>
      </div>

      <AccidentSearch data={mockData.yearly_data} states={Object.keys(mockData.yearly_data)} />
    </div>
  );
}