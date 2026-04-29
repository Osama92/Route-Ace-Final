import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Package, Truck, Target, ShoppingCart, DollarSign } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenueData = [
  { month: "Oct", revenue: 180, target: 200 }, { month: "Nov", revenue: 220, target: 210 },
  { month: "Dec", revenue: 310, target: 250 }, { month: "Jan", revenue: 195, target: 220 },
  { month: "Feb", revenue: 240, target: 230 }, { month: "Mar", revenue: 280, target: 260 },
];

const categoryPerf = [
  { category: "Home Care", revenue: 42, growth: 12 },
  { category: "Personal Care", revenue: 35, growth: 18 },
  { category: "Food & Bev", revenue: 28, growth: 8 },
  { category: "Baby Care", revenue: 15, growth: 22 },
];

const kpis = [
  { label: "Monthly Revenue", value: "₦280M", change: "+16.7%", icon: DollarSign },
  { label: "Retailer Coverage", value: "4,280", change: "+342", icon: ShoppingCart },
  { label: "Product Availability", value: "94.2%", change: "+2.1%", icon: Package },
  { label: "Order Fulfillment", value: "2.4 days", change: "-0.3d", icon: Truck },
];

const ConsumerDashboard = () => (
  <IndustryLayout industryCode="consumer">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Consumer Goods OS</h1>
          <p className="text-muted-foreground">Distribution intelligence for consumer goods networks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <k.icon className="w-5 h-5 text-teal-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">{k.value}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <Badge variant="secondary" className="text-emerald-600 bg-emerald-50 text-xs">{k.change}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-teal-500" />Revenue vs Target</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="Revenue (₦M)" />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" fill="transparent" strokeDasharray="5 5" name="Target (₦M)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Category Performance</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryPerf}>
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue (₦M)" />
                <Bar dataKey="growth" fill="#10b981" name="Growth %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default ConsumerDashboard;
