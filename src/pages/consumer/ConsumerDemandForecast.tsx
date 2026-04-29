import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const forecast = [
  { month: "Mar", homeCare: 42, personalCare: 35, foodBev: 55, babyCare: 15 },
  { month: "Apr", homeCare: 45, personalCare: 38, foodBev: 52, babyCare: 16 },
  { month: "May", homeCare: 48, personalCare: 42, foodBev: 58, babyCare: 18 },
  { month: "Jun", homeCare: 44, personalCare: 45, foodBev: 62, babyCare: 17 },
  { month: "Jul", homeCare: 42, personalCare: 40, foodBev: 56, babyCare: 19 },
  { month: "Aug", homeCare: 46, personalCare: 38, foodBev: 60, babyCare: 20 },
];

const ConsumerDemandForecast = () => (
  <IndustryLayout industryCode="consumer">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Demand Forecasting AI</h1>
          <p className="text-muted-foreground">Predict demand patterns across product categories</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-teal-500" />6-Month Category Forecast (₦M)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={forecast}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="homeCare" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} name="Home Care" />
              <Area type="monotone" dataKey="personalCare" stroke="#ec4899" fill="#ec4899" fillOpacity={0.15} name="Personal Care" />
              <Area type="monotone" dataKey="foodBev" stroke="#10b981" fill="#10b981" fillOpacity={0.15} name="Food & Bev" />
              <Area type="monotone" dataKey="babyCare" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} name="Baby Care" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default ConsumerDemandForecast;
