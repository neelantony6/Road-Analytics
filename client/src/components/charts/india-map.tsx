import React, { useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Card } from "@/components/ui/card";

// I'm using a simpler GeoJSON for India map
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
  // Create color scale based on accident data
  const colorScale = useMemo(() => {
    const accidentValues = Object.values(data.yearly_data)
      .map(stateData => stateData[selectedYear]);

    return scaleLinear<string>()
      .domain([Math.min(...accidentValues), Math.max(...accidentValues)])
      .range(["#e5e7eb", "#1e40af"]);
  }, [data, selectedYear]);

  // Helper to get state data
  const getStateAccidents = (stateName: string) => {
    const stateData = data.yearly_data[stateName] || 
                     data.yearly_data[stateName.toUpperCase()] ||
                     data.yearly_data[stateName.toLowerCase()];
    return stateData ? stateData[selectedYear] : 0;
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Geographic Distribution ({selectedYear})</h3>
      <div style={{ width: "100%", height: "400px" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1000,
            center: [78.9629, 22.5937] // Centered on India
          }}
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
                      fill={accidents ? colorScale(accidents) : "#e5e7eb"}
                      stroke="#ffffff"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none"
                        },
                        hover: {
                          fill: "#3b82f6",
                          outline: "none"
                        }
                      }}
                      title={`${stateName}: ${accidents.toLocaleString()} accidents`}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4" style={{ backgroundColor: "#e5e7eb" }} />
          <span className="text-sm">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4" style={{ backgroundColor: "#1e40af" }} />
          <span className="text-sm">High</span>
        </div>
      </div>
    </Card>
  );
};

export default IndiaMap;