import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AccidentData {
  total_accidents: number;
  fatal_accidents: number;
  yearly_data: {
    [year: string]: {
      total: number;
      fatal: number;
    };
  };
}

interface AccidentTrendsProps {
  data: Record<string, AccidentData>;
}

export default function AccidentTrends({ data }: AccidentTrendsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const chartData = useMemo(() => {
    return Object.entries(data || {}).map(([state, stats]) => ({
      x: [2019, 2020, 2021, 2022, 2023],
      y: [
        stats.yearly_data["2019"].total,
        stats.yearly_data["2020"].total,
        stats.yearly_data["2021"].total,
        stats.yearly_data["2022"].total,
        stats.yearly_data["2023"].total
      ],
      type: 'scatter',
      mode: 'lines+markers',
      name: state,
      hovertemplate: `<b>${state}</b><br>` +
        'Year: %{x}<br>' +
        'Accidents: %{y}<br>' +
        '<extra></extra>'
    }));
  }, [data]);

  return (
    <div className="w-full relative">
      <h2 className="text-xl font-semibold mb-4">Accident Trends Over Time</h2>
      <Plot
        data={chartData}
        layout={{
          autosize: true,
          height: isMobile ? 300 : 400,
          margin: isMobile 
            ? { l: 40, r: 20, t: 30, b: 40 }
            : { l: 50, r: 50, t: 30, b: 50 },
          xaxis: { 
            title: 'Year',
            fixedrange: isMobile // Disable zoom on x-axis for mobile
          },
          yaxis: { 
            title: 'Number of Accidents',
            fixedrange: isMobile // Disable zoom on y-axis for mobile
          },
          showlegend: true,
          legend: isMobile ? {
            orientation: 'h',
            y: -0.3,
            x: 0.5,
            xanchor: 'center'
          } : undefined,
          dragmode: isMobile ? false : 'zoom', // Disable drag to zoom on mobile
          hovermode: 'closest'
        }}
        config={{
          responsive: true,
          displayModeBar: !isMobile, // Hide mode bar on mobile
          modeBarButtonsToRemove: ['lasso2d', 'select2d'],
          displaylogo: false
        }}
        style={{ width: '100%' }}
        className="transition-all duration-300"
      />
    </div>
  );
}