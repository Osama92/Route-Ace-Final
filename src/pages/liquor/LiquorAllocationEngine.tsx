import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Package, Star, Award, Users, TrendingUp, Lock, Zap, Brain,
  Wine, MapPin, BarChart3, Clock,
} from "lucide-react";

const allocations = [
  { product: "Macallan 18yr Single Malt", category: "Scotch", totalCases: 120, allocated: 108, remaining: 12, distributors: 6, retailers: 42, releaseDate: "Mar 15, 2026", status: "Active", tier: "Ultra Premium" },
  { product: "Clase Azul Reposado", category: "Tequila", totalCases: 48, allocated: 48, remaining: 0, distributors: 3, retailers: 18, releaseDate: "Feb 20, 2026", status: "Fully Allocated", tier: "Ultra Premium" },
  { product: "Dom Pérignon Vintage 2015", category: "Champagne", totalCases: 200, allocated: 164, remaining: 36, distributors: 4, retailers: 56, releaseDate: "Mar 1, 2026", status: "Active", tier: "Prestige" },
  { product: "Hennessy Paradis", category: "Cognac", totalCases: 36, allocated: 24, remaining: 12, distributors: 2, retailers: 12, releaseDate: "Apr 1, 2026", status: "Pre-Release", tier: "Ultra Premium" },
  { product: "Hibiki Harmony", category: "Japanese Whisky", totalCases: 84, allocated: 72, remaining: 12, distributors: 5, retailers: 32, releaseDate: "Mar 10, 2026", status: "Active", tier: "Premium" },
];

const distributorAllocation = [
  { distributor: "PrimeBev Distributors", score: 96, allocatedCases: 42, territory: "VI / Ikoyi", topRetailers: 18 },
  { distributor: "Lagos Spirits Co.", score: 88, allocatedCases: 28, territory: "Lekki / Ajah", topRetailers: 12 },
  { distributor: "Peninsula Wines", score: 92, allocatedCases: 24, territory: "Ikoyi (Wine)", topRetailers: 8 },
  { distributor: "NorthCity Beverages", score: 79, allocatedCases: 14, territory: "Ikeja / Ogba", topRetailers: 6 },
];

const allocationCriteria = [
  { factor: "Historical Sales Performance", weight: 35 },
  { factor: "Retailer Tier (Platinum/Gold)", weight: 25 },
  { factor: "Territory Demand Score", weight: 20 },
  { factor: "Payment Reliability", weight: 12 },
  { factor: "Brand Compliance Score", weight: 8 },
];

const LiquorAllocationEngine = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Allocation Engine</h1>
            <p className="text-sm text-muted-foreground">AI-managed distribution of premium and limited-release products</p>
          </div>
          <Button><Lock className="w-4 h-4 mr-1" /> Create Allocation</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Allocations", value: "14", icon: Package, color: "text-primary" },
            { label: "Cases Allocated", value: "2,840", icon: Award, color: "text-emerald-500" },
            { label: "Qualified Retailers", value: "186", icon: Star, color: "text-amber-500" },
            { label: "Sell-Through Rate", value: "94%", icon: TrendingUp, color: "text-blue-500" },
          ].map(k => (
            <Card key={k.label}>
              <CardContent className="p-3 text-center">
                <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="releases" className="space-y-4">
          <TabsList>
            <TabsTrigger value="releases">Active Releases</TabsTrigger>
            <TabsTrigger value="distributors">Distributor Allocation</TabsTrigger>
            <TabsTrigger value="criteria">Allocation Criteria</TabsTrigger>
          </TabsList>

          <TabsContent value="releases" className="space-y-3">
            {allocations.map((a, i) => (
              <motion.div key={a.product} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{a.product}</p>
                          <Badge className={a.tier === "Ultra Premium" ? "bg-purple-500/15 text-purple-600" : "bg-amber-500/15 text-amber-600"}>{a.tier}</Badge>
                          <Badge className={
                            a.status === "Fully Allocated" ? "bg-muted text-muted-foreground" :
                            a.status === "Pre-Release" ? "bg-blue-500/15 text-blue-600" :
                            "bg-emerald-500/15 text-emerald-600"
                          }>{a.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.category} · Release: {a.releaseDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{a.remaining}</p>
                        <p className="text-[10px] text-muted-foreground">cases remaining</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Progress value={(a.allocated / a.totalCases) * 100} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{a.allocated}/{a.totalCases}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-1.5 bg-muted/30 rounded"><span className="font-bold">{a.distributors}</span><br /><span className="text-[10px] text-muted-foreground">Distributors</span></div>
                      <div className="text-center p-1.5 bg-muted/30 rounded"><span className="font-bold">{a.retailers}</span><br /><span className="text-[10px] text-muted-foreground">Retailers</span></div>
                      <div className="text-center p-1.5 bg-muted/30 rounded"><span className="font-bold">{Math.round((a.allocated / a.totalCases) * 100)}%</span><br /><span className="text-[10px] text-muted-foreground">Allocated</span></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="distributors" className="space-y-3">
            {distributorAllocation.map((d, i) => (
              <motion.div key={d.distributor} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-sm text-primary">{d.score}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{d.distributor}</p>
                        <p className="text-xs text-muted-foreground">{d.territory} · {d.topRetailers} top retailers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{d.allocatedCases} cases</p>
                      <p className="text-[10px] text-muted-foreground">allocated this quarter</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="criteria">
            <Card>
              <CardHeader><CardTitle className="text-sm">AI Allocation Scoring Model</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {allocationCriteria.map(c => (
                  <div key={c.factor} className="flex items-center gap-3">
                    <span className="text-sm w-[240px]">{c.factor}</span>
                    <Progress value={c.weight * 2.5} className="flex-1 h-2" />
                    <span className="text-sm font-bold w-10 text-right">{c.weight}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Allocation Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                Hennessy Paradis pre-release has 12 cases remaining — 8 qualified retailers competing. 
                AI recommends allocation to 4 Platinum-tier cocktail bars based on Hennessy VS sell-through 
                velocity and premium spirits category growth.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorAllocationEngine;
