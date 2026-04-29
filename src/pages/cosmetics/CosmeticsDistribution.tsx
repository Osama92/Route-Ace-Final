import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Route, MapPin } from "lucide-react";

const routes = [
  { name: "Lagos Island Circuit", stops: 24, deliveries: 18, onTime: "94%", revenue: "₦12.4M" },
  { name: "Abuja Premium Route", stops: 16, deliveries: 14, onTime: "88%", revenue: "₦8.7M" },
  { name: "PH Salon Network", stops: 12, deliveries: 10, onTime: "91%", revenue: "₦4.2M" },
  { name: "Ibadan Retail Belt", stops: 20, deliveries: 15, onTime: "85%", revenue: "₦6.1M" },
];

const CosmeticsDistribution = () => (
  <IndustryLayout industryCode="cosmetics">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Truck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Beauty Distribution</h1>
          <p className="text-muted-foreground">Manage product distribution to retail outlets and salons</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Route className="w-5 h-5 text-pink-500" />Distribution Routes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routes.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-medium text-foreground">{r.name}</p><p className="text-xs text-muted-foreground">{r.stops} stops • {r.deliveries} deliveries today</p></div>
                <div className="flex items-center gap-4"><span className="text-sm text-muted-foreground">On-time: {r.onTime}</span><span className="text-sm font-medium text-foreground">{r.revenue}</span></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default CosmeticsDistribution;
