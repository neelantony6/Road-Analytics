import React from "react";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@/hooks/use-media-query";

interface RoadAccidentGraphProps {
  data: {
    stateUT: string[];
    accidents2019: number[];
  };
}

const RoadAccidentGraph: React.FC<RoadAccidentGraphProps> = ({ data }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="w-full relative">
      <h2 className="text-xl font-semibold mb-4">Top States/UTs with Most Road Accidents (2019)</h2>
      <Plot
        data={[
          {
            x: data.stateUT,
            y: data.accidents2019,
            type: "bar",
            text: data.accidents2019.map(String),
            textposition: 'outside',
            marker: { color: "rgb(136, 132, 216)" },
            hovertemplate: '<b>%{x}</b><br>' +
              'Road Accidents (2019): %{y}<br>' +
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
            title: 'Road Accidents (2019)',
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