import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Heart, Gift, Star, TrendingUp, ShoppingCart, Zap, Trophy, ArrowUpRight } from "lucide-react";

const loyaltyTiers = [
  { name: "Diamond", members: 28, color: "hsl(var(--primary))" },
  { name: "Gold", members: 142, color: "hsl(var(--chart-2))" },
  { name: "Silver", members: 480, color: "hsl(var(--chart-3))" },
  { name: "Bronze", members: 1200, color: "hsl(var(--chart-4))" },
];

const topLoyalMembers = [
  { name: "Sky Lounge Bar", tier: "Diamond", points: 48200, lifetimeSpend: 284000, memberSince: "Jan 2024" },
  { name: "Club Mirage", tier: "Diamond", points: 42800, lifetimeSpend: 256000, memberSince: "Mar 2024" },
  { name: "Metro Wine Bar", tier: "Gold", points: 28400, lifetimeSpend: 168000, memberSince: "Jun 2024" },
  { name: "The Grill House", tier: "Gold", points: 22100, lifetimeSpend: 132000, memberSince: "Feb 2024" },
];

const activeRewards = [
  { reward: "Free Case — Hennessy VS", pointsCost: 5000, redeemed: 42, available: true },
  { reward: "15% off next 10-case order", pointsCost: 2000, redeemed: 128, available: true },
  { reward: "VIP Brand Tasting Event", pointsCost: 8000, redeemed: 12, available: true },
  { reward: "Exclusive Limited Release Access", pointsCost: 12000, redeemed: 6, available: true },
];

const tierColors: Record<string, string> = {
  Diamond: "bg-violet-500/15 text-violet-600",
  Gold: "bg-amber-500/15 text-amber-600",
  Silver: "bg-slate-500/15 text-slate-600",
  Bronze: "bg-orange-500/15 text-orange-600",
};

const LiquorRetailerLoyalty = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-600">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Retailer Loyalty Program</h1>
          <p className="text-sm text-muted-foreground">Points, tiers, rewards & retention intelligence</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Members", value: "1,850", icon: Heart, color: "text-rose-500" },
          { label: "Points Issued (Mo)", value: "284K", icon: Star, color: "text-amber-500" },
          { label: "Rewards Redeemed", value: "188", icon: Gift, color: "text-emerald-500" },
          { label: "Retention Rate", value: "94%", icon: TrendingUp, color: "text-primary" },
        ].map((k) => (
          <Card key={k.label}><CardContent className="p-4 text-center">
            <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Tier Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={loyaltyTiers} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="members" paddingAngle={3}>
                  {loyaltyTiers.map((t) => <Cell key={t.name} fill={t.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center">
              {loyaltyTiers.map((t) => (
                <Badge key={t.name} variant="outline">{t.name}: {t.members}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" />Top Loyalty Members</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {topLoyalMembers.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">#{i + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{m.name}</p>
                      <Badge className={tierColors[m.tier]}>{m.tier}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{m.points.toLocaleString()} pts · ${m.lifetimeSpend.toLocaleString()} lifetime · Since {m.memberSince}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Gift className="w-5 h-5" />Active Rewards Catalog</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activeRewards.map((r, i) => (
            <motion.div key={r.reward} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="p-4 border rounded-lg flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-sm">{r.reward}</p>
                <p className="text-xs text-muted-foreground">{r.pointsCost.toLocaleString()} points · {r.redeemed} redeemed</p>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorRetailerLoyalty;
