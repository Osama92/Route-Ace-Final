import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Tag, DollarSign, TrendingUp, Zap, Target, Users, BarChart3,
  Brain, Calendar, Package, ArrowRight,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const campaigns = [
  { name: "Hennessy Holiday Push", supplier: "Diageo Nigeria", type: "Volume Incentive", mechanic: "Buy 5 Get 1 Free", budget: "₦48M", spent: "₦32M", pctUsed: 67, salesLift: "+28%", roi: "3.2x", status: "Active", distributors: 18, retailers: 342, startDate: "Dec 1", endDate: "Mar 31" },
  { name: "Ciroc Summer Activation", supplier: "Diageo Nigeria", type: "Display Bonus", mechanic: "₦50K per display", budget: "₦12M", spent: "₦8.4M", pctUsed: 70, salesLift: "+42%", roi: "4.1x", status: "Active", distributors: 12, retailers: 186, startDate: "Jan 15", endDate: "Apr 30" },
  { name: "Heineken Cooler Program", supplier: "Nigerian Breweries", type: "Equipment", mechanic: "Free cooler on 50+ cases/mo", budget: "₦24M", spent: "₦18M", pctUsed: 75, salesLift: "+18%", roi: "2.8x", status: "Active", distributors: 24, retailers: 428, startDate: "Nov 1", endDate: "Apr 30" },
  { name: "Patrón Launch Promo", supplier: "Bacardi Africa", type: "Discount", mechanic: "15% off first 3 orders", budget: "₦6M", spent: "₦1.2M", pctUsed: 20, salesLift: "+124%", roi: "5.6x", status: "Active", distributors: 8, retailers: 64, startDate: "Feb 1", endDate: "May 31" },
  { name: "Moët Anniversary Edition", supplier: "Moët Hennessy", type: "Allocation", mechanic: "Exclusive retailer access", budget: "₦8M", spent: "₦8M", pctUsed: 100, salesLift: "+86%", roi: "6.2x", status: "Completed", distributors: 6, retailers: 42, startDate: "Dec 15", endDate: "Feb 28" },
];

const roiChart = campaigns.map(c => ({ name: c.name.split(" ")[0], roi: parseFloat(c.roi), lift: parseInt(c.salesLift) }));

const incentiveFlow = [
  { step: "Supplier Funds", desc: "Brand creates campaign budget", icon: DollarSign },
  { step: "Distributor Activates", desc: "Wholesalers opt in to program", icon: Users },
  { step: "Rep Executes", desc: "Field team deploys at outlets", icon: Target },
  { step: "Retailer Benefits", desc: "Outlets receive incentives", icon: Tag },
  { step: "ROI Tracked", desc: "Platform measures lift & ROI", icon: BarChart3 },
];

const LiquorTradePromotionExchange = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trade Promotion Exchange</h1>
            <p className="text-sm text-muted-foreground">Supplier-funded promotions distributed across the network with real-time ROI</p>
          </div>
          <Button><Zap className="w-4 h-4 mr-1" /> Create Campaign</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Campaigns", value: "28", icon: Tag, color: "text-primary" },
            { label: "Total Budget", value: "₦186M", icon: DollarSign, color: "text-emerald-500" },
            { label: "Avg Sales Lift", value: "+34%", icon: TrendingUp, color: "text-blue-500" },
            { label: "Avg ROI", value: "3.8x", icon: BarChart3, color: "text-amber-500" },
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

        {/* Incentive Flow */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Promotion Distribution Flow</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {incentiveFlow.map((s, i) => (
                <div key={s.step} className="flex items-center gap-2">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-1">
                      <s.icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs font-medium">{s.step}</p>
                    <p className="text-[10px] text-muted-foreground max-w-[100px]">{s.desc}</p>
                  </div>
                  {i < incentiveFlow.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
            <TabsTrigger value="roi">ROI Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-3">
            {campaigns.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{c.name}</p>
                          <Badge className={c.status === "Active" ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}>{c.status}</Badge>
                          <Badge variant="outline">{c.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.supplier} · {c.mechanic}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{c.roi}</p>
                        <p className="text-[10px] text-muted-foreground">ROI</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Progress value={c.pctUsed} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{c.pctUsed}%</span>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      <div className="text-center p-1.5 bg-muted/30 rounded"><span className="font-bold">{c.budget}</span><br /><span className="text-[10px] text-muted-foreground">Budget</span></div>
                      <div className="text-center p-1.5 bg-muted/30 rounded"><span className="font-bold">{c.salesLift}</span><br /><span className="text-[10px] text-muted-foreground">Sales Lift</span></div>
                      <div className="text-center p-1.5 bg-muted/30 rounded"><span className="font-bold">{c.distributors}</span><br /><span className="text-[10px] text-muted-foreground">Distributors</span></div>
                      <div className="text-center p-1.5 bg-muted/30 rounded"><span className="font-bold">{c.retailers}</span><br /><span className="text-[10px] text-muted-foreground">Retailers</span></div>
                      <div className="text-center p-1.5 bg-muted/30 rounded"><span className="font-bold">{c.startDate}</span><br /><span className="text-[10px] text-muted-foreground">Start</span></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="roi">
            <Card>
              <CardHeader><CardTitle className="text-sm">Campaign ROI Comparison</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={roiChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="roi" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="ROI (x)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Promotion Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                Patrón Launch Promo shows highest ROI (5.6x) with only 20% budget deployed. 
                Recommend doubling retailer targets for maximum impact. Display bonus mechanics 
                outperform volume discounts by 1.4x in on-premise channels.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorTradePromotionExchange;
