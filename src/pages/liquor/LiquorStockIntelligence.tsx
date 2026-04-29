import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package, AlertTriangle, TrendingDown, Wine, Clock, Brain,
  BarChart3, ShieldCheck, Thermometer, Calendar,
} from "lucide-react";

const stockItems = [
  { name: "Hennessy VS 750ml", sku: "HEN-VS-750", stock: 2840, minStock: 500, daysCover: 18, velocity: "High", expiry: "—", temp: "OK", status: "healthy" },
  { name: "Baileys Original 750ml", sku: "BAI-750", stock: 1540, minStock: 300, daysCover: 22, velocity: "High", expiry: "—", temp: "OK", status: "healthy" },
  { name: "Rémy Martin VSOP", sku: "REM-VSOP-700", stock: 890, minStock: 200, daysCover: 34, velocity: "Medium", expiry: "—", temp: "OK", status: "healthy" },
  { name: "Brandy XO Premium", sku: "BRX-XO-700", stock: 420, minStock: 100, daysCover: 68, velocity: "Low", expiry: "—", temp: "OK", status: "slow" },
  { name: "Craft Gin Batch #12", sku: "CG-B12-750", stock: 85, minStock: 200, daysCover: 4, velocity: "High", expiry: "—", temp: "OK", status: "critical" },
  { name: "Seasonal Eggnog Liqueur", sku: "SEL-EGG-500", stock: 340, minStock: 50, daysCover: 12, velocity: "Low", expiry: "Mar 28", temp: "4°C", status: "expiring" },
];

const statusConfig = {
  healthy: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", label: "Healthy" },
  slow: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30", label: "Slow Moving" },
  critical: { color: "bg-destructive/15 text-destructive border-destructive/30", label: "Critical Low" },
  expiring: { color: "bg-violet-500/15 text-violet-400 border-violet-500/30", label: "Expiry Alert" },
};

const LiquorStockIntelligence = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Stock Intelligence</h1>
          <p className="text-sm text-muted-foreground">Inventory health, expiry tracking & reorder intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <Package className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <p className="text-xl font-bold">42,680</p>
          <p className="text-xs text-muted-foreground">Total Cases</p>
        </CardContent></Card>
        <Card className="border-destructive/20"><CardContent className="pt-5 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
          <p className="text-xl font-bold">4</p>
          <p className="text-xs text-muted-foreground">Critical Low SKUs</p>
        </CardContent></Card>
        <Card className="border-amber-500/20"><CardContent className="pt-5 text-center">
          <TrendingDown className="w-5 h-5 mx-auto mb-1 text-amber-400" />
          <p className="text-xl font-bold">7</p>
          <p className="text-xs text-muted-foreground">Slow-Moving SKUs</p>
        </CardContent></Card>
        <Card className="border-violet-500/20"><CardContent className="pt-5 text-center">
          <Calendar className="w-5 h-5 mx-auto mb-1 text-violet-400" />
          <p className="text-xl font-bold">3</p>
          <p className="text-xs text-muted-foreground">Expiry Alerts (30d)</p>
        </CardContent></Card>
      </div>

      {/* AI Reorder Suggestion */}
      <Card className="border-rose-500/30 bg-rose-500/5">
        <CardContent className="py-4 flex items-center gap-4">
          <Brain className="w-6 h-6 text-rose-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">AI Reorder Recommendation</p>
            <p className="text-xs text-muted-foreground">Craft Gin Batch #12 has 4 days cover remaining. Predicted demand spike for weekend. Suggest PO for 500 cases.</p>
          </div>
          <Badge variant="destructive">Urgent</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Inventory Health Monitor</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {stockItems.map((item) => {
            const st = statusConfig[item.status as keyof typeof statusConfig];
            return (
              <div key={item.sku} className="flex items-center justify-between py-3 border-b last:border-0 border-border/30">
                <div className="flex items-center gap-4">
                  <Wine className="w-5 h-5 text-rose-400" />
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.sku} · Velocity: {item.velocity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold">{item.stock.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.daysCover}d cover</p>
                  </div>
                  <div className="w-24">
                    <Progress value={Math.min(100, (item.stock / (item.minStock * 5)) * 100)} className="h-1.5" />
                  </div>
                  {item.expiry !== "—" && <Badge variant="outline" className="text-xs"><Calendar className="w-3 h-3 mr-1" />{item.expiry}</Badge>}
                  <Badge className={`text-xs ${st.color}`}>{st.label}</Badge>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorStockIntelligence;
