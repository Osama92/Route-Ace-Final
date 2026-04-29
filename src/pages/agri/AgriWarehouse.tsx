import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Warehouse, Thermometer, Package, AlertTriangle, Clock, BarChart3, Boxes, Shield } from "lucide-react";

const warehouses = [
  { name: "Kaduna Hub", capacity: 85, temp: "18°C", humidity: "42%", status: "optimal", items: 12400 },
  { name: "Kano Depot", capacity: 72, temp: "22°C", humidity: "38%", status: "optimal", items: 8900 },
  { name: "Benue Store", capacity: 94, temp: "26°C", humidity: "55%", status: "warning", items: 15200 },
  { name: "Oyo Facility", capacity: 61, temp: "20°C", humidity: "44%", status: "optimal", items: 6800 },
];

const expiryAlerts = [
  { product: "NPK 15:15:15 (50kg)", batch: "B-2026-0312", expiry: "Apr 15, 2026", qty: 450, severity: "high" },
  { product: "Glyphosate 360 SL", batch: "B-2026-0289", expiry: "May 02, 2026", qty: 1200, severity: "medium" },
  { product: "Hybrid Maize Seed", batch: "B-2025-1104", expiry: "Mar 28, 2026", qty: 800, severity: "critical" },
  { product: "Urea (46-0-0)", batch: "B-2026-0401", expiry: "Jun 30, 2026", qty: 2100, severity: "low" },
];

const inventoryCategories = [
  { category: "Seeds", stock: 34200, value: "₦28.4M", fill: 72 },
  { category: "Fertilizers", stock: 52100, value: "₦45.2M", fill: 88 },
  { category: "Pesticides", stock: 18400, value: "₦12.8M", fill: 65 },
  { category: "Irrigation", stock: 4200, value: "₦8.1M", fill: 45 },
  { category: "Equipment", stock: 1800, value: "₦15.6M", fill: 38 },
];

const AgriWarehouse = () => (
  <IndustryLayout industryCode="agri">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Warehouse className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Warehouse & Inventory</h1>
          <p className="text-muted-foreground">Climate-sensitive storage, batch tracking, and expiry management</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total SKUs", value: "110,700", icon: Package, color: "text-blue-500" },
          { label: "Expiry Alerts", value: "14", icon: AlertTriangle, color: "text-amber-500" },
          { label: "Climate Warnings", value: "3", icon: Thermometer, color: "text-red-500" },
          { label: "Batch Compliance", value: "96%", icon: Shield, color: "text-emerald-500" },
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

      {/* Warehouse Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {warehouses.map((w) => (
          <Card key={w.name} className={`border-border/50 ${w.status === "warning" ? "border-amber-500/30" : ""}`}>
            <CardContent className="pt-5 pb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-foreground">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.items.toLocaleString()} units</p>
                </div>
                <Badge variant={w.status === "optimal" ? "default" : "destructive"} className="text-[10px]">{w.status}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="text-sm font-bold">{w.capacity}%</p>
                  <Progress value={w.capacity} className="h-1.5 mt-1" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Temp</p>
                  <p className="text-sm font-bold">{w.temp}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="text-sm font-bold">{w.humidity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiry Alerts */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" />Expiry Alerts</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiryAlerts.map((a) => (
                  <TableRow key={a.batch}>
                    <TableCell className="font-medium text-xs">{a.product}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.batch}</TableCell>
                    <TableCell className="text-xs">{a.expiry}</TableCell>
                    <TableCell>
                      <Badge variant={a.severity === "critical" ? "destructive" : a.severity === "high" ? "destructive" : "secondary"} className="text-[10px]">
                        {a.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Category Inventory */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Boxes className="w-5 h-5 text-blue-500" />Inventory by Category</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {inventoryCategories.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{cat.category}</span>
                  <span className="text-xs text-muted-foreground">{cat.value} · {cat.stock.toLocaleString()} units</span>
                </div>
                <Progress value={cat.fill} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default AgriWarehouse;
