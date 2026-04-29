import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Building2, ShieldCheck, AlertTriangle, CheckCircle, XCircle, FileText,
  MapPin, BarChart3, TrendingUp, Eye, Download, Users,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const salesByRegion = [
  { region: "Lagos", volume: 42800, retailers: 1240 },
  { region: "Abuja", volume: 18900, retailers: 680 },
  { region: "Port Harcourt", volume: 12400, retailers: 410 },
  { region: "Kano", volume: 8200, retailers: 280 },
  { region: "Ibadan", volume: 6900, retailers: 320 },
];

const monthlyTrend = [
  { month: "Jan", sales: 72000, violations: 8 },
  { month: "Feb", sales: 78000, violations: 5 },
  { month: "Mar", sales: 85000, violations: 12 },
  { month: "Apr", sales: 82000, violations: 6 },
  { month: "May", sales: 91000, violations: 3 },
  { month: "Jun", sales: 96000, violations: 4 },
];

const complianceViolations = [
  { id: "VIO-001", retailer: "Corner Liquors Express", type: "Expired License", severity: "Critical", date: "Mar 6, 2026", status: "Open" },
  { id: "VIO-002", retailer: "Nite Owl Lounge", type: "After-Hours Sale", severity: "High", date: "Mar 5, 2026", status: "Under Review" },
  { id: "VIO-003", retailer: "Quick Mart Liquors", type: "Underage Sale Attempt", severity: "Critical", date: "Mar 4, 2026", status: "Escalated" },
  { id: "VIO-004", retailer: "The Grill House", type: "Missing Tax Certificate", severity: "Medium", date: "Mar 3, 2026", status: "Resolved" },
];

const licensedRetailers = [
  { name: "Sky Lounge Bar", license: "OPL-2024-1247", type: "On-Premise", expiry: "Jun 30, 2026", status: "Valid", salesVolume: 4200 },
  { name: "PrimeBev Distributors", license: "WHL-2024-0842", type: "Wholesale", expiry: "Dec 31, 2026", status: "Valid", salesVolume: 28400 },
  { name: "Corner Liquors Express", license: "FPL-2023-1892", type: "Off-Premise", expiry: "Mar 20, 2026", status: "Expiring", salesVolume: 1800 },
  { name: "Metro Wines & Spirits", license: "FPL-2024-0568", type: "Off-Premise", expiry: "Apr 15, 2026", status: "Valid", salesVolume: 3200 },
];

const underagePrevention = [
  { month: "Jan", blocked: 12, verified: 4200 },
  { month: "Feb", blocked: 8, verified: 4800 },
  { month: "Mar", blocked: 15, verified: 5100 },
  { month: "Apr", blocked: 6, verified: 5400 },
  { month: "May", blocked: 4, verified: 5900 },
  { month: "Jun", blocked: 3, verified: 6200 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const LiquorGovernmentDashboard = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Government Regulatory Dashboard</h1>
            <p className="text-sm text-muted-foreground">Licensed retailers, sales activity & compliance oversight</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export Report</Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Licensed Retailers", value: "4,218", icon: ShieldCheck, color: "text-emerald-500" },
          { label: "Total Sales (Yr)", value: "₦8.4B", icon: TrendingUp, color: "text-primary" },
          { label: "Active Violations", value: "3", icon: AlertTriangle, color: "text-destructive" },
          { label: "Underage Blocks", value: "48", icon: XCircle, color: "text-rose-500" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4 text-center">
              <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Sales Overview</TabsTrigger>
          <TabsTrigger value="retailers">Licensed Retailers</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="underage">Underage Prevention</TabsTrigger>
        </TabsList>

        {/* Sales Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Sales by Region</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={salesByRegion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />Monthly Sales & Violations</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Licensed Retailers */}
        <TabsContent value="retailers" className="space-y-2">
          {licensedRetailers.map((r, i) => (
            <motion.div key={r.license} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="hover:border-primary/30 transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{r.name}</p>
                      <Badge variant="outline" className="text-[10px]">{r.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{r.license} · Expires: {r.expiry} · Sales Vol: {r.salesVolume.toLocaleString()} cases</p>
                  </div>
                  <Badge className={r.status === "Valid" ? "bg-emerald-500/15 text-emerald-600" : "bg-rose-500/15 text-rose-600"}>
                    {r.status}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Violations */}
        <TabsContent value="violations" className="space-y-2">
          {complianceViolations.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`border-l-4 ${v.severity === "Critical" ? "border-l-destructive" : v.severity === "High" ? "border-l-amber-500" : "border-l-blue-500"}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`w-4 h-4 ${v.severity === "Critical" ? "text-destructive" : "text-amber-500"}`} />
                      <span className="font-semibold text-sm">{v.id}</span>
                      <Badge className={
                        v.severity === "Critical" ? "bg-destructive/15 text-destructive" :
                        v.severity === "High" ? "bg-amber-500/15 text-amber-600" :
                        "bg-blue-500/15 text-blue-600"
                      }>{v.severity}</Badge>
                    </div>
                    <Badge variant="outline">{v.status}</Badge>
                  </div>
                  <p className="text-sm">{v.type}</p>
                  <p className="text-xs text-muted-foreground">Retailer: {v.retailer} · {v.date}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Underage Prevention */}
        <TabsContent value="underage">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Underage Sale Prevention Logs</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={underagePrevention}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="verified" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Verified" />
                  <Bar dataKey="blocked" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Blocked" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-xs font-semibold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-destructive" /> All blocked transactions are permanently logged and available for regulatory audit.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorGovernmentDashboard;
