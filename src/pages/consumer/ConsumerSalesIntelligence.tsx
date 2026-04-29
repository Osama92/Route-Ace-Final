import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Users, MapPin } from "lucide-react";

const reps = [
  { name: "Tunde Bakare", territory: "Lagos Mainland", sales: "₦18.4M", target: 92, outlets: 145, rank: 1 },
  { name: "Grace Okonkwo", territory: "Abuja Central", sales: "₦15.2M", target: 88, outlets: 120, rank: 2 },
  { name: "Yusuf Ahmed", territory: "Kano Metro", sales: "₦12.8M", target: 95, outlets: 98, rank: 3 },
  { name: "Blessing Eze", territory: "PH South", sales: "₦10.4M", target: 82, outlets: 85, rank: 4 },
];

const ConsumerSalesIntelligence = () => (
  <IndustryLayout industryCode="consumer">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <Target className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Sales Intelligence</h1>
          <p className="text-muted-foreground">Sales performance analytics and territory intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦56.8M</p><p className="text-xs text-muted-foreground">Total Sales MTD</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">89%</p><p className="text-xs text-muted-foreground">Target Achievement</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">448</p><p className="text-xs text-muted-foreground">Active Outlets</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">24</p><p className="text-xs text-muted-foreground">Sales Reps</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-teal-500" />Sales Rep Leaderboard</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reps.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">#{r.rank}</span>
                  <div><p className="font-semibold text-foreground">{r.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{r.territory} • {r.outlets} outlets</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">{r.sales}</span>
                  <Badge variant={r.target >= 90 ? "default" : "secondary"}>{r.target}% target</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default ConsumerSalesIntelligence;
