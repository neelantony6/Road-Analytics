import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@/hooks/use-media-query";

function AccidentTrends({ data }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const chartData = useMemo(() => {
    const years = Object.keys(data?.yearly_data || {}).sort();
    const totalAccidents = years.map(year => data.yearly_data[year].total);
    const fatalAccidents = years.map(year => data.yearly_data[year].fatal);

    return [
      {
        x: years,
        y: totalAccidents,
        type: 'line',
        name: 'Total Accidents',
        marker: { color: 'blue' },
        hovertemplate: '<b>%{x}</b><br>' +
          'Total Accidents: %{y}<br>' +
          '<extra></extra>'
      },
      {
        x: years,
        y: fatalAccidents,
        type: 'line',
        name: 'Fatal Accidents',
        marker: { color: 'red' },
        hovertemplate: '<b>%{x}</b><br>' +
          'Fatal Accidents: %{y}<br>' +
          '<extra></extra>'
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
          height: isMobile ? 350 : 400,
          margin: isMobile 
            ? { l: 40, r: 20, t: 30, b: 50 }
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

export default AccidentTrends;