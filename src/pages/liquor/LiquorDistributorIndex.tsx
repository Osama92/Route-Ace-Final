import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, TrendingUp, DollarSign, ShieldCheck, MapPin, BarChart3,
  Wine, Star, AlertTriangle, Package, Clock,
} from "lucide-react";

const distributors = [
  { name: "Alpha Spirits Distribution", territory: "Lagos Island/VI", score: 94, revenue: "₦12.4M", cases: 4200, compliance: 99, payDays: 8, brands: 28, tier: "Platinum" },
  { name: "Metro Beverages Ltd", territory: "Lagos Mainland", score: 82, revenue: "₦8.6M", cases: 3100, compliance: 94, payDays: 14, brands: 22, tier: "Gold" },
  { name: "Premium Liquor Dist.", territory: "Abuja/FCT", score: 76, revenue: "₦6.2M", cases: 2200, compliance: 88, payDays: 18, brands: 18, tier: "Gold" },
  { name: "National Supply Co.", territory: "Port Harcourt", score: 68, revenue: "₦3.8M", cases: 1400, compliance: 82, payDays: 22, brands: 15, tier: "Silver" },
  { name: "Eastern Beverages", territory: "Enugu/SE", score: 58, revenue: "₦1.9M", cases: 700, compliance: 75, payDays: 28, brands: 12, tier: "Bronze" },
];

const tierColors = {
  Platinum: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Gold: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Silver: "bg-slate-400/15 text-slate-400 border-slate-400/30",
  Bronze: "bg-orange-500/15 text-orange-400 border-orange-500/30",
};

const LiquorDistributorIndex = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Distributor Index</h1>
          <p className="text-sm text-muted-foreground">Performance scoring, compliance tracking & territory mapping</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <Users className="w-5 h-5 mx-auto mb-1 text-rose-400" />
          <p className="text-xl font-bold">24</p>
          <p className="text-xs text-muted-foreground">Active Distributors</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-bold">₦32.9M</p>
          <p className="text-xs text-muted-foreground">Network Revenue MTD</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <Star className="w-5 h-5 mx-auto mb-1 text-amber-400" />
          <p className="text-xl font-bold">79</p>
          <p className="text-xs text-muted-foreground">Avg Performance Score</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <p className="text-xl font-bold">91%</p>
          <p className="text-xs text-muted-foreground">Avg Compliance</p>
        </CardContent></Card>
      </div>

      <div className="space-y-4">
        {distributors.map((d) => (
          <Card key={d.name} className="hover:border-rose-500/30 transition-colors cursor-pointer">
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                    <Wine className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{d.name}</p>
                      <Badge className={`text-xs ${tierColors[d.tier as keyof typeof tierColors]}`}>{d.tier}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground"><MapPin className="w-3 h-3 inline mr-1" />{d.territory} · {d.brands} brands</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold">{d.revenue}</p>
                    <p className="text-xs text-muted-foreground">{d.cases.toLocaleString()} cases</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Performance Score</p>
                  <Progress value={d.score} className="h-2" />
                  <p className="text-xs mt-1 font-medium">{d.score}/100</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Compliance</p>
                  <Progress value={d.compliance} className="h-2" />
                  <p className="text-xs mt-1 font-medium">{d.compliance}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Avg Pay Days</p>
                  <p className="text-lg font-bold">{d.payDays}d</p>
                </div>
                <div className="text-right">
                  <Badge variant={d.score >= 80 ? "default" : d.score >= 60 ? "secondary" : "destructive"}>
                    {d.score >= 80 ? "Top Performer" : d.score >= 60 ? "Needs Improvement" : "At Risk"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </IndustryLayout>
);

export default LiquorDistributorIndex;
