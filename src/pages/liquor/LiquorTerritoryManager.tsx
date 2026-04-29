import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, Users, Target, TrendingUp, Zap, Eye, Plus } from "lucide-react";

const territories = [
  { name: "Lagos Island", reps: 4, retailers: 320, coverage: 92, revenue: 4200000, growth: 18 },
  { name: "Lagos Mainland", reps: 6, retailers: 480, coverage: 78, revenue: 3800000, growth: 12 },
  { name: "Victoria Island", reps: 3, retailers: 180, coverage: 95, revenue: 5600000, growth: 24 },
  { name: "Ikeja / Surulere", reps: 5, retailers: 420, coverage: 84, revenue: 2900000, growth: 8 },
  { name: "Abuja Central", reps: 3, retailers: 240, coverage: 88, revenue: 3200000, growth: 15 },
  { name: "Port Harcourt", reps: 2, retailers: 160, coverage: 72, revenue: 1800000, growth: 6 },
];

const territoryRevenue = territories.map((t) => ({ name: t.name, revenue: t.revenue / 1000000 }));

const repAssignments = [
  { rep: "Adebayo K.", territory: "Lagos Island", accounts: 80, visitRate: 94, monthlyRevenue: 1200000 },
  { rep: "Emeka O.", territory: "Lagos Mainland", accounts: 88, visitRate: 82, monthlyRevenue: 680000 },
  { rep: "Chidinma E.", territory: "Victoria Island", accounts: 60, visitRate: 98, monthlyRevenue: 1800000 },
  { rep: "Kunle B.", territory: "Ikeja / Surulere", accounts: 84, visitRate: 76, monthlyRevenue: 580000 },
  { rep: "Femi A.", territory: "Abuja Central", accounts: 80, visitRate: 88, monthlyRevenue: 1100000 },
];

const LiquorTerritoryManager = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Territory Management</h1>
            <p className="text-sm text-muted-foreground">Territory planning, rep assignment & coverage analytics</p>
          </div>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> New Territory</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Territories", value: "6", icon: MapPin, color: "text-primary" },
          { label: "Active Reps", value: "23", icon: Users, color: "text-blue-500" },
          { label: "Avg Coverage", value: "85%", icon: Target, color: "text-emerald-500" },
          { label: "Revenue Growth", value: "+14%", icon: TrendingUp, color: "text-amber-500" },
        ].map((k) => (
          <Card key={k.label}><CardContent className="p-4 text-center">
            <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Territory Revenue (₦M)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={territoryRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={110} />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Territory Overview</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {territories.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.reps} reps · {t.retailers} retailers</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${t.coverage}%` }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right">{t.coverage}%</p>
                  </div>
                  <Badge className="bg-emerald-500/15 text-emerald-600">+{t.growth}%</Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Rep Assignments</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {repAssignments.map((r, i) => (
            <motion.div key={r.rep} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{r.rep}</p>
                <p className="text-xs text-muted-foreground">{r.territory} · {r.accounts} accounts · {r.visitRate}% visit rate</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold">₦{(r.monthlyRevenue / 1000000).toFixed(1)}M</p>
                <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorTerritoryManager;
