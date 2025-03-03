import { Card } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import RoadAccidentGraph from "@/components/charts/road-accident-graph";

const mockData = {
  yearly_data: {
    "2019": { total: 7800, fatal: 280 },
    "2020": { total: 7200, fatal: 265 },
    "2021": { total: 8500, fatal: 305 }
  }
};

export default function AnalyticsView() {
  const timeSeriesData = Object.entries(mockData.yearly_data).map(([year, stats]) => ({
    year,
    total: stats.total,
    fatal: stats.fatal
  }));

  // Prepare data for road accident graph
  const roadAccidentData = {
    years: ["2016", "2017", "2018", "2019", "2020", "2021"],
    accidents: [45000, 47500, 49200, 50100, 46800, 48500]
  };

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
            <LineChart data={timeSeriesData}>
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

      <Card className="p-8 shadow-lg hover:shadow-xl transition-shadow">
        <RoadAccidentGraph data={roadAccidentData} />
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Highest accident rate recorded in 2021</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-primary/10 p-1 rounded-full mt-1">•</span>
              <span>Lowest fatality rate in 2020</span>
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
              <span>Enhance emergency response capabilities</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsView() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Traffic Safety Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Road Accident Trends (2019-2023)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <iframe 
              src="/road_accident_trends.html" 
              className="w-full h-full border-0" 
              title="Road Accident Trends"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top States by Accidents (2019)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <iframe 
              src="/top_states_accidents_2019.html" 
              className="w-full h-full border-0" 
              title="Top States by Accidents"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
