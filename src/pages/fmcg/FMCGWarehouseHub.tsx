import { useState } from "react";
import FMCGLayout from "@/components/fmcg/FMCGLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Warehouse, Package, ClipboardList, RotateCcw, BarChart3,
  AlertTriangle, CheckCircle2, Clock, Search, Plus, Truck,
  MapPin, Boxes, ArrowDownUp, Trash2, RefreshCw, ScanLine,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import FMCGAIInsightPanel from "@/components/fmcg/FMCGAIInsightPanel";

/* ───────── Mock data for rich UI (backend wiring in next iteration) ───────── */

const warehouseStats = [
  { label: "Active Warehouses", value: "4", icon: Warehouse, color: "text-primary" },
  { label: "Total SKUs Tracked", value: "1,247", icon: Package, color: "text-emerald-600" },
  { label: "Open Picklists", value: "18", icon: ClipboardList, color: "text-orange-600" },
  { label: "Pending Returns", value: "7", icon: RotateCcw, color: "text-red-600" },
];

const warehouses = [
  { id: "1", name: "Lagos Hub", code: "WH-LAG", location: "Apapa, Lagos", capacity: 85, zones: 4, bins: 120, skus: 482, alerts: 2 },
  { id: "2", name: "Abuja DC", code: "WH-ABJ", location: "Kubwa, Abuja", capacity: 62, zones: 3, bins: 80, skus: 318, alerts: 0 },
  { id: "3", name: "Kano Regional", code: "WH-KAN", location: "Bompai, Kano", capacity: 74, zones: 3, bins: 95, skus: 274, alerts: 1 },
  { id: "4", name: "PH Depot", code: "WH-PHC", location: "Trans Amadi, PH", capacity: 91, zones: 4, bins: 110, skus: 173, alerts: 3 },
];

const picklists = [
  { id: "PL-001", order: "ORD-8821", outlet: "ShopRite Ikeja", items: 24, picked: 18, priority: "urgent", status: "picking", picker: "Adamu M.", type: "single" },
  { id: "PL-002", order: "ORD-8820", outlet: "Game VI", items: 18, picked: 0, priority: "normal", status: "pending", picker: "—", type: "batch" },
  { id: "PL-003", order: "ORD-8819", outlet: "Spar Lekki", items: 32, picked: 32, priority: "urgent", status: "completed", picker: "Chidi N.", type: "wave" },
  { id: "PL-004", order: "ORD-8818", outlet: "Market Square", items: 12, picked: 4, priority: "normal", status: "picking", picker: "Bola A.", type: "zone" },
  { id: "PL-005", order: "ORD-8817", outlet: "Justrite Oshodi", items: 28, picked: 0, priority: "normal", status: "pending", picker: "—", type: "single" },
];

const inventoryItems = [
  { sku: "SKU-0012", name: "Peak Milk 400g", bin: "A1-R2-S3", batch: "BT-2026-001", qty: 480, reserved: 24, expiry: "2026-09-15", warehouse: "Lagos Hub" },
  { sku: "SKU-0034", name: "Indomie Chicken 70g", bin: "B2-R1-S1", batch: "BT-2026-012", qty: 1200, reserved: 180, expiry: "2027-01-20", warehouse: "Lagos Hub" },
  { sku: "SKU-0056", name: "Golden Penny Flour 1kg", bin: "C1-R3-S2", batch: "BT-2026-003", qty: 320, reserved: 0, expiry: "2026-12-01", warehouse: "Abuja DC" },
  { sku: "SKU-0078", name: "Coca-Cola 50cl PET", bin: "A3-R1-S4", batch: "BT-2026-008", qty: 2400, reserved: 600, expiry: "2027-03-10", warehouse: "Lagos Hub" },
  { sku: "SKU-0091", name: "Dano Cool Cow 360g", bin: "D1-R2-S1", batch: "BT-2026-015", qty: 96, reserved: 12, expiry: "2026-08-30", warehouse: "Kano Regional" },
];

const cycleCounts = [
  { id: "CC-041", date: "2026-03-08", warehouse: "Lagos Hub", type: "daily", status: "in_progress", skusChecked: 42, discrepancies: 3, initiator: "Inventory Ctrl." },
  { id: "CC-040", date: "2026-03-07", warehouse: "Lagos Hub", type: "daily", status: "validated", skusChecked: 38, discrepancies: 1, initiator: "Inventory Ctrl." },
  { id: "CC-039", date: "2026-03-07", warehouse: "Abuja DC", type: "daily", status: "validated", skusChecked: 25, discrepancies: 0, initiator: "Warehouse Mgr." },
  { id: "CC-038", date: "2026-03-06", warehouse: "Kano Regional", type: "spot", status: "validated", skusChecked: 12, discrepancies: 2, initiator: "Inventory Ctrl." },
];

const reconciliations = [
  { id: "REC-018", date: "2026-03-07", warehouse: "Lagos Hub", status: "completed", skus: 482, discrepancies: 5, shortages: 3, overages: 1, misplaced: 1 },
  { id: "REC-017", date: "2026-03-06", warehouse: "Lagos Hub", status: "completed", skus: 480, discrepancies: 2, shortages: 1, overages: 1, misplaced: 0 },
  { id: "REC-016", date: "2026-03-07", warehouse: "Abuja DC", status: "pending", skus: 318, discrepancies: 0, shortages: 0, overages: 0, misplaced: 0 },
];

const returns = [
  { id: "RTN-091", number: "RTN-2026-091", outlet: "ShopRite Ikeja", category: "damaged", items: 8, status: "pending", requestedBy: "Sales Rep", date: "2026-03-08" },
  { id: "RTN-090", number: "RTN-2026-090", outlet: "Justrite Oshodi", category: "expired", items: 15, status: "approved", requestedBy: "Sales Rep", date: "2026-03-07" },
  { id: "RTN-089", number: "RTN-2026-089", outlet: "Spar Lekki", category: "customer_rejection", items: 4, status: "inspected", requestedBy: "ASM", date: "2026-03-07" },
  { id: "RTN-088", number: "RTN-2026-088", outlet: "Game VI", category: "promotional", items: 20, status: "completed", requestedBy: "Sales Supervisor", date: "2026-03-06" },
];

const statusColor = (s: string) => {
  switch (s) {
    case "picking": case "in_progress": return "secondary";
    case "completed": case "validated": return "default";
    case "pending": return "outline";
    case "approved": case "inspected": return "secondary";
    default: return "outline";
  }
};

const priorityColor = (p: string) => p === "urgent" ? "destructive" : "secondary";
const categoryLabel = (c: string) => c.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

const FMCGWarehouseHub = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <FMCGLayout title="Warehouse Management System" subtitle="Enterprise pick, pack, dispatch & inventory control">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {warehouseStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FMCGAIInsightPanel role="warehouse" />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Warehouses</TabsTrigger>
          <TabsTrigger value="picklists">Picklists</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="cycle-count">Cycle Count</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        {/* ─── WAREHOUSES OVERVIEW ─── */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouses.map((w) => (
              <Card key={w.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Warehouse className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{w.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{w.location}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">{w.code}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Capacity Utilization</span><span className="font-medium">{w.capacity}%</span></div>
                    <Progress value={w.capacity} className="h-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold">{w.zones}</p><p className="text-xs text-muted-foreground">Zones</p></div>
                    <div className="p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold">{w.bins}</p><p className="text-xs text-muted-foreground">Bins</p></div>
                    <div className="p-2 rounded-lg bg-muted/50"><p className="text-lg font-bold">{w.skus}</p><p className="text-xs text-muted-foreground">SKUs</p></div>
                  </div>
                  {w.alerts > 0 && (
                    <div className="flex items-center gap-2 text-sm text-destructive"><AlertTriangle className="w-4 h-4" />{w.alerts} active alert{w.alerts > 1 ? "s" : ""}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── PICKLISTS ─── */}
        <TabsContent value="picklists">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Active Picklist Queue</CardTitle>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Generate Picklist</Button>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search orders or outlets..." className="pl-9" /></div>
                <Select defaultValue="all"><SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="picking">Picking</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-3">
                {picklists.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <span className="font-mono text-sm text-muted-foreground w-20">{p.id}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{p.outlet}</p>
                      <p className="text-xs text-muted-foreground">{p.order} · {p.type} pick · Picker: {p.picker}</p>
                    </div>
                    <div className="w-32">
                      <p className="text-xs text-muted-foreground mb-1">{p.picked}/{p.items} items</p>
                      <Progress value={(p.picked / p.items) * 100} className="h-1.5" />
                    </div>
                    <Badge variant={priorityColor(p.priority)}>{p.priority}</Badge>
                    <Badge variant={statusColor(p.status)}>{p.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── INVENTORY ─── */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2"><Boxes className="w-5 h-5" /> Inventory Positioning</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><ScanLine className="w-4 h-4 mr-1" /> Scan Item</Button>
                <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Stock</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-4">
                <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" /><Input placeholder="Search SKU, batch, or bin..." className="pl-9" /></div>
                <Select defaultValue="all"><SelectTrigger className="w-44"><SelectValue placeholder="Warehouse" /></SelectTrigger><SelectContent><SelectItem value="all">All Warehouses</SelectItem>{warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4">SKU</th><th className="pb-2 pr-4">Product</th><th className="pb-2 pr-4">Bin</th><th className="pb-2 pr-4">Batch</th><th className="pb-2 pr-4 text-right">On Hand</th><th className="pb-2 pr-4 text-right">Reserved</th><th className="pb-2 pr-4 text-right">Available</th><th className="pb-2">Expiry</th>
                  </tr></thead>
                  <tbody>
                    {inventoryItems.map((item) => (
                      <tr key={item.sku} className="border-b last:border-0">
                        <td className="py-2.5 pr-4 font-mono text-xs">{item.sku}</td>
                        <td className="py-2.5 pr-4 font-medium">{item.name}</td>
                        <td className="py-2.5 pr-4"><Badge variant="outline" className="font-mono text-xs">{item.bin}</Badge></td>
                        <td className="py-2.5 pr-4 text-muted-foreground">{item.batch}</td>
                        <td className="py-2.5 pr-4 text-right font-medium">{item.qty.toLocaleString()}</td>
                        <td className="py-2.5 pr-4 text-right text-orange-600">{item.reserved}</td>
                        <td className="py-2.5 pr-4 text-right font-bold text-primary">{(item.qty - item.reserved).toLocaleString()}</td>
                        <td className="py-2.5">{item.expiry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── CYCLE COUNT ─── */}
        <TabsContent value="cycle-count">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2"><ArrowDownUp className="w-5 h-5" /> Daily Cycle Count</CardTitle>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> New Cycle Count</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cycleCounts.map((cc) => (
                  <div key={cc.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <span className="font-mono text-sm text-muted-foreground w-20">{cc.id}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{cc.warehouse}</p>
                      <p className="text-xs text-muted-foreground">{cc.date} · {cc.type} count · By: {cc.initiator}</p>
                    </div>
                    <div className="text-center w-20">
                      <p className="text-lg font-bold">{cc.skusChecked}</p>
                      <p className="text-xs text-muted-foreground">SKUs</p>
                    </div>
                    <div className="text-center w-24">
                      <p className={`text-lg font-bold ${cc.discrepancies > 0 ? "text-destructive" : "text-emerald-600"}`}>{cc.discrepancies}</p>
                      <p className="text-xs text-muted-foreground">Variances</p>
                    </div>
                    <Badge variant={statusColor(cc.status)}>{cc.status.replace("_", " ")}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── RECONCILIATION ─── */}
        <TabsContent value="reconciliation">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2"><RefreshCw className="w-5 h-5" /> Auto Reconciliation Engine</CardTitle>
              <Button size="sm"><RefreshCw className="w-4 h-4 mr-1" /> Run Reconciliation</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reconciliations.map((r) => (
                  <div key={r.id} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{r.warehouse} — {r.date}</p>
                        <p className="text-xs text-muted-foreground font-mono">{r.id}</p>
                      </div>
                      <Badge variant={r.status === "completed" ? "default" : "outline"}>{r.status}</Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-3 text-center">
                      <div className="p-2 rounded bg-muted/50"><p className="text-lg font-bold">{r.skus}</p><p className="text-xs text-muted-foreground">SKUs Checked</p></div>
                      <div className="p-2 rounded bg-muted/50"><p className={`text-lg font-bold ${r.discrepancies > 0 ? "text-destructive" : "text-emerald-600"}`}>{r.discrepancies}</p><p className="text-xs text-muted-foreground">Discrepancies</p></div>
                      <div className="p-2 rounded bg-red-50 dark:bg-red-950/20"><p className="text-lg font-bold text-red-600">{r.shortages}</p><p className="text-xs text-muted-foreground">Shortages</p></div>
                      <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/20"><p className="text-lg font-bold text-blue-600">{r.overages}</p><p className="text-xs text-muted-foreground">Overages</p></div>
                      <div className="p-2 rounded bg-yellow-50 dark:bg-yellow-950/20"><p className="text-lg font-bold text-yellow-600">{r.misplaced}</p><p className="text-xs text-muted-foreground">Misplaced</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── RETURNS ─── */}
        <TabsContent value="returns">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2"><RotateCcw className="w-5 h-5" /> Returns Management</CardTitle>
              <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Log Return</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {returns.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 py-3 border-b last:border-0">
                    <span className="font-mono text-sm text-muted-foreground w-28">{r.number}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{r.outlet}</p>
                      <p className="text-xs text-muted-foreground">{r.date} · Requested by: {r.requestedBy}</p>
                    </div>
                    <Badge variant="outline">{categoryLabel(r.category)}</Badge>
                    <span className="text-sm w-16 text-right">{r.items} items</span>
                    <Badge variant={statusColor(r.status)}>{r.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FMCGLayout>
  );
};

export default FMCGWarehouseHub;
