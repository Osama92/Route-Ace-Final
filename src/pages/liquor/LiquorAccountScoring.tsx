import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Target, TrendingUp, AlertTriangle, Star, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight } from "lucide-react";

const accounts = [
  { name: "Sky Lounge Bar", score: 92, tier: "Platinum", monthlySpend: 12400, reorderIn: 3, trend: "up", risk: "low" },
  { name: "The Grill House", score: 78, tier: "Gold", monthlySpend: 8200, reorderIn: 7, trend: "up", risk: "low" },
  { name: "Club Mirage", score: 85, tier: "Platinum", monthlySpend: 18600, reorderIn: 2, trend: "up", risk: "low" },
  { name: "Quick Mart Liquors", score: 54, tier: "Silver", monthlySpend: 3200, reorderIn: 12, trend: "down", risk: "medium" },
  { name: "Corner Liquors Express", score: 38, tier: "Bronze", monthlySpend: 1800, reorderIn: null, trend: "down", risk: "high" },
  { name: "Beerhugz Café", score: 71, tier: "Gold", monthlySpend: 6400, reorderIn: 5, trend: "stable", risk: "low" },
];

const scoreDistribution = [
  { range: "90-100", count: 42, label: "Platinum" },
  { range: "70-89", count: 128, label: "Gold" },
  { range: "50-69", count: 86, label: "Silver" },
  { range: "30-49", count: 34, label: "Bronze" },
  { range: "0-29", count: 12, label: "At Risk" },
];

const tierColors: Record<string, string> = {
  Platinum: "bg-violet-500/15 text-violet-600",
  Gold: "bg-amber-500/15 text-amber-600",
  Silver: "bg-slate-500/15 text-slate-600",
  Bronze: "bg-orange-500/15 text-orange-600",
};

const LiquorAccountScoring = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Account Scoring & Health</h1>
          <p className="text-sm text-muted-foreground">AI-powered retailer scoring, predicted reorders & upsell signals</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg Score", value: "74", icon: Target, color: "text-primary" },
          { label: "Platinum Accounts", value: "42", icon: Star, color: "text-violet-500" },
          { label: "At-Risk Accounts", value: "12", icon: AlertTriangle, color: "text-destructive" },
          { label: "Predicted Reorders (7d)", value: "86", icon: ShoppingCart, color: "text-emerald-500" },
        ].map((k) => (
          <Card key={k.label}><CardContent className="p-4 text-center">
            <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Account Health Overview</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {accounts.map((a, i) => (
              <motion.div key={a.name} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">{a.score}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{a.name}</p>
                      <Badge className={tierColors[a.tier]}>{a.tier}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ${a.monthlySpend.toLocaleString()}/mo · {a.reorderIn ? `Reorder in ${a.reorderIn}d` : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.trend === "up" && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                  {a.trend === "down" && <ArrowDownRight className="w-4 h-4 text-destructive" />}
                  <Badge variant="outline" className={a.risk === "high" ? "text-destructive" : a.risk === "medium" ? "text-amber-500" : "text-emerald-500"}>
                    {a.risk} risk
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Score Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="range" tick={{ fontSize: 11 }} width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default LiquorAccountScoring;
