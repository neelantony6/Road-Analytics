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

interface StateComparisonProps {
  data: Record<string, AccidentData>;
}

export default function StateComparison({ data }: StateComparisonProps) {
  const chartData = useMemo(() => {
    const states = Object.keys(data || {});
    const totalAccidents = states.map(state => data[state].total_accidents);
    const fatalAccidents = states.map(state => data[state].fatal_accidents);

    return [
      {
        x: states,
        y: totalAccidents,
        type: 'bar',
        name: 'Total Accidents'
      },
      {
        x: states,
        y: fatalAccidents,
        type: 'bar',
        name: 'Fatal Accidents'
      }
    ];
  }, [data]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">State-wise Comparison</h2>
      <Plot
        data={chartData}
        layout={{
          autosize: true,
          height: 400,
          margin: { l: 50, r: 50, t: 30, b: 100 },
          xaxis: { title: 'State', tickangle: -45 },
          yaxis: { title: 'Number of Accidents' },
          barmode: 'group',
          showlegend: true
        }}
        config={{ responsive: true }}
        style={{ width: '100%' }}
      />
    </div>
  );
}