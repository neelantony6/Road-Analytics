import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockTimeSeriesData = [
  { year: 2019, total: 7800, fatal: 280 },
  { year: 2020, total: 7200, fatal: 265 },
  { year: 2021, total: 8500, fatal: 305 }
];

export default function AnalyticsView() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
          Advanced Analytics
        </h1>
        <p className="text-lg text-muted-foreground">
          Detailed analysis of accident trends and patterns
        </p>
      </div>

      <Card className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Accident Trends Over Time</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockTimeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total Accidents" stroke="#8884d8" />
              <Line type="monotone" dataKey="fatal" name="Fatal Accidents" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Year-over-year increase in accident rates across most states</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Fatality rates showing slight decline in proportion to total accidents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Regional variations in accident patterns identified</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Implement targeted safety measures in high-risk areas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Enhance emergency response capabilities in accident-prone zones</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Develop predictive models for accident prevention</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}