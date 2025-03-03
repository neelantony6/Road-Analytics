
import React from "react";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@/hooks/use-media-query";

interface RoadAccidentGraphProps {
  data?: {
    years: string[];
    accidents: number[];
  };
}

const RoadAccidentGraph: React.FC<RoadAccidentGraphProps> = ({ 
  data = {
    years: ["2016", "2017", "2018", "2019", "2020"],
    accidents: [50000, 52000, 53000, 51000, 48000]
  } 
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full relative">
      <h2 className="text-xl font-semibold mb-4">Road Accident Trends</h2>
      <Plot
        data={[
          {
            x: data.years,
            y: data.accidents,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "rgb(136, 132, 216)" },
            name: "Total Accidents",
            hovertemplate: 'Year: %{x}<br>Accidents: %{y}<extra></extra>'
          }
        ]}
        layout={{
          autosize: true,
          height: isMobile ? 300 : 400,
          margin: isMobile 
            ? { l: 40, r: 20, t: 30, b: 40 }
            : { l: 50, r: 50, t: 30, b: 50 },
          xaxis: { 
            title: 'Year',
            fixedrange: isMobile
          },
          yaxis: { 
            title: 'Number of Accidents',
            fixedrange: isMobile
          },
          showlegend: true,
          legend: isMobile ? {
            orientation: 'h',
            y: -0.3,
            x: 0.5,
            xanchor: 'center'
          } : undefined,
          dragmode: isMobile ? false : 'zoom',
          hovermode: 'closest'
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
