import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Megaphone, Target, BarChart3, Eye, Plus, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const campaigns = [
  { id: "CF-001", brand: "Diageo", campaign: "Johnnie Walker Summer Push", budget: 120000, spent: 84000, roi: 3.4, status: "active", reach: 1240, lift: 28 },
  { id: "CF-002", brand: "Pernod Ricard", campaign: "Jameson Bar Activation", budget: 60000, spent: 52000, roi: 2.9, status: "active", reach: 680, lift: 22 },
  { id: "CF-003", brand: "Bacardi", campaign: "Grey Goose Premium Club", budget: 80000, spent: 80000, roi: 4.1, status: "completed", reach: 420, lift: 35 },
  { id: "CF-004", brand: "LVMH", campaign: "Moët Holiday Collection", budget: 200000, spent: 45000, roi: null, status: "planned", reach: 0, lift: 0 },
];

const fundingByCategory = [
  { category: "Spirits", funding: 180000 },
  { category: "Wine", funding: 95000 },
  { category: "Beer", funding: 120000 },
  { category: "RTD", funding: 45000 },
  { category: "Premium", funding: 160000 },
];

const LiquorCampaignFunding = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Campaign Funding Engine</h1>
            <p className="text-sm text-muted-foreground">Supplier campaign budgets, retailer incentive programs & ROI tracking</p>
          </div>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> New Campaign</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Funding", value: "$460K", icon: DollarSign, color: "text-primary" },
          { label: "Active Campaigns", value: "2", icon: Megaphone, color: "text-emerald-500" },
          { label: "Avg ROI", value: "3.5x", icon: TrendingUp, color: "text-amber-500" },
          { label: "Retailers Reached", value: "2,340", icon: Target, color: "text-blue-500" },
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
          <CardHeader><CardTitle>Campaign Portfolio</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {campaigns.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{c.campaign}</p>
                    <Badge variant="outline">{c.brand}</Badge>
                    <Badge className={
                      c.status === "active" ? "bg-emerald-500/15 text-emerald-600" :
                      c.status === "completed" ? "bg-blue-500/15 text-blue-600" :
                      "bg-amber-500/15 text-amber-600"
                    }>{c.status}</Badge>
                  </div>
                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-4 gap-4 text-xs">
                  <div><span className="text-muted-foreground">Budget:</span> <span className="font-medium">${c.budget.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">Spent:</span> <span className="font-medium">${c.spent.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground">Reach:</span> <span className="font-medium">{c.reach.toLocaleString()} retailers</span></div>
                  <div><span className="text-muted-foreground">ROI:</span> <span className="font-medium">{c.roi ? `${c.roi}x` : "—"}</span></div>
                </div>
                {c.status !== "planned" && (
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${(c.spent / c.budget) * 100}%` }} />
                  </div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Funding by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={fundingByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip />
                <Bar dataKey="funding" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default LiquorCampaignFunding;
