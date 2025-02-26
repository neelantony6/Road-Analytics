
import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AccidentTrendsProps {
  data: {
    yearly_data: {
      [year: string]: {
        total: number;
        fatal: number;
      }
    }
  };
}

export default function AccidentTrends({ data }: AccidentTrendsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const chartData = useMemo(() => {
    const years = Object.keys(data.yearly_data);
    return [
      {
        x: years,
        y: years.map(year => data.yearly_data[year].total),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Total Accidents',
        hovertemplate: 'Year: %{x}<br>Total Accidents: %{y}<extra></extra>'
      },
      {
        x: years,
        y: years.map(year => data.yearly_data[year].fatal),
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Fatal Accidents',
        hovertemplate: 'Year: %{x}<br>Fatal Accidents: %{y}<extra></extra>'
      }
    ];
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
}
