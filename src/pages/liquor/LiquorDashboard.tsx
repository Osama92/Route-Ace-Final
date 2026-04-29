import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLiquorRole, LIQUOR_ROLE_LABELS } from "@/hooks/useLiquorRole";
import { getDefaultRouteForRole, getOrgTypeFromRole } from "@/lib/liquorPermissions";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wine, TrendingUp, TrendingDown, DollarSign, Package, Users, MapPin,
  AlertTriangle, Brain, ShieldAlert, Activity, Target, Zap, Truck,
  BarChart3, ShieldCheck, Clock, Percent,
} from "lucide-react";

// ── Distributor executive KPIs ──
const distKpis = [
  { label: "Revenue MTD", value: "₦42.6M", change: 14.2, icon: DollarSign, color: "text-emerald-500" },
  { label: "Cases Sold", value: "12,840", change: 8.7, icon: Package, color: "text-blue-500" },
  { label: "Active Trade Reps", value: "64", change: 3.1, icon: Users, color: "text-violet-500" },
  { label: "Accounts Covered", value: "1,892", change: 5.2, icon: MapPin, color: "text-amber-500" },
  { label: "On-Premise Revenue", value: "₦18.3M", change: 11.4, icon: Wine, color: "text-rose-500" },
  { label: "Off-Premise Revenue", value: "₦24.3M", change: 16.1, icon: Package, color: "text-teal-500" },
  { label: "Excise Compliance", value: "98.2%", change: 0.4, icon: ShieldCheck, color: "text-indigo-500" },
  { label: "Gross Margin", value: "34.2%", change: -0.8, icon: Percent, color: "text-orange-500" },
];

// Retailer KPIs
const retailerKpis = [
  { label: "This Month Orders", value: "18", change: 12, icon: Package, color: "text-blue-500" },
  { label: "Total Spend", value: "$42,800", change: 8, icon: DollarSign, color: "text-emerald-500" },
  { label: "Credit Available", value: "$8,200", change: 0, icon: Target, color: "text-amber-500" },
  { label: "Active Promos", value: "4", change: 33, icon: Zap, color: "text-violet-500" },
];

// Supplier KPIs
const supplierKpis = [
  { label: "Brand Volume MTD", value: "18,200", change: 15, icon: Package, color: "text-blue-500" },
  { label: "Revenue MTD", value: "$3.64M", change: 12, icon: DollarSign, color: "text-emerald-500" },
  { label: "Distributors Active", value: "24", change: 4, icon: Users, color: "text-violet-500" },
  { label: "Campaign ROI", value: "3.2x", change: 8, icon: TrendingUp, color: "text-amber-500" },
];

// Logistics KPIs
const logisticsKpis = [
  { label: "Active Deliveries", value: "42", change: 5, icon: Truck, color: "text-blue-500" },
  { label: "On-Time Rate", value: "94.1%", change: 2, icon: Clock, color: "text-emerald-500" },
  { label: "Routes Today", value: "18", change: 0, icon: MapPin, color: "text-amber-500" },
  { label: "Fleet Utilization", value: "87%", change: 3, icon: Activity, color: "text-violet-500" },
];

const aiInsights = [
  { title: "Gin Category Surge", detail: "Craft gin orders up 34% in Victoria Island — consider promotional allocations", type: "success" as const },
  { title: "Age Verification Gap", detail: "3 delivery routes missing age verification on 12% of drops — compliance risk", type: "danger" as const },
  { title: "Slow-Moving Stock", detail: "Brandy X 750ml — 45-day inventory cover, 2x above target. Recommend markdown.", type: "warning" as const },
  { title: "On-Premise Expansion", detail: "14 new bar/restaurant licenses issued in Lekki — untapped territory opportunity", type: "success" as const },
];

const channelSplit = [
  { channel: "Bars & Nightclubs", cases: 3240, revenue: "₦12.1M", pct: 28 },
  { channel: "Restaurants & Hotels", cases: 2180, revenue: "₦8.9M", pct: 21 },
  { channel: "Liquor Stores", cases: 4120, revenue: "₦14.2M", pct: 33 },
  { channel: "Supermarkets", cases: 2340, revenue: "₦5.8M", pct: 14 },
  { channel: "Wholesale", cases: 960, revenue: "₦1.6M", pct: 4 },
];

const topBrands = [
  { name: "Hennessy VS", cases: 2840, velocity: 96, margin: 38 },
  { name: "Johnnie Walker Black", cases: 2120, velocity: 91, margin: 35 },
  { name: "Smirnoff Vodka 1L", cases: 1980, velocity: 88, margin: 28 },
  { name: "Baileys Original", cases: 1540, velocity: 82, margin: 42 },
  { name: "Guinness FES", cases: 3200, velocity: 94, margin: 22 },
];

const typeColors = { success: "border-emerald-500/30 bg-emerald-500/5", warning: "border-amber-500/30 bg-amber-500/5", danger: "border-destructive/30 bg-destructive/5" };
const typeIcons = { success: TrendingUp, warning: AlertTriangle, danger: ShieldAlert };

const LiquorDashboard = () => {
  const { liquorRole, loading } = useLiquorRole();
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const isSuperAdmin = userRole === "super_admin";
  const orgType = getOrgTypeFromRole(liquorRole);

  // Redirect non-distributor-owner roles to their dedicated hub on first load
  useEffect(() => {
    if (loading || isSuperAdmin) return;
    if (!liquorRole) {
      navigate("/industry/liquor/auth", { replace: true });
      return;
    }
    // Distributor owners + platform admins see the executive overview
    if (liquorRole === "distributor_owner" || liquorRole === "platform_admin") return;
    // Everyone else goes to their role-specific hub
    const defaultRoute = getDefaultRouteForRole(liquorRole);
    if (defaultRoute !== "/industry/liquor") {
      navigate(defaultRoute, { replace: true });
    }
  }, [liquorRole, loading, isSuperAdmin, navigate]);

  // Select KPIs based on org type
  const kpis = orgType === "supplier" ? supplierKpis
    : orgType === "retailer" ? retailerKpis
    : orgType === "logistics" ? logisticsKpis
    : distKpis;

  const roleLabel = liquorRole ? LIQUOR_ROLE_LABELS[liquorRole] : "Executive";

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
            <Wine className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">RouteAce Liquor OS</h1>
            <p className="text-muted-foreground">
              {isSuperAdmin ? "Super Admin — Full Platform View" : `${roleLabel} — Executive Overview`}
            </p>
          </div>
          <Badge className="ml-auto bg-emerald-500/15 text-emerald-400 border-emerald-500/30">Live</Badge>
        </div>

        {/* Role-specific KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="border-border/50">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  <span className={`text-xs font-medium ${kpi.change > 0 ? "text-emerald-500" : kpi.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                    {kpi.change > 0 ? "+" : ""}{kpi.change}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Insights — distributor + platform only */}
        {(orgType === "distributor" || orgType === "platform" || isSuperAdmin) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-rose-400" /> AI Intelligence Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiInsights.map((insight) => {
                  const InsightIcon = typeIcons[insight.type];
                  return (
                    <div key={insight.title} className={`p-4 rounded-xl border ${typeColors[insight.type]}`}>
                      <div className="flex items-start gap-3">
                        <InsightIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-foreground">{insight.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{insight.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Channel Distribution + Top Brands — distributor + platform */}
        {(orgType === "distributor" || orgType === "platform" || isSuperAdmin) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" /> Channel Distribution</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {channelSplit.map((ch) => (
                  <div key={ch.channel}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{ch.channel}</span>
                      <span className="text-xs text-muted-foreground">{ch.revenue} · {ch.cases.toLocaleString()} cases</span>
                    </div>
                    <Progress value={ch.pct} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Wine className="w-5 h-5" /> Top Brands by Velocity</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {topBrands.map((b, i) => (
                  <div key={b.name} className="flex items-center justify-between py-2 border-b last:border-0 border-border/30">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.cases.toLocaleString()} cases</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">{b.velocity}% vel</Badge>
                      <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30">{b.margin}% margin</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compliance + Delivery — distributor + logistics + platform */}
        {(orgType === "distributor" || orgType === "logistics" || orgType === "platform" || isSuperAdmin) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-rose-500/20">
              <CardContent className="pt-5 text-center">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                <p className="text-3xl font-bold">98.2%</p>
                <p className="text-sm text-muted-foreground">Excise Compliance Rate</p>
                <p className="text-xs text-muted-foreground mt-1">12 stamps pending verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-amber-400" />
                <p className="text-3xl font-bold">4.2 hrs</p>
                <p className="text-sm text-muted-foreground">Avg Delivery Time</p>
                <p className="text-xs text-muted-foreground mt-1">↓ 18min vs last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-3xl font-bold">94.1%</p>
                <p className="text-sm text-muted-foreground">Delivery Success Rate</p>
                <p className="text-xs text-muted-foreground mt-1">8 rejections today (age verification)</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </IndustryLayout>
  );
};

export default LiquorDashboard;
