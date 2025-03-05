import React, { useState, useMemo } from "react";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RoadAccidentGraphProps {
  data: {
    [state: string]: {
      [year: string]: number;
    };
  };
}

const RoadAccidentGraph: React.FC<RoadAccidentGraphProps> = ({ data }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedYear, setSelectedYear] = useState("2019");
  const years = ["2016", "2017", "2018", "2019"];

  const chartData = useMemo(() => {
    // Sort states by accident count for the selected year
    const sortedData = Object.entries(data)
      .map(([state, yearData]) => ({
        state,
        accidents: yearData[selectedYear] || 0
      }))
      .sort((a, b) => b.accidents - a.accidents);

    return {
      stateUT: sortedData.map(item => item.state),
      accidents: sortedData.map(item => item.accidents)
    };
  }, [data, selectedYear]);

  return (
    <div className="w-full relative space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Top States/UTs with Most Road Accidents</h2>
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

      <Plot
        data={[
          {
            x: chartData.stateUT,
            y: chartData.accidents,
            type: "bar",
            text: chartData.accidents.map(String),
            textposition: 'outside',
            marker: { color: "rgb(99, 102, 241)" },
            hovertemplate: '<b>%{x}</b><br>' +
              `Road Accidents (${selectedYear}): %{y}<br>` +
              '<extra></extra>'
          }
        ]}
        layout={{
          autosize: true,
          height: isMobile ? 300 : 400,
          margin: isMobile 
            ? { l: 40, r: 20, t: 30, b: 100 }
            : { l: 50, r: 50, t: 30, b: 120 },
          xaxis: { 
            title: 'States/UTs',
            tickangle: 45,
            fixedrange: isMobile
          },
          yaxis: { 
            title: `Road Accidents (${selectedYear})`,
            fixedrange: isMobile
          },
          showlegend: false,
          dragmode: isMobile ? false : 'zoom',
          hovermode: 'closest',
          template: "plotly"
        }}
        config={{
          responsive: true,
          displayModeBar: !isMobile,
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          displaylogo: false
        }}
        style={{ width: '100%' }}
        className="transition-all duration-300"
      />
    </div>
  );
};

export default RoadAccidentGraph;