import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const forecast = [
  { month: "Mar", brakes: 4200, engine: 2800, filters: 8500, electrical: 3200 },
  { month: "Apr", brakes: 4800, engine: 3100, filters: 9200, electrical: 3500 },
  { month: "May", brakes: 5200, engine: 3400, filters: 10100, electrical: 3800 },
  { month: "Jun", brakes: 4500, engine: 3800, filters: 8800, electrical: 4200 },
  { month: "Jul", brakes: 4100, engine: 4200, filters: 7500, electrical: 3900 },
  { month: "Aug", brakes: 4800, engine: 3600, filters: 8200, electrical: 3600 },
];

const AutoDemandForecast = () => (
  <IndustryLayout industryCode="auto">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-zinc-800 flex items-center justify-center">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Parts Demand Forecasting</h1>
          <p className="text-muted-foreground">AI-driven demand predictions for auto parts categories</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-zinc-500" />6-Month Demand Forecast</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={forecast}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="brakes" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} name="Brakes" />
              <Area type="monotone" dataKey="engine" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} name="Engine" />
              <Area type="monotone" dataKey="filters" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Filters" />
              <Area type="monotone" dataKey="electrical" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} name="Electrical" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AutoDemandForecast;
