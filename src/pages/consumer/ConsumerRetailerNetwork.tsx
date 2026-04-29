import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Star, MapPin, TrendingUp } from "lucide-react";

const retailers = [
  { name: "MegaMart Superstore", location: "Ikeja", segment: "Modern Trade", orders: 342, spend: "₦45M", tier: "platinum" },
  { name: "Baba Tunde Shop", location: "Mushin", segment: "Traditional", orders: 890, spend: "₦8.2M", tier: "gold" },
  { name: "Fresh Corner", location: "Lekki", segment: "Convenience", orders: 245, spend: "₦12.4M", tier: "gold" },
  { name: "Iya Basira Store", location: "Ibadan", segment: "Traditional", orders: 1200, spend: "₦5.8M", tier: "silver" },
];

const ConsumerRetailerNetwork = () => (
  <IndustryLayout industryCode="consumer">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <Store className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Retailer Network Intelligence</h1>
          <p className="text-muted-foreground">Manage retailer relationships, segmentation, and ordering</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">4,280</p><p className="text-xs text-muted-foreground">Total Retailers</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">3,420</p><p className="text-xs text-muted-foreground">Active This Month</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦71.4M</p><p className="text-xs text-muted-foreground">Monthly Orders</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">82%</p><p className="text-xs text-muted-foreground">Retention Rate</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top Retailers</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {retailers.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{r.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location} • {r.segment} • {r.orders} orders</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{r.spend}</span>
                  <Badge variant={r.tier === "platinum" ? "default" : "secondary"}>{r.tier}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default ConsumerRetailerNetwork;
