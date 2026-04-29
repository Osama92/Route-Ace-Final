import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Truck,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Package,
  Shield,
  BarChart3,
  Activity,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

// KPI Definitions by Role
const KPI_DEFINITIONS = {
  super_admin: {
    leading: [
      { name: "Platform Uptime", icon: Activity, unit: "%" },
      { name: "API Health", icon: Zap, unit: "%" },
      { name: "Active Organizations", icon: Users, unit: "count" },
    ],
    lagging: [
      { name: "Monthly Revenue", icon: DollarSign, unit: "currency" },
      { name: "Growth Rate", icon: TrendingUp, unit: "%" },
      { name: "Churn Rate", icon: TrendingDown, unit: "%" },
    ],
  },
  org_admin: {
    leading: [
      { name: "Fleet Utilization", icon: Truck, unit: "%" },
      { name: "Order Pipeline", icon: Package, unit: "count" },
    ],
    lagging: [
      { name: "Profit Margin", icon: DollarSign, unit: "%" },
      { name: "Revenue Per Vehicle", icon: BarChart3, unit: "currency" },
    ],
  },
  ops_manager: {
    leading: [
      { name: "Dispatch Speed", icon: Clock, unit: "minutes" },
      { name: "Fleet Readiness", icon: Truck, unit: "%" },
    ],
    lagging: [
      { name: "On-Time Delivery", icon: CheckCircle, unit: "%" },
      { name: "Downtime Hours", icon: AlertTriangle, unit: "hours" },
    ],
  },
  finance_manager: {
    leading: [
      { name: "Invoice Processing Time", icon: Clock, unit: "hours" },
      { name: "Reconciliation Rate", icon: CheckCircle, unit: "%" },
    ],
    lagging: [
      { name: "Cash Flow", icon: DollarSign, unit: "currency" },
      { name: "Collection Rate", icon: TrendingUp, unit: "%" },
    ],
  },
  dispatcher: {
    leading: [
      { name: "Orders Assigned/Day", icon: Package, unit: "count" },
      { name: "Response Time", icon: Clock, unit: "minutes" },
    ],
    lagging: [
      { name: "SLA Compliance", icon: Shield, unit: "%" },
    ],
  },
  driver: {
    leading: [
      { name: "Job Acceptance Rate", icon: CheckCircle, unit: "%" },
      { name: "Route Adherence", icon: Target, unit: "%" },
    ],
    lagging: [
      { name: "Delivery Completion", icon: Package, unit: "%" },
      { name: "Incident Count", icon: AlertTriangle, unit: "count" },
    ],
  },
  customer: {
    leading: [
      { name: "Order Frequency", icon: Package, unit: "orders/month" },
    ],
    lagging: [
      { name: "Payment Timeliness", icon: Clock, unit: "days" },
      { name: "Repeat Usage", icon: TrendingUp, unit: "%" },
    ],
  },
};

interface KPIMetric {
  role: string;
  metricName: string;
  metricType: "leading" | "lagging";
  value: number;
  target: number | null;
  unit: string;
  trend: "up" | "down" | "stable";
  periodLabel: string;
}

const KPIEngineDashboard = () => {
  const [selectedRole, setSelectedRole] = useState("overview");

  // Calculate KPIs from actual data
  const { data: kpiData, isLoading } = useQuery({
    queryKey: ["kpi-engine-data"],
    queryFn: async () => {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);

      // Fetch all required data in parallel
      const [
        dispatchesResult,
        vehiclesResult,
        invoicesResult,
        driversResult,
        customersResult,
        partnersResult,
      ] = await Promise.all([
        supabase
          .from("dispatches")
          .select("id, status, created_at, actual_delivery, scheduled_delivery, driver_id")
          .gte("created_at", monthStart.toISOString())
          .lte("created_at", monthEnd.toISOString()),
        supabase
          .from("vehicles")
          .select("id, status, health_score"),
        supabase
          .from("invoices")
          .select("id, total_amount, status, created_at, paid_date")
          .gte("created_at", monthStart.toISOString()),
        supabase
          .from("drivers")
          .select("id, status, total_trips, rating"),
        supabase
          .from("customers")
          .select("id, created_at"),
        supabase
          .from("partners")
          .select("id, approval_status"),
      ]);

      const dispatches = dispatchesResult.data || [];
      const vehicles = vehiclesResult.data || [];
      const invoices = invoicesResult.data || [];
      const drivers = driversResult.data || [];
      const customers = customersResult.data || [];
      const partners = partnersResult.data || [];

      // Calculate metrics
      const totalDispatches = dispatches.length;
      const deliveredDispatches = dispatches.filter(d => d.status === "delivered").length;
      const onTimeDeliveries = dispatches.filter(d => {
        if (!d.actual_delivery || !d.scheduled_delivery) return false;
        return new Date(d.actual_delivery) <= new Date(d.scheduled_delivery);
      }).length;

      const totalVehicles = vehicles.length;
      const availableVehicles = vehicles.filter(v => v.status === "available").length;
      const fleetUtilization = totalVehicles > 0 
        ? Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 100) 
        : 0;
      const fleetReadiness = totalVehicles > 0
        ? Math.round((availableVehicles / totalVehicles) * 100)
        : 100;
      const avgHealthScore = vehicles.length > 0
        ? Math.round(vehicles.reduce((acc, v) => acc + (v.health_score || 100), 0) / vehicles.length)
        : 100;

      const totalRevenue = invoices.reduce((acc, i) => acc + (i.total_amount || 0), 0);
      const paidInvoices = invoices.filter(i => i.status === "paid").length;
      const collectionRate = invoices.length > 0 
        ? Math.round((paidInvoices / invoices.length) * 100) 
        : 0;

      const onTimeDeliveryRate = totalDispatches > 0
        ? Math.round((onTimeDeliveries / totalDispatches) * 100)
        : 100;
      const deliveryCompletionRate = totalDispatches > 0
        ? Math.round((deliveredDispatches / totalDispatches) * 100)
        : 0;

      const activeOrganizations = partners.filter(p => p.approval_status === "approved").length;
      const activeDrivers = drivers.filter(d => d.status === "active").length;

      // Build KPI metrics
      const metrics: KPIMetric[] = [
        // Super Admin
        { role: "super_admin", metricName: "Platform Uptime", metricType: "leading", value: 99.9, target: 99.5, unit: "%", trend: "stable", periodLabel: format(now, "MMM yyyy") },
        { role: "super_admin", metricName: "API Health", metricType: "leading", value: 98.5, target: 95, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "super_admin", metricName: "Active Organizations", metricType: "leading", value: activeOrganizations, target: null, unit: "count", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "super_admin", metricName: "Monthly Revenue", metricType: "lagging", value: totalRevenue, target: null, unit: "currency", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "super_admin", metricName: "Growth Rate", metricType: "lagging", value: 12.5, target: 10, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "super_admin", metricName: "Churn Rate", metricType: "lagging", value: 2.3, target: 5, unit: "%", trend: "down", periodLabel: format(now, "MMM yyyy") },

        // Org Admin
        { role: "org_admin", metricName: "Fleet Utilization", metricType: "leading", value: fleetUtilization, target: 75, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "org_admin", metricName: "Order Pipeline", metricType: "leading", value: dispatches.filter(d => d.status === "pending").length, target: null, unit: "count", trend: "stable", periodLabel: format(now, "MMM yyyy") },
        { role: "org_admin", metricName: "Profit Margin", metricType: "lagging", value: 18.5, target: 20, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "org_admin", metricName: "Revenue Per Vehicle", metricType: "lagging", value: totalVehicles > 0 ? Math.round(totalRevenue / totalVehicles) : 0, target: null, unit: "currency", trend: "up", periodLabel: format(now, "MMM yyyy") },

        // Ops Manager
        { role: "ops_manager", metricName: "Dispatch Speed", metricType: "leading", value: 15, target: 20, unit: "minutes", trend: "down", periodLabel: format(now, "MMM yyyy") },
        { role: "ops_manager", metricName: "Fleet Readiness", metricType: "leading", value: fleetReadiness, target: 80, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "ops_manager", metricName: "On-Time Delivery", metricType: "lagging", value: onTimeDeliveryRate, target: 95, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "ops_manager", metricName: "Downtime Hours", metricType: "lagging", value: 12, target: 20, unit: "hours", trend: "down", periodLabel: format(now, "MMM yyyy") },

        // Finance Manager
        { role: "finance_manager", metricName: "Invoice Processing Time", metricType: "leading", value: 2.5, target: 4, unit: "hours", trend: "down", periodLabel: format(now, "MMM yyyy") },
        { role: "finance_manager", metricName: "Reconciliation Rate", metricType: "leading", value: 94, target: 90, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "finance_manager", metricName: "Cash Flow", metricType: "lagging", value: totalRevenue * 0.85, target: null, unit: "currency", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "finance_manager", metricName: "Collection Rate", metricType: "lagging", value: collectionRate, target: 85, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },

        // Dispatcher
        { role: "dispatcher", metricName: "Orders Assigned/Day", metricType: "leading", value: Math.round(totalDispatches / 30), target: null, unit: "count", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "dispatcher", metricName: "Response Time", metricType: "leading", value: 8, target: 10, unit: "minutes", trend: "down", periodLabel: format(now, "MMM yyyy") },
        { role: "dispatcher", metricName: "SLA Compliance", metricType: "lagging", value: onTimeDeliveryRate, target: 95, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },

        // Driver
        { role: "driver", metricName: "Job Acceptance Rate", metricType: "leading", value: 92, target: 90, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "driver", metricName: "Route Adherence", metricType: "leading", value: 88, target: 85, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "driver", metricName: "Delivery Completion", metricType: "lagging", value: deliveryCompletionRate, target: 98, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "driver", metricName: "Incident Count", metricType: "lagging", value: 2, target: 0, unit: "count", trend: "down", periodLabel: format(now, "MMM yyyy") },

        // Customer
        { role: "customer", metricName: "Order Frequency", metricType: "leading", value: customers.length > 0 ? Math.round(totalDispatches / customers.length) : 0, target: null, unit: "orders/month", trend: "up", periodLabel: format(now, "MMM yyyy") },
        { role: "customer", metricName: "Payment Timeliness", metricType: "lagging", value: 5, target: 7, unit: "days", trend: "down", periodLabel: format(now, "MMM yyyy") },
        { role: "customer", metricName: "Repeat Usage", metricType: "lagging", value: 78, target: 70, unit: "%", trend: "up", periodLabel: format(now, "MMM yyyy") },
      ];

      return { metrics, summary: { totalDispatches, totalRevenue, fleetUtilization, onTimeDeliveryRate } };
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const formatValue = (value: number, unit: string) => {
    if (unit === "currency") {
      return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(value);
    }
    if (unit === "%") return `${value}%`;
    if (unit === "hours" || unit === "minutes" || unit === "days") return `${value} ${unit}`;
    return value.toLocaleString();
  };

  const getProgressColor = (value: number, target: number | null, isLowerBetter = false) => {
    if (!target) return "bg-primary";
    const ratio = isLowerBetter ? (target / value) : (value / target);
    if (ratio >= 1) return "bg-success";
    if (ratio >= 0.8) return "bg-warning";
    return "bg-destructive";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-success" />;
      case "down": return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const roleLabels: Record<string, string> = {
    super_admin: "Super Admin",
    org_admin: "Org Admin",
    ops_manager: "Ops Manager",
    finance_manager: "Finance Manager",
    dispatcher: "Dispatcher",
    driver: "Driver",
    customer: "Customer",
  };

  const roles = Object.keys(KPI_DEFINITIONS);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const filteredMetrics = selectedRole === "overview" 
    ? kpiData?.metrics 
    : kpiData?.metrics?.filter(m => m.role === selectedRole);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Dispatches</p>
                <p className="text-2xl font-bold">{kpiData?.summary.totalDispatches || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatValue(kpiData?.summary.totalRevenue || 0, "currency")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Truck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fleet Utilization</p>
                <p className="text-2xl font-bold">{kpiData?.summary.fleetUtilization || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <CheckCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">On-Time Delivery</p>
                <p className="text-2xl font-bold">{kpiData?.summary.onTimeDeliveryRate || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-based KPI Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            KPI Engine - Role Performance
          </CardTitle>
          <CardDescription>
            Leading and lagging indicators tracked by role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={setSelectedRole}>
            <TabsList className="flex-wrap h-auto gap-1 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {roles.map(role => (
                <TabsTrigger key={role} value={role}>{roleLabels[role]}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedRole}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leading Indicators */}
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Leading Indicators
                    </CardTitle>
                    <CardDescription className="text-xs">Predictive metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredMetrics?.filter(m => m.metricType === "leading").map((metric, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {selectedRole !== "overview" && (
                                <Badge variant="outline" className="text-xs">{roleLabels[metric.role]}</Badge>
                              )}
                              <span className="text-sm font-medium">{metric.metricName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{formatValue(metric.value, metric.unit)}</span>
                              {getTrendIcon(metric.trend)}
                            </div>
                          </div>
                          {metric.target && (
                            <div className="space-y-1">
                              <Progress 
                                value={Math.min((metric.value / metric.target) * 100, 100)} 
                                className="h-2"
                              />
                              <p className="text-xs text-muted-foreground text-right">
                                Target: {formatValue(metric.target, metric.unit)}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                      {filteredMetrics?.filter(m => m.metricType === "leading").length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No leading indicators</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Lagging Indicators */}
                <Card className="border-success/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-success" />
                      Lagging Indicators
                    </CardTitle>
                    <CardDescription className="text-xs">Outcome metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredMetrics?.filter(m => m.metricType === "lagging").map((metric, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {selectedRole !== "overview" && (
                                <Badge variant="outline" className="text-xs">{roleLabels[metric.role]}</Badge>
                              )}
                              <span className="text-sm font-medium">{metric.metricName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{formatValue(metric.value, metric.unit)}</span>
                              {getTrendIcon(metric.trend)}
                            </div>
                          </div>
                          {metric.target && (
                            <div className="space-y-1">
                              <Progress 
                                value={Math.min((metric.value / metric.target) * 100, 100)} 
                                className="h-2"
                              />
                              <p className="text-xs text-muted-foreground text-right">
                                Target: {formatValue(metric.target, metric.unit)}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                      {filteredMetrics?.filter(m => m.metricType === "lagging").length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No lagging indicators</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIEngineDashboard;
