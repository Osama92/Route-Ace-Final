import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Globe, MapPin, ArrowRight, TrendingUp, Activity, Truck, Package, BarChart3 } from "lucide-react";

const corridors = [
  { from: "Lagos", to: "Kano", volume: "₦42B/mo", shipments: "18,400/wk", products: "FMCG, Building Materials, Pharma", efficiency: 87, growth: "+14%", status: "high-volume" },
  { from: "Lagos", to: "Abuja", volume: "₦38B/mo", shipments: "16,200/wk", products: "Consumer Goods, Electronics, Food", efficiency: 91, growth: "+11%", status: "high-volume" },
  { from: "Lagos", to: "Accra", volume: "$8.2M/mo", shipments: "1,240/wk", products: "Manufactured Goods, Cocoa, Textiles", efficiency: 72, growth: "+28%", status: "growing" },
  { from: "Mombasa", to: "Nairobi", volume: "KSh 6.8B/mo", shipments: "8,400/wk", products: "Tea, Coffee, Imports", efficiency: 84, growth: "+9%", status: "high-volume" },
  { from: "Nairobi", to: "Kampala", volume: "KSh 2.4B/mo", shipments: "3,200/wk", products: "Manufactured Goods, Agri-Inputs", efficiency: 68, growth: "+32%", status: "growing" },
  { from: "Lagos", to: "Rotterdam", volume: "$12.4M/mo", shipments: "420/mo", products: "Cocoa, Sesame, Cashew", efficiency: 78, growth: "+22%", status: "export" },
  { from: "Joburg", to: "Maputo", volume: "ZAR 1.2B/mo", shipments: "2,800/wk", products: "Minerals, Auto Parts, FMCG", efficiency: 82, growth: "+7%", status: "high-volume" },
  { from: "Dar es Salaam", to: "Kigali", volume: "$3.8M/mo", shipments: "1,800/wk", products: "Fuel, Building Materials, Food", efficiency: 64, growth: "+18%", status: "emerging" },
];

const corridorMetrics = [
  { label: "Active Corridors", value: "187", icon: Globe, color: "text-primary" },
  { label: "Daily Shipments", value: "128K", icon: Truck, color: "text-emerald-500" },
  { label: "Products Tracked", value: "24K SKUs", icon: Package, color: "text-purple-500" },
  { label: "Avg Efficiency", value: "79%", icon: BarChart3, color: "text-amber-500" },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  "high-volume": { bg: "bg-emerald-500/15", text: "text-emerald-600" },
  "growing": { bg: "bg-info/15", text: "text-info" },
  "export": { bg: "bg-purple-500/15", text: "text-purple-600" },
  "emerging": { bg: "bg-amber-500/15", text: "text-amber-600" },
};

const TradeCorridors = () => (
  <DashboardLayout title="Trade Corridor Intelligence" subtitle="Major trade corridors across Africa — volume, efficiency, and growth signals">
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {corridorMetrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-4 text-center">
              <m.icon className={`w-6 h-6 mx-auto mb-2 ${m.color}`} />
              <p className="text-xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {corridors.map((c, i) => {
          const sc = statusConfig[c.status] || statusConfig["emerging"];
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">{c.from}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <Globe className="w-4 h-4 text-info" />
                      <span className="font-semibold text-foreground">{c.to}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-bold">{c.volume}</Badge>
                      <Badge className={`${sc.bg} ${sc.text}`}>
                        {c.status === "high-volume" ? <Activity className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
                        {c.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-xs">
                    <div><span className="text-muted-foreground">Shipments</span><p className="font-semibold text-foreground">{c.shipments}</p></div>
                    <div><span className="text-muted-foreground">Products</span><p className="font-semibold text-foreground">{c.products}</p></div>
                    <div>
                      <span className="text-muted-foreground">Efficiency</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${c.efficiency}%` }} />
                        </div>
                        <span className="font-semibold text-foreground">{c.efficiency}%</span>
                      </div>
                    </div>
                    <div><span className="text-muted-foreground">Growth</span><p className="font-semibold text-emerald-500">{c.growth}</p></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  </DashboardLayout>
);

export default TradeCorridors;
