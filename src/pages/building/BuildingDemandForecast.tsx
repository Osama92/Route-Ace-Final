import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const forecast = [
  { month: "Mar", cement: 8500, steel: 3200, tiles: 1800, paint: 900 },
  { month: "Apr", cement: 9200, steel: 3800, tiles: 2100, paint: 1100 },
  { month: "May", cement: 10500, steel: 4200, tiles: 2800, paint: 1500 },
  { month: "Jun", cement: 11200, steel: 4500, tiles: 3200, paint: 1800 },
  { month: "Jul", cement: 9800, steel: 3900, tiles: 3800, paint: 2200 },
  { month: "Aug", cement: 8200, steel: 3100, tiles: 4200, paint: 2800 },
];

const BuildingDemandForecast = () => (
  <IndustryLayout industryCode="building">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Material Demand Forecasting</h1>
          <p className="text-muted-foreground">AI-driven demand predictions based on project pipelines</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-amber-500" />6-Month Material Demand Forecast</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={forecast}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="cement" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="Cement" />
              <Area type="monotone" dataKey="steel" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Steel" />
              <Area type="monotone" dataKey="tiles" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Tiles" />
              <Area type="monotone" dataKey="paint" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Paint" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BuildingDemandForecast;
