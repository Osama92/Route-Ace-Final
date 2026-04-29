import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, TrendingUp, DollarSign } from "lucide-react";

const promotions = [
  { name: "Buy 3 Get 1 Free — Detergent", type: "Volume", roi: "280%", uplift: "+35%", status: "active", budget: "₦12M" },
  { name: "New SKU Launch Bundle", type: "Product Launch", roi: "420%", uplift: "+52%", status: "active", budget: "₦8M" },
  { name: "Retailer Loyalty Bonus", type: "Loyalty", roi: "180%", uplift: "+18%", status: "active", budget: "₦5M" },
  { name: "End of Quarter Push", type: "Sales Target", roi: "340%", uplift: "+42%", status: "scheduled", budget: "₦15M" },
];

const ConsumerTradePromo = () => (
  <IndustryLayout industryCode="consumer">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <Tag className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Trade Promotion Management</h1>
          <p className="text-muted-foreground">Manage promotions, track ROI, and measure sell-through</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">8</p><p className="text-xs text-muted-foreground">Active Promos</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">305%</p><p className="text-xs text-muted-foreground">Avg ROI</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦40M</p><p className="text-xs text-muted-foreground">Total Budget</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">+37%</p><p className="text-xs text-muted-foreground">Avg Uplift</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Promotions</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {promotions.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{p.name}</p><p className="text-xs text-muted-foreground">{p.type} • Budget: {p.budget}</p></div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">ROI: {p.roi}</Badge>
                  <Badge variant="secondary">{p.uplift}</Badge>
                  <Badge variant={p.status === "active" ? "default" : "outline"}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default ConsumerTradePromo;
