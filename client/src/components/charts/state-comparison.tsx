import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StateData {
  yearly_data: {
    [state: string]: {
      [year: string]: number;
    };
  };
}

interface StateComparisonProps {
  data: StateData;
  selectedYear: string;
}

const StateComparison = ({ data, selectedYear }: StateComparisonProps) => {
  // Transform data for recharts
  const chartData = Object.entries(data.yearly_data).map(([state, yearData]) => ({
    state,
    accidents: yearData[selectedYear]
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>State-wise Accident Distribution ({selectedYear})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="state" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => value.toLocaleString()}
                labelFormatter={(label) => `State: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="accidents" 
                name="Number of Accidents" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StateComparison;