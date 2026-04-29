import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Store, Truck, Wine, MapPin, Package, Users, ArrowRight } from "lucide-react";

const graphNodes = [
  { type: "Retailers", count: 5012, icon: Store, color: "text-blue-500", active: 4280 },
  { type: "Distributors", count: 186, icon: Truck, color: "text-emerald-500", active: 172 },
  { type: "Suppliers", count: 42, icon: Wine, color: "text-purple-500", active: 38 },
  { type: "Products", count: 8420, icon: Package, color: "text-amber-500", active: 6890 },
  { type: "Cities", count: 28, icon: MapPin, color: "text-rose-500", active: 28 },
  { type: "Consumers", count: "124K", icon: Users, color: "text-cyan-500", active: "89K" },
];

const topEdges = [
  { from: "ShopRite Lagos", to: "Diageo Nigeria", type: "Order", volume: "₦4.2M/mo", strength: 96 },
  { from: "Bar Central Abuja", to: "Metro Distributors", type: "Delivery", volume: "42 cases/wk", strength: 88 },
  { from: "Hennessy VS", to: "Lagos Nightlife", type: "Demand Signal", volume: "+34% MoM", strength: 91 },
  { from: "Jameson", to: "Abuja Restaurant Circuit", type: "Promotion", volume: "2x lift", strength: 85 },
  { from: "Craft Beer Co", to: "PH Bar Cluster", type: "Adoption", volume: "18 new bars", strength: 78 },
];

const clusterInsights = [
  { cluster: "Lagos Island Premium", retailers: 142, avgOrder: "₦680K", topBrand: "Hennessy", growth: "+22%" },
  { cluster: "Abuja CBD Nightlife", retailers: 86, avgOrder: "₦420K", topBrand: "Johnnie Walker", growth: "+18%" },
  { cluster: "PH Waterfront Bars", retailers: 54, avgOrder: "₦310K", topBrand: "Smirnoff", growth: "+28%" },
  { cluster: "Ibadan University Circuit", retailers: 38, avgOrder: "₦180K", topBrand: "Star Lager", growth: "+12%" },
];

const LiquorNetworkGraph = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Share2 className="w-6 h-6 text-primary" /> Network Intelligence Graph
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Connected commerce graph — mapping every participant, edge, and demand signal</p>
        </div>
        <Badge variant="outline" className="text-xs">Live Graph • {new Date().toLocaleDateString()}</Badge>
      </div>

      {/* Graph Nodes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {graphNodes.map((node) => (
          <Card key={node.type} className="text-center">
            <CardContent className="p-4">
              <node.icon className={`w-8 h-8 mx-auto mb-2 ${node.color}`} />
              <p className="text-2xl font-bold text-foreground">{node.count}</p>
              <p className="text-xs text-muted-foreground">{node.type}</p>
              <p className="text-[10px] text-emerald-500 mt-1">{node.active} active</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Relationship Edges */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Strongest Network Edges</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topEdges.map((edge, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-foreground">{edge.from}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    <span className="font-medium text-foreground">{edge.to}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">{edge.type}</Badge>
                      <span className="text-xs text-muted-foreground">{edge.volume}</span>
                    </div>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${edge.strength}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cluster Intelligence */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Territory Clusters</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clusterInsights.map((c, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">{c.cluster}</span>
                    <span className="text-xs text-emerald-500 font-semibold">{c.growth}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Retailers</span><p className="font-semibold text-foreground">{c.retailers}</p></div>
                    <div><span className="text-muted-foreground">Avg Order</span><p className="font-semibold text-foreground">{c.avgOrder}</p></div>
                    <div><span className="text-muted-foreground">Top Brand</span><p className="font-semibold text-foreground">{c.topBrand}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default LiquorNetworkGraph;
