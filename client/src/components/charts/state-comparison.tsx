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

interface StateComparisonProps {
  data: Record<string, AccidentData>;
}

export default function StateComparison({ data }: StateComparisonProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const chartData = useMemo(() => {
    const states = Object.keys(data || {});
    const totalAccidents = states.map(state => data[state].total_accidents);
    const fatalAccidents = states.map(state => data[state].fatal_accidents);

    return [
      {
        x: states,
        y: totalAccidents,
        type: 'bar',
        name: 'Total Accidents',
        hovertemplate: '<b>%{x}</b><br>' +
          'Total Accidents: %{y}<br>' +
          '<extra></extra>'
      },
      {
        x: states,
        y: fatalAccidents,
        type: 'bar',
        name: 'Fatal Accidents',
        hovertemplate: '<b>%{x}</b><br>' +
          'Fatal Accidents: %{y}<br>' +
          '<extra></extra>'
      }
    ];
  }, [data]);

  return (
    <div className="w-full relative">
      <h2 className="text-xl font-semibold mb-4">State-wise Comparison</h2>
      <Plot
        data={chartData}
        layout={{
          autosize: true,
          height: isMobile ? 350 : 400,
          margin: isMobile 
            ? { l: 40, r: 20, t: 30, b: 100 }
            : { l: 50, r: 50, t: 30, b: 100 },
          xaxis: { 
            title: 'State',
            tickangle: -45,
            fixedrange: isMobile
          },
          yaxis: { 
            title: 'Number of Accidents',
            fixedrange: isMobile
          },
          barmode: 'group',
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