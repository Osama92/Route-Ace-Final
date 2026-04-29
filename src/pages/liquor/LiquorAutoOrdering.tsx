import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, ShoppingCart, Clock, CheckCircle, Settings, TrendingUp, Package, AlertTriangle } from "lucide-react";

const autoOrderRules = [
  { retailer: "Sky Lounge Bar", rule: "Reorder when stock < 20% threshold", frequency: "Weekly check", lastTriggered: "Mar 6", status: "active", nextOrder: "Mar 13" },
  { retailer: "The Grill House", rule: "Auto-reorder top 5 SKUs monthly", frequency: "Monthly", lastTriggered: "Feb 28", status: "active", nextOrder: "Mar 28" },
  { retailer: "Club Mirage", rule: "Event-based surge ordering", frequency: "On-demand", lastTriggered: "Mar 1", status: "active", nextOrder: "Mar 15" },
  { retailer: "Quick Mart Liquors", rule: "Reorder when stock < 30%", frequency: "Bi-weekly", lastTriggered: "Feb 20", status: "paused", nextOrder: "—" },
];

const pendingAutoOrders = [
  { id: "AO-1842", retailer: "Sky Lounge Bar", items: 8, value: 4200, trigger: "Low stock alert", eta: "Mar 10" },
  { id: "AO-1843", retailer: "Club Mirage", items: 12, value: 8600, trigger: "Event surge (St Patrick's)", eta: "Mar 14" },
  { id: "AO-1844", retailer: "Metro Wine Bar", items: 5, value: 2800, trigger: "Scheduled reorder", eta: "Mar 12" },
];

const kpis = [
  { label: "Auto-Orders (Mo)", value: "142", icon: ShoppingCart, color: "text-primary" },
  { label: "Time Saved", value: "48h", icon: Clock, color: "text-emerald-500" },
  { label: "Fill Rate", value: "98%", icon: CheckCircle, color: "text-blue-500" },
  { label: "Revenue Impact", value: "+12%", icon: TrendingUp, color: "text-amber-500" },
];

const LiquorAutoOrdering = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Automated Ordering Engine</h1>
            <p className="text-sm text-muted-foreground">Smart reorder rules, low-stock triggers & scheduled replenishment</p>
          </div>
        </div>
        <Button className="gap-2"><Settings className="w-4 h-4" /> Configure Rules</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Card key={k.label}><CardContent className="p-4 text-center">
            <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">3 Auto-Orders Pending Approval</p>
            <p className="text-xs text-muted-foreground">Review and confirm auto-generated orders before dispatch.</p>
          </div>
          <Button size="sm" variant="outline">Review All</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" />Active Ordering Rules</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {autoOrderRules.map((r, i) => (
              <motion.div key={r.retailer} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="p-3 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{r.retailer}</p>
                  <Badge className={r.status === "active" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}>
                    {r.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{r.rule}</p>
                <p className="text-xs text-muted-foreground">{r.frequency} · Last: {r.lastTriggered} · Next: {r.nextOrder}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Pending Auto-Orders</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {pendingAutoOrders.map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="p-3 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                    <p className="font-medium text-sm">{o.retailer}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">Approve</Button>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{o.items} items · ${o.value.toLocaleString()} · {o.trigger} · ETA: {o.eta}</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default LiquorAutoOrdering;
