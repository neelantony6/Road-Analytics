import { useMemo } from "react";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@/hooks/use-media-query";

function AccidentTrends({ data }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const chartData = useMemo(() => {
    // Format data for Plotly, similar to Python implementation
    const states = Object.keys(data?.yearly_data || {});
    const years = ['2016', '2017', '2018', '2019'];

    // Create a line for each state
    return states.map(state => ({
      x: years,
      y: years.map(year => data.yearly_data[state]?.[year] || 0),
      type: 'scatter',
      mode: 'lines',
      name: state,
      hovertemplate: '<b>%{x}</b><br>' +
        'Total Accidents: %{y}<br>' +
        '<extra></extra>'
    }));
  }, [data]);

  return (
    <div className="w-full relative">
      <h2 className="text-xl font-semibold mb-4">Road Accident Trends Across States (2016–2019)</h2>
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
            title: 'Total Road Accidents',
            fixedrange: isMobile
          },
          showlegend: true,
          legend: isMobile ? {
            orientation: 'h',
            y: -0.3,
            x: 0.5,
            xanchor: 'center'
          } : {
            x: 1,
            xanchor: 'right',
            y: 1
          },
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
}

export default AccidentTrends;