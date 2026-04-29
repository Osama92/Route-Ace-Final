import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BarChart3, Target, Users, MapPin, Brain, TrendingUp, TrendingDown,
  Wine, Search, Filter, ArrowUpRight,
} from "lucide-react";

const territories = [
  { name: "Lagos Island", revenue: "₦8.2M", growth: 23, reps: 12, outlets: 345, onPremise: 180, offPremise: 165, topBrand: "Hennessy" },
  { name: "Lagos Mainland", revenue: "₦6.8M", growth: 12, reps: 10, outlets: 298, onPremise: 120, offPremise: 178, topBrand: "Smirnoff" },
  { name: "Abuja Central", revenue: "₦5.1M", growth: -4, reps: 8, outlets: 256, onPremise: 140, offPremise: 116, topBrand: "Johnnie Walker" },
  { name: "Port Harcourt", revenue: "₦3.4M", growth: 18, reps: 6, outlets: 182, onPremise: 95, offPremise: 87, topBrand: "Baileys" },
  { name: "Kano Metro", revenue: "₦1.6M", growth: 7, reps: 4, outlets: 134, onPremise: 45, offPremise: 89, topBrand: "Guinness" },
];

const tradeReps = [
  { name: "Chioma A.", territory: "Lagos Island", cases: 420, target: 500, compliance: 97, visits: 38, accounts: 45 },
  { name: "Emmanuel O.", territory: "Lagos Mainland", cases: 380, target: 400, compliance: 94, visits: 35, accounts: 42 },
  { name: "Fatimah B.", territory: "Abuja Central", cases: 310, target: 350, compliance: 91, visits: 30, accounts: 38 },
  { name: "Daniel K.", territory: "Port Harcourt", cases: 280, target: 300, compliance: 96, visits: 28, accounts: 32 },
];

const aiRecommendations = [
  { action: "Premium Upsell", detail: "18 bars in VI showing whisky premium mix shift — allocate Johnnie Walker Blue", priority: "high" },
  { action: "Channel Shift", detail: "Off-premise gin sales up 42% — reallocate 3 reps from on-premise", priority: "medium" },
  { action: "Account Rescue", detail: "7 high-value bars reduced orders by 60% — trigger win-back campaign", priority: "high" },
];

const LiquorSalesIntelligence = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Sales Intelligence</h1>
            <p className="text-sm text-muted-foreground">Trade rep performance & territory analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search territories..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter</Button>
        </div>
      </div>

      <Tabs defaultValue="territories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="territories">Territory Performance</TabsTrigger>
          <TabsTrigger value="reps">Trade Rep Scorecard</TabsTrigger>
          <TabsTrigger value="channels">Channel Analysis</TabsTrigger>
          <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="territories" className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <Card><CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">₦25.1M</p>
              <p className="text-xs text-muted-foreground">Total Revenue MTD</p>
            </CardContent></Card>
            <Card><CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">1,215</p>
              <p className="text-xs text-muted-foreground">Accounts Visited</p>
            </CardContent></Card>
            <Card><CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">89%</p>
              <p className="text-xs text-muted-foreground">Target Achievement</p>
            </CardContent></Card>
            <Card><CardContent className="pt-5 text-center">
              <p className="text-2xl font-bold">3.8</p>
              <p className="text-xs text-muted-foreground">Avg Cases/Visit</p>
            </CardContent></Card>
          </div>

          {territories.map((t) => (
            <Card key={t.name} className="hover:border-rose-500/30 transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-rose-400" />
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.reps} reps · {t.outlets} accounts · Top: {t.topBrand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold">{t.revenue}</p>
                      <p className="text-xs text-muted-foreground">On: {t.onPremise} · Off: {t.offPremise}</p>
                    </div>
                    <Badge className={t.growth > 0 ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-destructive/15 text-destructive border-destructive/30"}>
                      {t.growth > 0 ? "+" : ""}{t.growth}%
                    </Badge>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reps" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {tradeReps.map((rep) => (
              <Card key={rep.name}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-semibold">{rep.name}</p>
                        <p className="text-xs text-muted-foreground">{rep.territory} · {rep.accounts} accounts</p>
                      </div>
                    </div>
                    <Badge variant="outline">{rep.compliance}% compliance</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Cases vs Target</p>
                      <Progress value={(rep.cases / rep.target) * 100} className="h-2" />
                      <p className="text-xs mt-1">{rep.cases}/{rep.target}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Visits</p>
                      <p className="text-lg font-bold">{rep.visits}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Achievement</p>
                      <p className="text-lg font-bold">{Math.round((rep.cases / rep.target) * 100)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <Card className="border-rose-500/20">
              <CardHeader><CardTitle className="text-rose-400">On-Premise Channel</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: "Bars & Nightclubs", pct: 42, cases: "3,240" },
                  { type: "Restaurants", pct: 28, cases: "2,180" },
                  { type: "Hotels", pct: 18, cases: "1,420" },
                  { type: "Event Venues", pct: 12, cases: "940" },
                ].map((ch) => (
                  <div key={ch.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{ch.type}</span>
                      <span className="text-muted-foreground">{ch.cases} cases</span>
                    </div>
                    <Progress value={ch.pct} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-amber-500/20">
              <CardHeader><CardTitle className="text-amber-400">Off-Premise Channel</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: "Liquor Stores", pct: 48, cases: "4,120" },
                  { type: "Supermarkets", pct: 27, cases: "2,340" },
                  { type: "Convenience Stores", pct: 15, cases: "1,280" },
                  { type: "Wholesale", pct: 10, cases: "960" },
                ].map((ch) => (
                  <div key={ch.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{ch.type}</span>
                      <span className="text-muted-foreground">{ch.cases} cases</span>
                    </div>
                    <Progress value={ch.pct} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          {aiRecommendations.map((rec) => (
            <Card key={rec.action} className={rec.priority === "high" ? "border-rose-500/30 bg-rose-500/5" : "border-amber-500/30 bg-amber-500/5"}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 mt-0.5 text-rose-400" />
                    <div>
                      <p className="font-semibold text-sm">{rec.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rec.detail}</p>
                    </div>
                  </div>
                  <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>{rec.priority}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorSalesIntelligence;
