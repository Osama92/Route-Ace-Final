import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, TrendingUp, Package, AlertTriangle, Zap, ArrowUpRight } from "lucide-react";

const forecastData = [
  { month: "Jul", predicted: 18200, lower: 16400, upper: 20000 },
  { month: "Aug", predicted: 19800, lower: 17800, upper: 21800 },
  { month: "Sep", predicted: 22400, lower: 20100, upper: 24700 },
  { month: "Oct", predicted: 24600, lower: 22100, upper: 27100 },
  { month: "Nov", predicted: 28200, lower: 25400, upper: 31000 },
  { month: "Dec", predicted: 34800, lower: 31300, upper: 38300 },
];

const skuForecasts = [
  { sku: "Hennessy VS 750ml", current: 420, predicted30d: 580, confidence: 89, restock: "Order 200 cases by Mar 15", urgency: "high" },
  { sku: "Johnnie Walker Black 750ml", current: 310, predicted30d: 380, confidence: 82, restock: "Order 80 cases by Mar 20", urgency: "medium" },
  { sku: "Grey Goose 1L", current: 180, predicted30d: 240, confidence: 76, restock: "Order 70 cases by Mar 18", urgency: "medium" },
  { sku: "Patrón Silver 750ml", current: 95, predicted30d: 160, confidence: 91, restock: "Urgent: Order 80 cases NOW", urgency: "critical" },
  { sku: "Moët & Chandon Brut", current: 220, predicted30d: 200, confidence: 85, restock: "Adequate stock", urgency: "low" },
];

const seasonalFactors = [
  { event: "Easter Weekend", impact: "+28%", category: "Spirits & Wine", date: "Apr 18-21" },
  { event: "Independence Day", impact: "+42%", category: "All Categories", date: "Oct 1" },
  { event: "Christmas/NYE", impact: "+65%", category: "Premium Spirits", date: "Dec 20 - Jan 2" },
  { event: "Ramadan", impact: "-35%", category: "All Alcohol", date: "Feb 28 - Mar 30" },
];

const LiquorDemandForecast = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Demand Forecasting Engine</h1>
          <p className="text-sm text-muted-foreground">AI-powered demand predictions, automated restocking & seasonal intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Forecast Accuracy", value: "87%", icon: Brain, color: "text-primary" },
          { label: "SKUs Tracked", value: "1,842", icon: Package, color: "text-blue-500" },
          { label: "Restock Alerts", value: "14", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Growth Trend", value: "+18%", icon: TrendingUp, color: "text-emerald-500" },
        ].map((k) => (
          <Card key={k.label}><CardContent className="p-4 text-center">
            <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>6-Month Demand Forecast (Cases)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="upper" stroke="none" fill="hsl(var(--primary) / 0.08)" />
              <Area type="monotone" dataKey="predicted" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
              <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(var(--background))" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>SKU-Level Restock Intelligence</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {skuForecasts.map((s, i) => (
              <motion.div key={s.sku} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="p-3 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{s.sku}</p>
                  <Badge className={
                    s.urgency === "critical" ? "bg-destructive/15 text-destructive" :
                    s.urgency === "high" ? "bg-amber-500/15 text-amber-600" :
                    s.urgency === "medium" ? "bg-blue-500/15 text-blue-600" :
                    "bg-emerald-500/15 text-emerald-600"
                  }>{s.urgency}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Current: {s.current} → 30d Predicted: {s.predicted30d} · {s.confidence}% confidence</p>
                <p className="text-xs font-medium mt-1 flex items-center gap-1"><Zap className="w-3 h-3" />{s.restock}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Seasonal Impact Calendar</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {seasonalFactors.map((s, i) => (
              <motion.div key={s.event} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{s.event}</p>
                  <p className="text-xs text-muted-foreground">{s.date} · {s.category}</p>
                </div>
                <Badge className={s.impact.startsWith("+") ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/15 text-destructive"}>
                  {s.impact}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default LiquorDemandForecast;
