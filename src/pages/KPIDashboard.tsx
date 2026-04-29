import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, DollarSign, Truck, Brain, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, subMonths, subYears, format } from "date-fns";
import { motion } from "framer-motion";

interface KPICard {
  name: string;
  current: number;
  previous: number;
  trend: number;
  format: "currency" | "percent" | "number" | "days";
  category: "financial" | "operational" | "strategic";
}

const formatKPIValue = (value: number, fmt: KPICard["format"]): string => {
  switch (fmt) {
    case "currency":
      if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
      if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`;
      return `₦${Math.round(value).toLocaleString()}`;
    case "percent":
      return `${value.toFixed(1)}%`;
    case "days":
      return `${value.toFixed(1)} days`;
    default:
      return value.toLocaleString();
  }
};

const KPIDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"mom" | "qoq" | "yoy">("mom");
  const [kpis, setKpis] = useState<KPICard[]>([]);

  useEffect(() => {
    fetchKPIs();
  }, [period]);

  const fetchKPIs = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let currentStart: Date, currentEnd: Date, prevStart: Date, prevEnd: Date;

      if (period === "mom") {
        currentStart = startOfMonth(now);
        currentEnd = now;
        prevStart = startOfMonth(subMonths(now, 1));
        prevEnd = endOfMonth(subMonths(now, 1));
      } else if (period === "qoq") {
        currentStart = startOfQuarter(now);
        currentEnd = now;
        prevStart = startOfQuarter(subMonths(now, 3));
        prevEnd = endOfQuarter(subMonths(now, 3));
      } else {
        currentStart = startOfYear(now);
        currentEnd = now;
        prevStart = startOfYear(subYears(now, 1));
        prevEnd = subYears(now, 1);
      }

      const cs = currentStart.toISOString();
      const ce = currentEnd.toISOString();
      const ps = prevStart.toISOString();
      const pe = prevEnd.toISOString();

      // Fetch financial data
      const [curInv, prevInv, curDisp, prevDisp, curExp, prevExp] = await Promise.all([
        supabase.from("invoices").select("total_amount, tax_amount, amount").gte("created_at", cs).lte("created_at", ce),
        supabase.from("invoices").select("total_amount, tax_amount, amount").gte("created_at", ps).lte("created_at", pe),
        supabase.from("dispatches").select("id, distance_km, cost, status, actual_delivery, scheduled_delivery, created_at").gte("created_at", cs).lte("created_at", ce),
        supabase.from("dispatches").select("id, distance_km, cost, status, actual_delivery, scheduled_delivery, created_at").gte("created_at", ps).lte("created_at", pe),
        supabase.from("expenses").select("amount").gte("created_at", cs).lte("created_at", ce),
        supabase.from("expenses").select("amount").gte("created_at", ps).lte("created_at", pe),
      ]);

      const sum = (arr: any[] | null, key: string) => (arr || []).reduce((s, r) => s + Number(r[key] || 0), 0);
      const calcTrend = (c: number, p: number) => p === 0 ? (c > 0 ? 100 : 0) : Math.round(((c - p) / p) * 100);

      const curRevenue = sum(curInv.data, "total_amount");
      const prevRevenue = sum(prevInv.data, "total_amount");
      const curVAT = sum(curInv.data, "tax_amount");
      const prevVAT = sum(prevInv.data, "tax_amount");
      const curExpTotal = sum(curExp.data, "amount");
      const prevExpTotal = sum(prevExp.data, "amount");
      const curGrossMargin = curRevenue - curExpTotal;
      const prevGrossMargin = prevRevenue - prevExpTotal;

      // Operational
      const curDelivered = (curDisp.data || []).filter((d: any) => d.status === "delivered");
      const prevDelivered = (prevDisp.data || []).filter((d: any) => d.status === "delivered");
      const curOnTime = curDelivered.filter((d: any) => d.actual_delivery && d.scheduled_delivery && new Date(d.actual_delivery) <= new Date(d.scheduled_delivery));
      const prevOnTime = prevDelivered.filter((d: any) => d.actual_delivery && d.scheduled_delivery && new Date(d.actual_delivery) <= new Date(d.scheduled_delivery));
      const curOTR = curDelivered.length > 0 ? (curOnTime.length / curDelivered.length) * 100 : 0;
      const prevOTR = prevDelivered.length > 0 ? (prevOnTime.length / prevDelivered.length) * 100 : 0;
      const curDistance = sum(curDelivered, "distance_km");
      const prevDistance = sum(prevDelivered, "distance_km");
      const curDrops = (curDisp.data || []).length;
      const prevDrops = (prevDisp.data || []).length;

      const results: KPICard[] = [
        // Financial
        { name: "Revenue", current: curRevenue, previous: prevRevenue, trend: calcTrend(curRevenue, prevRevenue), format: "currency", category: "financial" },
        { name: "Gross Margin", current: curGrossMargin, previous: prevGrossMargin, trend: calcTrend(curGrossMargin, prevGrossMargin), format: "currency", category: "financial" },
        { name: "Operating Expenses", current: curExpTotal, previous: prevExpTotal, trend: calcTrend(curExpTotal, prevExpTotal), format: "currency", category: "financial" },
        { name: "VAT Payable", current: curVAT, previous: prevVAT, trend: calcTrend(curVAT, prevVAT), format: "currency", category: "financial" },
        { name: "Avg Revenue/Trip", current: curDrops > 0 ? curRevenue / curDrops : 0, previous: prevDrops > 0 ? prevRevenue / prevDrops : 0, trend: calcTrend(curDrops > 0 ? curRevenue / curDrops : 0, prevDrops > 0 ? prevRevenue / prevDrops : 0), format: "currency", category: "financial" },
        // Operational
        { name: "On-Time Delivery", current: curOTR, previous: prevOTR, trend: calcTrend(curOTR, prevOTR), format: "percent", category: "operational" },
        { name: "Trips Completed", current: curDelivered.length, previous: prevDelivered.length, trend: calcTrend(curDelivered.length, prevDelivered.length), format: "number", category: "operational" },
        { name: "Drop Volume", current: curDrops, previous: prevDrops, trend: calcTrend(curDrops, prevDrops), format: "number", category: "operational" },
        { name: "Distance Covered", current: curDistance, previous: prevDistance, trend: calcTrend(curDistance, prevDistance), format: "number", category: "operational" },
        // Strategic
        { name: "Revenue per KM", current: curDistance > 0 ? curRevenue / curDistance : 0, previous: prevDistance > 0 ? prevRevenue / prevDistance : 0, trend: calcTrend(curDistance > 0 ? curRevenue / curDistance : 0, prevDistance > 0 ? prevRevenue / prevDistance : 0), format: "currency", category: "strategic" },
        { name: "Cost per KM", current: curDistance > 0 ? curExpTotal / curDistance : 0, previous: prevDistance > 0 ? prevExpTotal / prevDistance : 0, trend: calcTrend(curDistance > 0 ? curExpTotal / curDistance : 0, prevDistance > 0 ? prevExpTotal / prevDistance : 0), format: "currency", category: "strategic" },
      ];

      setKpis(results);
    } catch (err) {
      console.error("KPI fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const periodLabel = period === "mom" ? "Month-over-Month" : period === "qoq" ? "Quarter-over-Quarter" : "Year-over-Year";

  const renderCard = (kpi: KPICard, index: number) => {
    const isPositive = kpi.trend > 0;
    const isExpense = kpi.name.includes("Expense") || kpi.name.includes("Cost");
    const isGood = isExpense ? !isPositive : isPositive;

    return (
      <motion.div
        key={kpi.name}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
      >
        <Card className="border-border/50 hover:border-border transition-colors h-full">
          <CardContent className="pt-5 pb-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium">{kpi.name}</p>
            <div className="flex items-end justify-between gap-2">
              <p className="text-2xl font-bold font-heading">{formatKPIValue(kpi.current, kpi.format)}</p>
              {kpi.trend !== 0 ? (
                <Badge className={`text-xs ${isGood ? "bg-emerald-500/15 text-emerald-600" : "bg-destructive/15 text-destructive"}`}>
                  {isGood ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                  {kpi.trend > 0 ? "+" : ""}{kpi.trend}%
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs"><Minus className="w-3 h-3 mr-0.5" />0%</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              vs {formatKPIValue(kpi.previous, kpi.format)} prev
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const financial = kpis.filter(k => k.category === "financial");
  const operational = kpis.filter(k => k.category === "operational");
  const strategic = kpis.filter(k => k.category === "strategic");

  return (
    <DashboardLayout title="KPI Intelligence" subtitle="Multi-period performance tracking with variance analysis">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">{periodLabel} Comparison</p>
        </div>
        <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mom">Month-over-Month</SelectItem>
            <SelectItem value="qoq">Quarter-over-Quarter</SelectItem>
            <SelectItem value="yoy">Year-over-Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList>
            <TabsTrigger value="financial" className="gap-2"><DollarSign className="w-4 h-4" />Financial</TabsTrigger>
            <TabsTrigger value="operational" className="gap-2"><Truck className="w-4 h-4" />Operational</TabsTrigger>
            <TabsTrigger value="strategic" className="gap-2"><Brain className="w-4 h-4" />Strategic</TabsTrigger>
          </TabsList>

          <TabsContent value="financial">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {financial.map((k, i) => renderCard(k, i))}
            </div>
          </TabsContent>

          <TabsContent value="operational">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {operational.map((k, i) => renderCard(k, i))}
            </div>
          </TabsContent>

          <TabsContent value="strategic">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {strategic.map((k, i) => renderCard(k, i))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
};

export default KPIDashboard;
