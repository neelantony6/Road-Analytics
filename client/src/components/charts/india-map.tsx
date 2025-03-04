import React, { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { useTheme } from "@/hooks/use-theme";

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

  const colorScale = useMemo(() => {
    // Get all accident values for the selected year
    const accidentValues = Object.values(data.yearly_data)
      .map(stateData => stateData[selectedYear]);

    // Create a color scale from min to max values
    return scaleLinear<string>()
      .domain([Math.min(...accidentValues), Math.max(...accidentValues)])
      .range(theme === "dark" 
        ? ["#1f2937", "#60a5fa"] // Dark mode colors
        : ["#dbeafe", "#1d4ed8"]); // Light mode colors
  }, [data, selectedYear, theme]);

  const getStateAccidents = (stateName: string) => {
    // Try to match state names with different formats
    const stateData = data.yearly_data[stateName] || 
                     data.yearly_data[stateName.toUpperCase()] ||
                     data.yearly_data[stateName.toLowerCase()];
    return stateData ? stateData[selectedYear] : 0;
  };

  return (
    <div className="w-full h-[400px] relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1000,
          center: [78.9629, 22.5937] // Centered on India
        }}
        className="w-full h-full"
      >
        <ZoomableGroup>
          <Geographies geography={INDIA_TOPO_JSON}>
            {({ geographies }) =>
              geographies.map(geo => {
                const stateName = geo.properties.NAME_1;
                const accidents = getStateAccidents(stateName);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={accidents ? colorScale(accidents) : theme === "dark" ? "#374151" : "#e5e7eb"}
                    stroke={theme === "dark" ? "#1f2937" : "#fff"}
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none"
                      },
                      hover: {
                        fill: theme === "dark" ? "#60a5fa" : "#3b82f6",
                        outline: "none",
                        cursor: "pointer"
                      }
                    }}
                    className="transition-colors duration-200"
                    title={`${stateName}: ${accidents.toLocaleString()} accidents`}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <div className="absolute bottom-2 left-2 bg-card p-2 rounded shadow-sm">
        <p className="text-sm font-medium">Accidents in {selectedYear}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3" style={{ backgroundColor: theme === "dark" ? "#1f2937" : "#dbeafe" }} />
          <span className="text-xs">Low</span>
          <div className="w-3 h-3" style={{ backgroundColor: theme === "dark" ? "#60a5fa" : "#1d4ed8" }} />
          <span className="text-xs">High</span>
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;