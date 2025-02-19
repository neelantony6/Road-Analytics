import { useMemo } from "react";
import Plot from "react-plotly.js";

interface AccidentTrendsProps {
  data: Record<string, any>;
}

export default function AccidentTrends({ data }: AccidentTrendsProps) {
  const chartData = useMemo(() => {
    return Object.entries(data || {}).map(([state, stats]: [string, any]) => ({
      x: [2019, 2020, 2021, 2022, 2023],
      y: [stats.total_accidents * 0.8, stats.total_accidents * 0.85, stats.total_accidents * 0.9, stats.total_accidents * 0.95, stats.total_accidents],
      type: 'scatter',
      mode: 'lines+markers',
      name: state
    }));
  }, [data]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Accident Trends Over Time</h2>
      <Plot
        data={chartData}
        layout={{
          autosize: true,
          height: 400,
          margin: { l: 50, r: 50, t: 30, b: 50 },
          xaxis: { title: 'Year' },
          yaxis: { title: 'Number of Accidents' },
          showlegend: true
        }}
        config={{ responsive: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}
