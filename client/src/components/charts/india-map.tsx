import React, { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { useTheme } from "@/hooks/use-theme";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// GeoJSON for India map with state boundaries
const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

interface IndiaMapProps {
  data: {
    yearly_data: {
      [state: string]: {
        [year: string]: number;
      };
    };
  };
  selectedYear: string;
}

const IndiaMap: React.FC<IndiaMapProps> = ({ data, selectedYear }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const colorScale = useMemo(() => {
    const accidentValues = Object.values(data.yearly_data)
      .map(stateData => stateData[selectedYear]);

    return scaleLinear<string>()
      .domain([Math.min(...accidentValues), Math.max(...accidentValues)])
      .range([
        theme === "dark" ? "#374151" : "#dbeafe",  // Lighter colors to reduce glow
        theme === "dark" ? "#3b82f6" : "#1e40af"   // Darker colors to reduce glow
      ]);
  }, [data, selectedYear, theme]);

  const getStateAccidents = (stateName: string) => {
    const stateData = data.yearly_data[stateName] || 
                     data.yearly_data[stateName.toUpperCase()] ||
                     data.yearly_data[stateName.toLowerCase()];
    return stateData ? stateData[selectedYear] : 0;
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden bg-card border shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Geographic Distribution of Road Accidents</h3>
        <p className="text-sm text-muted-foreground">State-wise road accident data visualization for {selectedYear}</p>
      </div>

      <div className="relative w-full h-[500px] bg-background">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1000,
            center: [78.9629, 22.5937]
          }}
          style={{
            width: "100%",
            height: "100%",
            background: "transparent"
          }}
          onError={(error) => {
            console.error('Map loading error:', error);
            setError('Failed to load the map. Please try again later.');
          }}
          onLoad={() => setIsLoading(false)}
        >
          <ZoomableGroup>
            <Geographies 
              geography={INDIA_TOPO_JSON}
              onError={(error) => {
                console.error('GeoJSON loading error:', error);
                setError('Failed to load geographical data. Please try again later.');
              }}
            >
              {({ geographies }) =>
                geographies.map(geo => {
                  const stateName = geo.properties.NAME_1;
                  const accidents = getStateAccidents(stateName);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={accidents ? colorScale(accidents) : theme === "dark" ? "#374151" : "#f3f4f6"}
                      stroke={theme === "dark" ? "#1f2937" : "#e5e7eb"}
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                          transition: "all 250ms"
                        },
                        hover: {
                          fill: theme === "dark" ? "#3b82f6" : "#2563eb",
                          cursor: "pointer",
                          transition: "all 250ms"
                        }
                      }}
                      aria-label={`${stateName}: ${accidents.toLocaleString()} accidents`}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border">
          <p className="text-sm font-medium mb-2">Accidents in {selectedYear}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded border" style={{ 
                backgroundColor: theme === "dark" ? "#374151" : "#dbeafe"
              }} />
              <span className="text-xs">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded border" style={{ 
                backgroundColor: theme === "dark" ? "#3b82f6" : "#1e40af"
              }} />
              <span className="text-xs">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;