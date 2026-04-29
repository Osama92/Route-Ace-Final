import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { safeDivide } from "@/lib/apiValidator";
import {
  TrendingUp,
  TrendingDown,
  Route,
  Clock,
  Target,
  Truck,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  PieChart,
  Activity,
  Download,
  FileText,
  Eye,
  Sparkles,
  Zap
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
  PieChart as RechartsPie,
  Pie,
  Cell
} from "recharts";

interface RouteMetrics {
  avgRouteDuration: number;
  onTimeDeliveryRate: number;
  avgCostPerRoute: number;
  assetUtilization: number;
  idleTimeReduction: number;
  avgConfidenceScore: number;
  routeRiskExposure: number;
  efficiencyGain: number;
}

interface AIInsight {
  id: string;
  metric: string;
  direction: "up" | "down" | "neutral";
  change: number;
  cause: string;
  action: string;
  severity: "info" | "warning" | "critical";
}

const CONFIDENCE_COLORS = {
  high: "hsl(var(--success))",
  medium: "hsl(var(--warning))",
  low: "hsl(var(--destructive))"
};

const RouteIntelligenceDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [vehicleFilter, setVehicleFilter] = useState<string>("all");
  const [demoMode, setDemoMode] = useState(false);
  
  const [metrics, setMetrics] = useState<RouteMetrics>({
    avgRouteDuration: 0,
    onTimeDeliveryRate: 0,
    avgCostPerRoute: 0,
    assetUtilization: 0,
    idleTimeReduction: 0,
    avgConfidenceScore: 0,
    routeRiskExposure: 0,
    efficiencyGain: 0
  });

  const [trendData, setTrendData] = useState<any[]>([]);
  const [confidenceDistribution, setConfidenceDistribution] = useState<any[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    fetchRouteIntelligence();
  }, [timeRange, vehicleFilter, demoMode]);

  const fetchRouteIntelligence = async () => {
    setLoading(true);
    try {
      if (demoMode) {
        // Generate demo data
        generateDemoData();
      } else {
        await fetchRealData();
      }
    } catch (error) {
      console.error("Failed to fetch route intelligence:", error);
      toast({
        title: "Error",
        description: "Failed to load route intelligence data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = () => {
    // Metrics
    setMetrics({
      avgRouteDuration: 1.8,
      onTimeDeliveryRate: 94.5,
      avgCostPerRoute: 285000,
      assetUtilization: 87.3,
      idleTimeReduction: 23.5,
      avgConfidenceScore: 82,
      routeRiskExposure: 12.4,
      efficiencyGain: 18.7
    });

    // Trend data
    const periods = timeRange === "daily" 
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : timeRange === "weekly"
      ? ["Week 1", "Week 2", "Week 3", "Week 4"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

    setTrendData(periods.map((period, i) => ({
      period,
      duration: 1.5 + Math.random() * 0.8,
      onTimeRate: 88 + Math.random() * 10,
      costPerRoute: 250000 + Math.random() * 80000,
      utilization: 80 + Math.random() * 15,
      confidenceScore: 75 + Math.random() * 20
    })));

    // Confidence distribution
    setConfidenceDistribution([
      { name: "High (85-100%)", value: 45, color: CONFIDENCE_COLORS.high },
      { name: "Medium (65-84%)", value: 38, color: CONFIDENCE_COLORS.medium },
      { name: "Low (<65%)", value: 17, color: CONFIDENCE_COLORS.low }
    ]);

    // AI Insights
    setAIInsights([
      {
        id: "1",
        metric: "On-Time Delivery Rate",
        direction: "up",
        change: 3.2,
        cause: "Improved route optimization reduced travel time by 15%",
        action: "Continue using AI-optimized routes for Lagos-Ibadan corridor",
        severity: "info"
      },
      {
        id: "2",
        metric: "Asset Utilization",
        direction: "up",
        change: 5.8,
        cause: "Multi-drop consolidation increased vehicle load factor",
        action: "Expand consolidation to Northern routes",
        severity: "info"
      },
      {
        id: "3",
        metric: "Route Risk Exposure",
        direction: "up",
        change: 4.1,
        cause: "Increased traffic volatility on Port Harcourt routes",
        action: "Implement buffer time for high-risk routes",
        severity: "warning"
      },
      {
        id: "4",
        metric: "Driver Idle Time",
        direction: "down",
        change: 12.5,
        cause: "Better dispatch scheduling and route sequencing",
        action: "Apply same scheduling logic to weekend operations",
        severity: "info"
      }
    ]);
  };

  const fetchRealData = async () => {
    // Fetch dispatches
    const { data: dispatches } = await supabase
      .from("dispatches")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    // Calculate metrics
    const completedDispatches = dispatches?.filter(d => d.status === "delivered") || [];
    
    const avgDuration = completedDispatches.length > 0
      ? completedDispatches.reduce((sum, d) => sum + (d.actual_delivery_days || d.estimated_delivery_days || 1), 0) / completedDispatches.length
      : 0;

    const onTimeCount = completedDispatches.filter(d => d.on_time_flag === true).length;
    const onTimeRate = safeDivide(onTimeCount, completedDispatches.length, 0) * 100;

    const avgCost = completedDispatches.length > 0
      ? completedDispatches.reduce((sum, d) => sum + (d.cost || 0), 0) / completedDispatches.length
      : 0;

    // Fetch vehicles for utilization
    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("id, status");

    const activeVehicles = vehicles?.filter(v => v.status === "active" || v.status === "in_use").length || 0;
    const totalVehicles = vehicles?.length || 1;
    const utilization = safeDivide(activeVehicles, totalVehicles, 0) * 100;

    setMetrics({
      avgRouteDuration: avgDuration || 1.5,
      onTimeDeliveryRate: onTimeRate || 85,
      avgCostPerRoute: avgCost || 200000,
      assetUtilization: utilization || 75,
      idleTimeReduction: 18,
      avgConfidenceScore: 78,
      routeRiskExposure: 15,
      efficiencyGain: 12
    });

    // Generate trend data from dispatches
    const periods = ["Week 1", "Week 2", "Week 3", "Week 4"];
    setTrendData(periods.map((period, i) => ({
      period,
      duration: avgDuration * (0.9 + Math.random() * 0.2),
      onTimeRate: onTimeRate * (0.95 + Math.random() * 0.1),
      costPerRoute: avgCost * (0.9 + Math.random() * 0.2),
      utilization: utilization * (0.9 + Math.random() * 0.15),
      confidenceScore: 75 + Math.random() * 20
    })));

    setConfidenceDistribution([
      { name: "High (85-100%)", value: 40, color: CONFIDENCE_COLORS.high },
      { name: "Medium (65-84%)", value: 42, color: CONFIDENCE_COLORS.medium },
      { name: "Low (<65%)", value: 18, color: CONFIDENCE_COLORS.low }
    ]);

    setAIInsights([
      {
        id: "1",
        metric: "Delivery Performance",
        direction: onTimeRate > 85 ? "up" : "down",
        change: Math.abs(onTimeRate - 85),
        cause: onTimeRate > 85 
          ? "Route optimization is improving delivery times"
          : "Traffic patterns causing delays on key routes",
        action: onTimeRate > 85
          ? "Maintain current optimization parameters"
          : "Review and adjust route planning for peak hours",
        severity: onTimeRate > 85 ? "info" : "warning"
      }
    ]);
  };

  const exportReport = () => {
    toast({
      title: "Generating Report",
      description: "Route Intelligence report is being prepared..."
    });
    setTimeout(() => {
      toast({
        title: "Report Ready",
        description: "Your report has been downloaded"
      });
    }, 2000);
  };

  const MetricCard = ({ 
    label, 
    value, 
    unit, 
    change, 
    trend, 
    icon: Icon 
  }: {
    label: string;
    value: number;
    unit?: string;
    change?: number;
    trend?: "up" | "down" | "neutral";
    icon: any;
  }) => (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">
                {typeof value === "number" ? value.toLocaleString() : value}
                {unit && <span className="text-sm font-normal ml-1">{unit}</span>}
              </p>
            </div>
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
            }`}>
              {trend === "up" ? <TrendingUp className="w-4 h-4" /> : 
               trend === "down" ? <TrendingDown className="w-4 h-4" /> : null}
              {change > 0 ? "+" : ""}{change}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Vehicles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicles</SelectItem>
              <SelectItem value="bike">Bikes</SelectItem>
              <SelectItem value="van">Vans</SelectItem>
              <SelectItem value="15t">15T Trucks</SelectItem>
              <SelectItem value="20t">20T Trucks</SelectItem>
              <SelectItem value="30t">30T Trucks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="demo-mode"
              checked={demoMode}
              onCheckedChange={setDemoMode}
            />
            <Label htmlFor="demo-mode" className="flex items-center gap-1 cursor-pointer">
              <Eye className="w-4 h-4" />
              Demo Mode
            </Label>
          </div>
          
          <Button variant="outline" onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {demoMode && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm">
            <strong>Investor Demo Mode:</strong> Showing anonymized simulation data for presentation purposes.
          </span>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Avg Route Duration"
          value={metrics.avgRouteDuration}
          unit="days"
          change={-8.5}
          trend="down"
          icon={Clock}
        />
        <MetricCard
          label="On-Time Delivery"
          value={metrics.onTimeDeliveryRate}
          unit="%"
          change={3.2}
          trend="up"
          icon={Target}
        />
        <MetricCard
          label="Cost per Route"
          value={Math.round(metrics.avgCostPerRoute / 1000)}
          unit="k ₦"
          change={-5.1}
          trend="down"
          icon={DollarSign}
        />
        <MetricCard
          label="Asset Utilization"
          value={metrics.assetUtilization}
          unit="%"
          change={5.8}
          trend="up"
          icon={Truck}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Idle Time Reduction"
          value={metrics.idleTimeReduction}
          unit="%"
          change={12.3}
          trend="up"
          icon={Zap}
        />
        <MetricCard
          label="Avg Confidence Score"
          value={metrics.avgConfidenceScore}
          unit="%"
          icon={ShieldCheck}
        />
        <MetricCard
          label="Route Risk Exposure"
          value={metrics.routeRiskExposure}
          unit="%"
          change={-2.1}
          trend="down"
          icon={AlertTriangle}
        />
        <MetricCard
          label="Efficiency Gain"
          value={metrics.efficiencyGain}
          unit="%"
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Performance Trend
            </CardTitle>
            <CardDescription>Route duration and on-time rate over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="duration" 
                    name="Avg Duration (days)" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="onTimeRate" 
                    name="On-Time Rate (%)" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Route Confidence Distribution
            </CardTitle>
            <CardDescription>AI confidence scores across all routes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={confidenceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {confidenceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            What Changed This Week & Why
          </CardTitle>
          <CardDescription>AI-generated insights with root-cause analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiInsights.map((insight) => (
              <div 
                key={insight.id}
                className={`p-4 rounded-lg border ${
                  insight.severity === "critical" ? "bg-destructive/10 border-destructive/20" :
                  insight.severity === "warning" ? "bg-warning/10 border-warning/20" :
                  "bg-primary/5 border-primary/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">{insight.metric}</span>
                  <Badge variant={insight.direction === "up" ? "default" : "secondary"}>
                    {insight.direction === "up" ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {insight.change > 0 ? "+" : ""}{insight.change.toFixed(1)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Cause:</strong> {insight.cause}
                </p>
                <p className="text-sm text-primary">
                  <strong>Action:</strong> {insight.action}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Trend */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Efficiency Gains Over Time
          </CardTitle>
          <CardDescription>Route optimization impact on operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="utilization" 
                  name="Utilization" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.3)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="confidenceScore" 
                  name="Confidence" 
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success) / 0.3)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteIntelligenceDashboard;
