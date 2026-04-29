import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, ArrowUpRight, Star, MapPin, ShoppingCart } from "lucide-react";

const growthRetailers = [
  { name: "Sky Lounge Victoria Island", city: "Lagos", growthScore: 96, orderGrowth: "+42%", skuDiversity: 38, creditUsage: "52%", monthlyVolume: "₦2.8M", segment: "Premium Nightlife" },
  { name: "The Grill House Lekki", city: "Lagos", growthScore: 91, orderGrowth: "+38%", skuDiversity: 28, creditUsage: "34%", monthlyVolume: "₦1.9M", segment: "Restaurant" },
  { name: "Club Vibe Abuja", city: "Abuja", growthScore: 88, orderGrowth: "+32%", skuDiversity: 42, creditUsage: "68%", monthlyVolume: "₦3.2M", segment: "Nightclub" },
  { name: "Ocean Bar PH", city: "Port Harcourt", growthScore: 85, orderGrowth: "+28%", skuDiversity: 22, creditUsage: "45%", monthlyVolume: "₦1.4M", segment: "Bar" },
  { name: "Mama's Kitchen Ibadan", city: "Ibadan", growthScore: 82, orderGrowth: "+52%", skuDiversity: 12, creditUsage: "20%", monthlyVolume: "₦420K", segment: "Restaurant" },
  { name: "Craft Corner Lekki", city: "Lagos", growthScore: 79, orderGrowth: "+64%", skuDiversity: 18, creditUsage: "15%", monthlyVolume: "₦680K", segment: "Craft Bar" },
];

const segmentGrowth = [
  { segment: "Premium Nightlife", count: 42, avgGrowth: "+34%", topCity: "Lagos" },
  { segment: "Craft Bars", count: 28, avgGrowth: "+52%", topCity: "Lagos" },
  { segment: "Restaurants", count: 186, avgGrowth: "+22%", topCity: "Abuja" },
  { segment: "Hotels", count: 34, avgGrowth: "+18%", topCity: "Lagos" },
];

const LiquorRetailerGrowth = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-500" /> Retailer Growth Prediction
        </h2>
        <p className="text-sm text-muted-foreground mt-1">AI-identified high-growth retailers poised for order increases</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {segmentGrowth.map((s) => (
          <Card key={s.segment}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.segment}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{s.count}</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                <span className="text-xs text-emerald-500">{s.avgGrowth}</span>
                <span className="text-[10px] text-muted-foreground ml-1">Top: {s.topCity}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Star className="w-4 h-4" /> High-Growth Retailer Rankings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {growthRetailers.map((r, i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{r.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px]"><MapPin className="w-2.5 h-2.5 mr-1" />{r.city}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{r.segment}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{r.growthScore}</p>
                    <p className="text-[10px] text-muted-foreground">Growth Score</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div><span className="text-muted-foreground">Order Growth</span><p className="font-semibold text-emerald-500">{r.orderGrowth}</p></div>
                  <div><span className="text-muted-foreground">SKU Diversity</span><p className="font-semibold text-foreground">{r.skuDiversity}</p></div>
                  <div><span className="text-muted-foreground">Credit Usage</span><p className="font-semibold text-foreground">{r.creditUsage}</p></div>
                  <div><span className="text-muted-foreground">Monthly Vol</span><p className="font-semibold text-foreground">{r.monthlyVolume}</p></div>
                </div>
                <Progress value={r.growthScore} className="h-1.5 mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorRetailerGrowth;
