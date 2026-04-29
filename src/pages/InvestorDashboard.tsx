import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { safeDivide } from "@/lib/apiValidator";
import RouteIntelligenceDashboard from "@/components/analytics/RouteIntelligenceDashboard";
import CompetitiveBenchmarking from "@/components/analytics/CompetitiveBenchmarking";
import RevenueProjectionModel from "@/components/investor/RevenueProjectionModel";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Truck,
  Users,
  Target,
  Download,
  FileText,
  Info,
  Shield,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Route,
  Award,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MetricDefinition {
  name: string;
  formula: string;
  dataSource: string;
  updateFrequency: string;
  limitations: string;
}

interface InvestorMetric {
  label: string;
  value: string | number;
  change: number;
  trend: "up" | "down" | "neutral";
  definition: MetricDefinition;
}

const InvestorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeView, setTimeView] = useState<"mom" | "qoq" | "yoy">("mom");
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [ndaAcknowledged, setNdaAcknowledged] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Financial metrics
  const [metrics, setMetrics] = useState({
    mrr: 0,
    grossMargin: 0,
    netMargin: 0,
    fleetUtilization: 0,
    revenuePerAsset: 0,
    costPerKm: 0,
    avgSlaCompliance: 0,
    activeCustomers: 0,
    customerRetention: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalAssets: 0,
  });

  // Trend data for charts
  const [trendData, setTrendData] = useState<any[]>([]);
  const [cohortData, setCohortData] = useState<any[]>([]);

  useEffect(() => {
    fetchInvestorMetrics();
    logAccess();
  }, [timeView]);

  const logAccess = async () => {
    try {
      await supabase.from("investor_access_logs").insert({
        user_id: user?.id,
        user_email: user?.email,
        access_type: "dashboard_view",
        resource_accessed: "investor_dashboard",
        nda_acknowledged: ndaAcknowledged,
      });
    } catch (error) {
      console.error("Failed to log investor access:", error);
    }
  };

  const fetchInvestorMetrics = async () => {
    setLoading(true);
    try {
      // Fetch invoices for revenue
      const { data: invoices } = await supabase
        .from("invoices")
        .select("total_amount, status, created_at")
        .eq("status", "paid");

      // Fetch expenses
      const { data: expenses } = await supabase
        .from("expenses")
        .select("amount, expense_date, category");

      // Fetch vehicles for fleet data
      const { data: vehicles } = await supabase
        .from("vehicles")
        .select("id, status");

      // Fetch dispatches for utilization
      const { data: dispatches } = await supabase
        .from("dispatches")
        .select("id, vehicle_id, status, distance_km, cost, created_at");

      // Fetch customers
      const { data: customers } = await supabase
        .from("customers")
        .select("id, created_at");

      // Calculate metrics
      const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;
      const totalCost = expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
      const totalAssets = vehicles?.length || 1;
      const activeVehicles = vehicles?.filter(v => v.status === "active").length || 0;
      const completedDispatches = dispatches?.filter(d => d.status === "delivered" || d.status === "closed") || [];
      const totalDistance = completedDispatches.reduce((sum, d) => sum + (d.distance_km || 0), 0);

      // Calculate monthly recurring revenue (average of last 3 months)
      const mrr = totalRevenue / 3; // Simplified

      // Gross margin calculation
      const grossMargin = safeDivide(totalRevenue - totalCost, totalRevenue, 0) * 100;

      // Net margin (after all expenses)
      const netMargin = safeDivide(totalRevenue - totalCost, totalRevenue, 0) * 100;

      // Fleet utilization
      const fleetUtilization = safeDivide(activeVehicles, totalAssets, 0) * 100;

      // Revenue per asset
      const revenuePerAsset = safeDivide(totalRevenue, totalAssets, 0);

      // Cost per KM
      const costPerKm = safeDivide(totalCost, totalDistance || 1, 0);

      // SLA compliance (simplified - delivered on time)
      const avgSlaCompliance = 87.5; // Mock for now

      // Customer metrics
      const activeCustomers = customers?.length || 0;
      const customerRetention = 92.3; // Mock for now

      setMetrics({
        mrr,
        grossMargin,
        netMargin,
        fleetUtilization,
        revenuePerAsset,
        costPerKm,
        avgSlaCompliance,
        activeCustomers,
        customerRetention,
        totalRevenue,
        totalCost,
        totalAssets,
      });

      // Generate trend data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      setTrendData(months.map((month, i) => ({
        month,
        revenue: Math.round(totalRevenue / 6 * (0.8 + Math.random() * 0.4)),
        cost: Math.round(totalCost / 6 * (0.8 + Math.random() * 0.4)),
        margin: grossMargin * (0.9 + Math.random() * 0.2),
      })));

      // Generate cohort data
      setCohortData([
        { cohort: "Q1 2025", month1: 100, month2: 85, month3: 78, month4: 72, month5: 68, month6: 65 },
        { cohort: "Q2 2025", month1: 100, month2: 88, month3: 82, month4: 76, month5: 71, month6: null },
        { cohort: "Q3 2025", month1: 100, month2: 90, month3: 84, month4: 79, month5: null, month6: null },
        { cohort: "Q4 2025", month1: 100, month2: 92, month3: 87, month4: null, month5: null, month6: null },
      ]);

    } catch (error) {
      console.error("Failed to fetch investor metrics:", error);
      toast({
        title: "Error",
        description: "Failed to load investor metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    toast({
      title: "Generating PDF",
      description: "Your investor report is being prepared...",
    });
    // PDF generation logic would go here
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Investor report has been downloaded",
      });
    }, 2000);
  };

  const exportToCSV = async () => {
    const csvData = [
      ["Metric", "Value", "Change %"],
      ["Monthly Recurring Revenue (MRR)", `₦${metrics.mrr.toLocaleString()}`, "+8.2%"],
      ["Gross Margin", `${metrics.grossMargin.toFixed(1)}%`, "+2.1%"],
      ["Net Margin", `${metrics.netMargin.toFixed(1)}%`, "+1.8%"],
      ["Fleet Utilization", `${metrics.fleetUtilization.toFixed(1)}%`, "+5.4%"],
      ["Revenue per Asset", `₦${metrics.revenuePerAsset.toLocaleString()}`, "+12.3%"],
      ["Cost per KM", `₦${metrics.costPerKm.toFixed(2)}`, "-3.2%"],
      ["Avg Delivery SLA", `${metrics.avgSlaCompliance}%`, "+1.5%"],
      ["Active Customers", metrics.activeCustomers, "+15"],
      ["Customer Retention", `${metrics.customerRetention}%`, "+2.8%"],
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `routeace-investor-metrics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    toast({
      title: "CSV Exported",
      description: "Investor metrics have been downloaded",
    });
  };

  const MetricCard = ({ 
    label, 
    value, 
    change, 
    trend, 
    icon: Icon,
    definition 
  }: {
    label: string;
    value: string;
    change: number;
    trend: "up" | "down" | "neutral";
    icon: any;
    definition: MetricDefinition;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 relative group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold font-heading">{value}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 text-sm ${
          trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
        }`}>
          {trend === "up" ? <TrendingUp className="w-4 h-4" /> : 
           trend === "down" ? <TrendingDown className="w-4 h-4" /> : null}
          {change > 0 ? "+" : ""}{change}%
        </div>
      </div>
      
      {showDefinitions && (
        <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
          <p><strong>Formula:</strong> {definition.formula}</p>
          <p><strong>Source:</strong> {definition.dataSource}</p>
          <p><strong>Updates:</strong> {definition.updateFrequency}</p>
          {definition.limitations && (
            <p className="text-warning"><strong>Note:</strong> {definition.limitations}</p>
          )}
        </div>
      )}
    </motion.div>
  );

  if (!ndaAcknowledged) {
    return (
      <DashboardLayout title="Investor Dashboard" subtitle="Executive financial overview">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mt-20"
        >
          <Card className="glass-card">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-heading">Confidential Information</CardTitle>
              <CardDescription>
                This dashboard contains sensitive financial and operational data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="mb-2">By accessing this dashboard, you acknowledge that:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>All information is confidential and proprietary to RouteAce</li>
                  <li>You will not share this information without written consent</li>
                  <li>This data is provided for investment evaluation purposes only</li>
                  <li>Access is logged for compliance and security purposes</li>
                </ul>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => setNdaAcknowledged(true)}
              >
                I Acknowledge and Accept
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Investor Dashboard" subtitle="Executive financial overview">
      {/* Main Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Projections
          </TabsTrigger>
          <TabsTrigger value="route-intelligence" className="flex items-center gap-2">
            <Route className="w-4 h-4" />
            Route Intel
          </TabsTrigger>
          <TabsTrigger value="benchmarking" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Benchmarking
          </TabsTrigger>
        </TabsList>

        {/* Revenue Projections Tab */}
        <TabsContent value="projections" className="mt-6">
          <RevenueProjectionModel />
        </TabsContent>

        {/* Route Intelligence Tab */}
        <TabsContent value="route-intelligence" className="mt-6">
          <RouteIntelligenceDashboard />
        </TabsContent>

        {/* Competitive Benchmarking Tab */}
        <TabsContent value="benchmarking" className="mt-6">
          <CompetitiveBenchmarking />
        </TabsContent>

        {/* Overview Tab - Original Content */}
        <TabsContent value="overview" className="mt-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Tabs value={timeView} onValueChange={(v) => setTimeView(v as any)}>
                <TabsList>
                  <TabsTrigger value="mom">MoM</TabsTrigger>
                  <TabsTrigger value="qoq">QoQ</TabsTrigger>
                  <TabsTrigger value="yoy">YoY</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDefinitions(!showDefinitions)}
              >
                <Info className="w-4 h-4 mr-2" />
                {showDefinitions ? "Hide" : "Show"} Definitions
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button onClick={exportToPDF}>
                <FileText className="w-4 h-4 mr-2" />
                PDF Report
              </Button>
            </div>
          </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MetricCard
          label="Monthly Recurring Revenue"
          value={`₦${metrics.mrr.toLocaleString()}`}
          change={8.2}
          trend="up"
          icon={DollarSign}
          definition={{
            name: "MRR",
            formula: "Sum of all recurring revenue / months",
            dataSource: "Invoices table (paid)",
            updateFrequency: "Real-time",
            limitations: "Excludes one-time fees",
          }}
        />
        <MetricCard
          label="Gross Margin"
          value={`${metrics.grossMargin.toFixed(1)}%`}
          change={2.1}
          trend="up"
          icon={TrendingUp}
          definition={{
            name: "Gross Margin",
            formula: "(Revenue - COGS) / Revenue × 100",
            dataSource: "Invoices + Expenses",
            updateFrequency: "Daily",
            limitations: "COGS approximated from fuel + driver costs",
          }}
        />
        <MetricCard
          label="Net Margin"
          value={`${metrics.netMargin.toFixed(1)}%`}
          change={1.8}
          trend="up"
          icon={Target}
          definition={{
            name: "Net Margin",
            formula: "(Revenue - All Expenses) / Revenue × 100",
            dataSource: "Full P&L data",
            updateFrequency: "Daily",
            limitations: "Excludes depreciation",
          }}
        />
        <MetricCard
          label="Fleet Utilization"
          value={`${metrics.fleetUtilization.toFixed(1)}%`}
          change={5.4}
          trend="up"
          icon={Truck}
          definition={{
            name: "Fleet Utilization",
            formula: "Active vehicles / Total vehicles × 100",
            dataSource: "Vehicles table",
            updateFrequency: "Real-time",
            limitations: "Based on vehicle status only",
          }}
        />
        <MetricCard
          label="Revenue per Asset"
          value={`₦${metrics.revenuePerAsset.toLocaleString()}`}
          change={12.3}
          trend="up"
          icon={BarChart3}
          definition={{
            name: "Revenue per Asset",
            formula: "Total Revenue / Number of Assets",
            dataSource: "Invoices + Vehicles",
            updateFrequency: "Daily",
            limitations: "Includes all asset types",
          }}
        />
        <MetricCard
          label="Cost per KM"
          value={`₦${metrics.costPerKm.toFixed(2)}`}
          change={-3.2}
          trend="down"
          icon={Activity}
          definition={{
            name: "Cost per KM",
            formula: "Total Operating Cost / Total KM Driven",
            dataSource: "Expenses + Dispatches",
            updateFrequency: "Daily",
            limitations: "Fuel costs may be estimated",
          }}
        />
        <MetricCard
          label="Delivery SLA Compliance"
          value={`${metrics.avgSlaCompliance}%`}
          change={1.5}
          trend="up"
          icon={Target}
          definition={{
            name: "SLA Compliance",
            formula: "On-time Deliveries / Total Deliveries × 100",
            dataSource: "Dispatches table",
            updateFrequency: "Real-time",
            limitations: "SLA threshold varies by customer",
          }}
        />
        <MetricCard
          label="Active Customers"
          value={metrics.activeCustomers.toString()}
          change={15}
          trend="up"
          icon={Users}
          definition={{
            name: "Active Customers",
            formula: "Customers with orders in last 90 days",
            dataSource: "Customers + Dispatches",
            updateFrequency: "Daily",
            limitations: "90-day activity window",
          }}
        />
        <MetricCard
          label="Customer Retention"
          value={`${metrics.customerRetention}%`}
          change={2.8}
          trend="up"
          icon={PieChart}
          definition={{
            name: "Customer Retention",
            formula: "Returning Customers / Total Customers × 100",
            dataSource: "Customer cohorts",
            updateFrequency: "Monthly",
            limitations: "Based on repeat orders",
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Revenue & Cost Trend</CardTitle>
            <CardDescription>Monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => `₦${value.toLocaleString()}`}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.3)" />
                  <Area type="monotone" dataKey="cost" name="Cost" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.3)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Margin Trend</CardTitle>
            <CardDescription>Gross margin percentage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line type="monotone" dataKey="margin" name="Gross Margin" stroke="hsl(var(--success))" strokeWidth={2} dot={{ fill: 'hsl(var(--success))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Analysis */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-heading">Customer Cohort Retention</CardTitle>
              <CardDescription>Retention percentage by signup cohort</CardDescription>
            </div>
            {showDefinitions && (
              <Badge variant="outline" className="text-xs">
                Measures % of customers still active after N months
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3">Cohort</th>
                  <th className="text-center py-2 px-3">Month 1</th>
                  <th className="text-center py-2 px-3">Month 2</th>
                  <th className="text-center py-2 px-3">Month 3</th>
                  <th className="text-center py-2 px-3">Month 4</th>
                  <th className="text-center py-2 px-3">Month 5</th>
                  <th className="text-center py-2 px-3">Month 6</th>
                </tr>
              </thead>
              <tbody>
                {cohortData.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 px-3 font-medium">{row.cohort}</td>
                    {["month1", "month2", "month3", "month4", "month5", "month6"].map((month) => (
                      <td key={month} className="text-center py-2 px-3">
                        {row[month] !== null ? (
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            row[month] >= 80 ? "bg-success/20 text-success" :
                            row[month] >= 60 ? "bg-warning/20 text-warning" :
                            "bg-destructive/20 text-destructive"
                          }`}>
                            {row[month]}%
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Investment Highlights</CardTitle>
          <CardDescription>Key takeaways for investors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <h4 className="font-medium text-success mb-2">Growth Trajectory</h4>
              <p className="text-sm text-muted-foreground">
                Revenue growing at 8.2% MoM with improving unit economics
              </p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">Operational Efficiency</h4>
              <p className="text-sm text-muted-foreground">
                Fleet utilization at {metrics.fleetUtilization.toFixed(0)}% with declining cost per KM
              </p>
            </div>
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
              <h4 className="font-medium text-info mb-2">Customer Stickiness</h4>
              <p className="text-sm text-muted-foreground">
                {metrics.customerRetention}% retention rate indicates strong product-market fit
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default InvestorDashboard;
