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
      .range(theme === "dark" 
        ? ["#1f2937", "#60a5fa"]
        : ["#dbeafe", "#1d4ed8"]);
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
    <div className="w-full h-[500px] relative bg-background border rounded-lg p-4">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-lg" />
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
          background: theme === "dark" ? "#020817" : "#ffffff"
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
                    fill={accidents ? colorScale(accidents) : theme === "dark" ? "#374151" : "#e5e7eb"}
                    stroke={theme === "dark" ? "#1f2937" : "#ffffff"}
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                        transition: "all 250ms"
                      },
                      hover: {
                        fill: theme === "dark" ? "#60a5fa" : "#3b82f6",
                        outline: "none",
                        cursor: "pointer",
                        transition: "all 250ms"
                      },
                      pressed: {
                        outline: "none"
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
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium mb-2">Accidents in {selectedYear}</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme === "dark" ? "#1f2937" : "#dbeafe" }} />
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme === "dark" ? "#60a5fa" : "#1d4ed8" }} />
            <span className="text-xs">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;