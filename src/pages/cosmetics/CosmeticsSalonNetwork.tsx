import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, Star, MapPin } from "lucide-react";

const salons = [
  { name: "Tara's Beauty Lounge", location: "Victoria Island", rating: 4.9, orders: 145, spend: "₦8.2M", tier: "platinum" },
  { name: "Kiki's Hair Studio", location: "Ikeja", rating: 4.7, orders: 98, spend: "₦5.4M", tier: "gold" },
  { name: "Glow Up Salon", location: "Lekki", rating: 4.5, orders: 67, spend: "₦3.1M", tier: "silver" },
  { name: "Natural Queens", location: "Yaba", rating: 4.3, orders: 42, spend: "₦1.8M", tier: "bronze" },
];

const CosmeticsSalonNetwork = () => (
  <IndustryLayout industryCode="cosmetics">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Store className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Salon Partner Network</h1>
          <p className="text-muted-foreground">Manage salon partnerships and product distribution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">284</p><p className="text-xs text-muted-foreground">Partner Salons</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦124M</p><p className="text-xs text-muted-foreground">Channel Revenue</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">4.6</p><p className="text-xs text-muted-foreground">Avg Rating</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">89%</p><p className="text-xs text-muted-foreground">Retention</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top Salon Partners</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {salons.map((s) => (
              <div key={s.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{s.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{s.location} • {s.orders} orders</p></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1"><Star className="w-4 h-4 text-pink-400 fill-pink-400" /><span className="text-sm text-foreground">{s.rating}</span></div>
                  <span className="text-sm text-muted-foreground">{s.spend}</span>
                  <Badge variant={s.tier === "platinum" ? "default" : "secondary"}>{s.tier}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default CosmeticsSalonNetwork;
