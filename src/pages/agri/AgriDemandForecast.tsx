import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, CloudRain, Sun, Sprout, BarChart3, MapPin, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const forecastData = [
  { month: "Mar", actual: 3200, predicted: 3400, confidence: 92 },
  { month: "Apr", actual: 4800, predicted: 4600, confidence: 88 },
  { month: "May", actual: null, predicted: 5200, confidence: 85 },
  { month: "Jun", actual: null, predicted: 4100, confidence: 78 },
  { month: "Jul", actual: null, predicted: 2800, confidence: 72 },
  { month: "Aug", actual: null, predicted: 1500, confidence: 68 },
];

const weatherImpact = [
  { zone: "Kaduna", rainfall: 85, tempDev: 2.1, impact: "positive" },
  { zone: "Kano", rainfall: 62, tempDev: -1.3, impact: "neutral" },
  { zone: "Benue", rainfall: 120, tempDev: 0.8, impact: "positive" },
  { zone: "Sokoto", rainfall: 35, tempDev: 3.4, impact: "negative" },
];

const signals = [
  { signal: "Early rains detected in Kaduna", confidence: 94, action: "Increase seed stock by 15%", type: "weather" },
  { signal: "Maize price surge in futures market", confidence: 87, action: "Pre-position NPK fertilizer", type: "market" },
  { signal: "Government subsidy program announced", confidence: 91, action: "Prepare certified seed inventory", type: "policy" },
  { signal: "Pest outbreak risk — Fall Armyworm", confidence: 76, action: "Stock insecticides in Benue/Kano", type: "pest" },
];

const AgriDemandForecast = () => (
  <IndustryLayout industryCode="agri">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Seasonal Demand Forecasting</h1>
          <p className="text-muted-foreground">AI-powered demand prediction aligned to crop cycles and weather</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Forecast Accuracy", value: "87%", icon: Brain, color: "text-violet-500" },
          { label: "Active Signals", value: "24", icon: Zap, color: "text-amber-500" },
          { label: "Weather Alerts", value: "4", icon: CloudRain, color: "text-blue-500" },
          { label: "Demand Growth", value: "+12.4%", icon: TrendingUp, color: "text-emerald-500" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-violet-500" />Input Demand Forecast (₦K)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecastData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="hsl(142 76% 36%)" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="hsl(262 83% 58%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CloudRain className="w-5 h-5 text-blue-500" />Weather Impact Analysis</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {weatherImpact.map((w) => (
              <div key={w.zone} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium text-sm">{w.zone}</p>
                  <p className="text-xs text-muted-foreground">Rainfall: {w.rainfall}mm · Temp deviation: {w.tempDev > 0 ? "+" : ""}{w.tempDev}°C</p>
                </div>
                <Badge variant={w.impact === "positive" ? "default" : w.impact === "negative" ? "destructive" : "secondary"} className="text-[10px]">
                  {w.impact}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" />AI Demand Signals</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {signals.map((s, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/50">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-sm text-foreground">{s.signal}</p>
                  <Badge variant="outline" className="text-[10px] ml-2">{s.confidence}%</Badge>
                </div>
                <p className="text-xs text-emerald-500 mt-1">→ {s.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default AgriDemandForecast;
