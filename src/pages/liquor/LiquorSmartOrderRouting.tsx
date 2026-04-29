import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Truck, MapPin, Package, ArrowRight, CheckCircle, Clock,
  Zap, Brain, BarChart3, Globe, AlertTriangle, Route,
} from "lucide-react";

const routedOrders = [
  { orderId: "ORD-4821", retailer: "The Gold Barrel Lounge", zone: "Victoria Island", items: 6, value: "₦1,842,000", assignedDist: "PrimeBev Distributors", warehouse: "VI Depot", route: "VI-Route-A", eta: "2 hours", status: "Routed", confidence: 98 },
  { orderId: "ORD-4822", retailer: "Metro Wines & Spirits", zone: "Lekki Phase 1", items: 8, value: "₦2,456,000", assignedDist: "Lagos Spirits Co.", warehouse: "Lekki Hub", route: "LK-Route-B", eta: "3 hours", status: "Routed", confidence: 94 },
  { orderId: "ORD-4823", retailer: "Skyline Nightclub", zone: "Victoria Island", items: 12, value: "₦4,200,000", assignedDist: "PrimeBev Distributors", warehouse: "VI Depot", route: "VI-Route-A", eta: "2 hours", status: "Consolidated", confidence: 96 },
  { orderId: "ORD-4824", retailer: "La Maison Bistro", zone: "Victoria Island", items: 4, value: "₦968,000", assignedDist: "Peninsula Wines", warehouse: "Ikoyi Store", route: "IK-Route-C", eta: "4 hours", status: "Routed", confidence: 91 },
  { orderId: "ORD-4825", retailer: "Corner Liquors Express", zone: "Ajah", items: 3, value: "₦524,000", assignedDist: "Lagos Spirits Co.", warehouse: "Lekki Hub", route: "AJ-Route-D", eta: "6 hours", status: "Pending", confidence: 82 },
  { orderId: "ORD-4826", retailer: "Supreme Beverages", zone: "Ikeja", items: 10, value: "₦1,680,000", assignedDist: "NorthCity Beverages", warehouse: "Ikeja DC", route: "IK-Route-A", eta: "3 hours", status: "Routed", confidence: 95 },
];

const routingRules = [
  { rule: "Territory Rights", desc: "Order goes to distributor with exclusive territory rights for the retailer's zone", priority: 1 },
  { rule: "Inventory Availability", desc: "System checks real-time stock at nearest warehouse before assignment", priority: 2 },
  { rule: "Delivery SLA", desc: "Routes to warehouse that can meet the retailer's delivery window preference", priority: 3 },
  { rule: "Cost Optimization", desc: "Consolidates orders on same route to minimize delivery cost per case", priority: 4 },
  { rule: "Compliance Check", desc: "Verifies distributor license covers the product category and retailer type", priority: 5 },
];

const routingStats = [
  { label: "Auto-Routed", value: "94%", icon: Zap, color: "text-primary" },
  { label: "Avg Routing Time", value: "1.2s", icon: Clock, color: "text-emerald-500" },
  { label: "Order Consolidation", value: "34%", icon: Package, color: "text-blue-500" },
  { label: "Routing Conflicts", value: "3", icon: AlertTriangle, color: "text-amber-500" },
];

const LiquorSmartOrderRouting = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Smart Order Routing Engine</h1>
          <p className="text-sm text-muted-foreground">Automatic distributor assignment, warehouse selection, and route optimization</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {routingStats.map(k => (
            <Card key={k.label}>
              <CardContent className="p-3 text-center">
                <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Routing Rules */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Route className="w-4 h-4" /> Routing Decision Engine</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {routingRules.map((r, i) => (
                <div key={r.rule} className="flex items-center gap-2">
                  <div className="text-center flex-1">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                      <span className="text-xs font-bold text-primary">{r.priority}</span>
                    </div>
                    <p className="text-[10px] font-medium">{r.rule}</p>
                  </div>
                  {i < routingRules.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Routed Orders */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Live Order Routing</h3>
          {routedOrders.map((o, i) => (
            <motion.div key={o.orderId} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{o.orderId}</p>
                        <Badge className={
                          o.status === "Routed" ? "bg-emerald-500/15 text-emerald-600" :
                          o.status === "Consolidated" ? "bg-blue-500/15 text-blue-600" :
                          "bg-amber-500/15 text-amber-600"
                        }>{o.status}</Badge>
                        <Badge variant="outline" className="text-[10px]">{o.confidence}% confidence</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{o.retailer} · {o.zone}</p>
                    </div>
                    <span className="font-bold">{o.value}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs bg-muted/30 rounded-lg p-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span>{o.retailer}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <Package className="w-3 h-3 text-blue-500" />
                    <span>{o.warehouse}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <Truck className="w-3 h-3 text-emerald-500" />
                    <span>{o.assignedDist}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>ETA {o.eta}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Routing Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                ORD-4821 and ORD-4823 consolidated on VI-Route-A — saving ₦45,000 in delivery costs. 
                ORD-4825 (Ajah) has lower confidence due to longer distance from Lekki Hub. 
                Consider establishing a sub-depot in Ajah to improve coverage and reduce ETAs.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorSmartOrderRouting;
