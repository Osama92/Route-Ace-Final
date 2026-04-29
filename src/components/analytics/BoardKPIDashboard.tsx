import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { safeDivide } from "@/lib/apiValidator";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Clock,
  AlertTriangle,
  Download,
  BarChart3,
  PieChart,
  Wallet,
  ArrowUp,
  ArrowDown,
  Minus,
  FileText,
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

/**
 * Board KPI Dashboard - Section E
 * Executive one-page view for investors and board members
 */
const BoardKPIDashboard = () => {
  const currentMonth = new Date();
  const lastMonth = subMonths(currentMonth, 1);

  // Fetch comprehensive board metrics
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["board-kpis"],
    queryFn: async () => {
      const currentStart = startOfMonth(currentMonth).toISOString();
      const currentEnd = endOfMonth(currentMonth).toISOString();
      const lastStart = startOfMonth(lastMonth).toISOString();
      const lastEnd = endOfMonth(lastMonth).toISOString();

      // Revenue data
      const [currentInvoices, lastInvoices] = await Promise.all([
        supabase.from("invoices").select("total_amount, status").gte("created_at", currentStart).lte("created_at", currentEnd),
        supabase.from("invoices").select("total_amount, status").gte("created_at", lastStart).lte("created_at", lastEnd),
      ]);

      const currentRevenue = currentInvoices.data?.reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;
      const lastRevenue = lastInvoices.data?.reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;
      const revenueGrowth = safeDivide(currentRevenue - lastRevenue, lastRevenue) * 100;

      // Expenses data
      const [currentExpenses, lastExpenses] = await Promise.all([
        supabase.from("expenses").select("amount").gte("created_at", currentStart).lte("created_at", currentEnd).eq("approval_status", "approved"),
        supabase.from("expenses").select("amount").gte("created_at", lastStart).lte("created_at", lastEnd).eq("approval_status", "approved"),
      ]);

      const currentCost = currentExpenses.data?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
      const profitMargin = safeDivide(currentRevenue - currentCost, currentRevenue) * 100;

      // Fleet utilization
      const { data: vehicles } = await supabase.from("vehicles").select("id, status");
      const { data: activeDispatches } = await supabase
        .from("dispatches")
        .select("vehicle_id")
        .gte("created_at", currentStart)
        .not("vehicle_id", "is", null);

      const totalVehicles = vehicles?.length || 1;
      const activeVehicles = vehicles?.filter(v => v.status === "active").length || 0;
      const utilizedVehicles = new Set(activeDispatches?.map(d => d.vehicle_id)).size;
      const fleetUtilization = safeDivide(utilizedVehicles, totalVehicles) * 100;

      // Loss routes
      const { data: dispatches } = await supabase
        .from("dispatches")
        .select("cost, route_id")
        .gte("created_at", currentStart)
        .eq("status", "delivered");

      const routeCosts = new Map<string, number>();
      for (const d of dispatches || []) {
        const key = d.route_id || "unknown";
        routeCosts.set(key, (routeCosts.get(key) || 0) + (d.cost || 0));
      }

      // Idle assets (vehicles not used in 48+ hours)
      const idleThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      const { data: recentDispatches } = await supabase
        .from("dispatches")
        .select("vehicle_id")
        .gte("created_at", idleThreshold);

      const recentVehicleIds = new Set(recentDispatches?.map(d => d.vehicle_id));
      const idleAssets = activeVehicles - recentVehicleIds.size;
      const idlePercent = safeDivide(Math.max(0, idleAssets), totalVehicles) * 100;

      // Cashflow (paid vs outstanding)
      const paidRevenue = currentInvoices.data?.filter(i => i.status === "paid").reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;
      const outstandingRevenue = currentRevenue - paidRevenue;
      const cashflowHealth = safeDivide(paidRevenue, currentRevenue) * 100;

      // Loss routes: routes where average cost exceeds average revenue
      let lossRouteCount = 0;
      const avgRevPerRoute = routeCosts.size > 0 ? currentRevenue / routeCosts.size : 0;
      routeCosts.forEach((cost) => {
        if (cost > avgRevPerRoute && avgRevPerRoute > 0) lossRouteCount++;
      });
      const totalRoutes = routeCosts.size || 1;
      const lossRoutesPercent = safeDivide(lossRouteCount, totalRoutes) * 100;

      return {
        revenue: {
          current: currentRevenue,
          previous: lastRevenue,
          growth: revenueGrowth,
        },
        profitMargin,
        fleetUtilization,
        lossRoutesPercent,
        idlePercent,
        cashflowHealth,
        paidRevenue,
        outstandingRevenue,
        totalVehicles,
        activeVehicles,
      };
    },
  });

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getHealthColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return "text-green-600";
    if (value >= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  const handleExportPDF = () => {
    // In production, this would generate a PDF report
    console.log("Exporting board report to PDF...");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
            <PieChart className="w-6 h-6 text-primary" />
            Board Executive Dashboard
          </h2>
          <p className="text-muted-foreground">
            {format(currentMonth, "MMMM yyyy")} Performance Summary
          </p>
        </div>
        <Button onClick={handleExportPDF}>
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Revenue</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(metrics?.revenue.growth || 0)}
                <span className={`text-sm ${metrics?.revenue.growth && metrics.revenue.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {Math.abs(metrics?.revenue.growth || 0).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold">₦{((metrics?.revenue.current || 0) / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground mt-1">
              vs ₦{((metrics?.revenue.previous || 0) / 1000000).toFixed(1)}M last month
            </p>
          </CardContent>
        </Card>

        <Card className={metrics?.profitMargin && metrics.profitMargin > 20 ? "border-green-500/20 bg-green-500/5" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Profit Margin</span>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className={`text-3xl font-bold ${getHealthColor(metrics?.profitMargin || 0, { good: 25, warning: 15 })}`}>
              {(metrics?.profitMargin || 0).toFixed(1)}%
            </p>
            <Progress value={metrics?.profitMargin || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Fleet Utilization</span>
              <Truck className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className={`text-3xl font-bold ${getHealthColor(metrics?.fleetUtilization || 0, { good: 70, warning: 50 })}`}>
              {(metrics?.fleetUtilization || 0).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.activeVehicles}/{metrics?.totalVehicles} vehicles active
            </p>
          </CardContent>
        </Card>

        <Card className={metrics?.cashflowHealth && metrics.cashflowHealth > 70 ? "border-green-500/20 bg-green-500/5" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Cashflow Health</span>
              <Wallet className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className={`text-3xl font-bold ${getHealthColor(metrics?.cashflowHealth || 0, { good: 70, warning: 50 })}`}>
              {(metrics?.cashflowHealth || 0).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ₦{((metrics?.paidRevenue || 0) / 1000000).toFixed(1)}M collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Indicators */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            Risk Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Loss Routes</span>
                <Badge variant={(metrics?.lossRoutesPercent || 0) > 10 ? "destructive" : "secondary"}>
                  {(metrics?.lossRoutesPercent || 0).toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={metrics?.lossRoutesPercent || 0} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Idle Assets</span>
                <Badge variant={(metrics?.idlePercent || 0) > 20 ? "destructive" : "secondary"}>
                  {(metrics?.idlePercent || 0).toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={metrics?.idlePercent || 0} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Outstanding Revenue</span>
                <Badge variant="secondary">
                  ₦{((metrics?.outstandingRevenue || 0) / 1000000).toFixed(1)}M
                </Badge>
              </div>
              <Progress 
                value={100 - (metrics?.cashflowHealth || 0)} 
                className="h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Revenue Growth</span>
                <Badge variant={(metrics?.revenue.growth || 0) >= 0 ? "default" : "destructive"}>
                  {(metrics?.revenue.growth || 0) >= 0 ? "+" : ""}{(metrics?.revenue.growth || 0).toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={Math.min(100, Math.abs(metrics?.revenue.growth || 0) * 5)} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Strengths
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {(metrics?.profitMargin || 0) > 20 && <li>• Strong profit margins above 20%</li>}
                {(metrics?.cashflowHealth || 0) > 70 && <li>• Healthy cash collection rate</li>}
                {(metrics?.fleetUtilization || 0) > 70 && <li>• High fleet utilization</li>}
                {(metrics?.revenue.growth || 0) > 0 && <li>• Positive revenue growth trend</li>}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Areas for Improvement
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {(metrics?.idlePercent || 0) > 10 && <li>• Reduce idle asset percentage</li>}
                {(metrics?.lossRoutesPercent || 0) > 5 && <li>• Address loss-making routes</li>}
                {(metrics?.cashflowHealth || 0) < 70 && <li>• Improve collection rates</li>}
                {(metrics?.fleetUtilization || 0) < 60 && <li>• Increase fleet utilization</li>}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Recommended Actions
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Review pricing strategy for underperforming routes</li>
                <li>• Optimize maintenance schedules</li>
                <li>• Accelerate invoice collection</li>
                <li>• Consider monetizing idle assets</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Report generated on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</p>
        <p>Data reflects performance from {format(startOfMonth(currentMonth), "MMM d")} to {format(new Date(), "MMM d, yyyy")}</p>
      </div>
    </div>
  );
};

export default BoardKPIDashboard;
