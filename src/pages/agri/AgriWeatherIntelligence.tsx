import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Sun, Thermometer, Wind, Droplets, AlertTriangle, MapPin, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const rainfallForecast = [
  { week: "W1", kaduna: 45, kano: 28, benue: 62, oyo: 38 },
  { week: "W2", kaduna: 52, kano: 35, benue: 48, oyo: 42 },
  { week: "W3", kaduna: 38, kano: 18, benue: 72, oyo: 55 },
  { week: "W4", kaduna: 68, kano: 42, benue: 85, oyo: 48 },
];

const zones = [
  { name: "Kaduna", temp: "28°C", humidity: "62%", rainfall: "45mm", wind: "12 km/h", risk: "low", outlook: "Favorable planting conditions" },
  { name: "Kano", temp: "34°C", humidity: "38%", rainfall: "28mm", wind: "18 km/h", risk: "medium", outlook: "Dry spell expected — irrigation advised" },
  { name: "Benue", temp: "26°C", humidity: "78%", rainfall: "62mm", wind: "8 km/h", risk: "low", outlook: "Good moisture for transplanting" },
  { name: "Sokoto", temp: "38°C", humidity: "25%", rainfall: "12mm", wind: "22 km/h", risk: "high", outlook: "Extreme heat — delay planting" },
];

const AgriWeatherIntelligence = () => (
  <IndustryLayout industryCode="agri">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
          <CloudRain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Weather Intelligence</h1>
          <p className="text-muted-foreground">Real-time weather data and agricultural impact analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {zones.map((z) => (
          <Card key={z.name} className={`border-border/50 ${z.risk === "high" ? "border-destructive/30" : ""}`}>
            <CardContent className="pt-5 pb-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-foreground">{z.name}</p>
                <Badge variant={z.risk === "high" ? "destructive" : z.risk === "medium" ? "secondary" : "outline"} className="text-[10px]">{z.risk} risk</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1"><Thermometer className="w-3 h-3 text-red-400" />{z.temp}</div>
                <div className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" />{z.humidity}</div>
                <div className="flex items-center gap-1"><CloudRain className="w-3 h-3 text-sky-400" />{z.rainfall}</div>
                <div className="flex items-center gap-1"><Wind className="w-3 h-3 text-gray-400" />{z.wind}</div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">{z.outlook}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><CloudRain className="w-5 h-5 text-sky-500" />4-Week Rainfall Forecast (mm)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={rainfallForecast}>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="kaduna" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Kaduna" />
              <Area type="monotone" dataKey="kano" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} name="Kano" />
              <Area type="monotone" dataKey="benue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Benue" />
              <Area type="monotone" dataKey="oyo" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Oyo" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AgriWeatherIntelligence;
