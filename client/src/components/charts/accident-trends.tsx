import { useMemo } from "react";
import Plot from "react-plotly.js";

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