import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wine, Lock, Clock, Star, ShoppingCart, AlertTriangle, CheckCircle, Bell } from "lucide-react";

const upcomingReleases = [
  { product: "Yamazaki 18 Year", brand: "Suntory", category: "Japanese Whisky", releaseDate: "Mar 20, 2026", allocation: 24, price: 420, status: "pre_order" },
  { product: "Blanton's Single Barrel", brand: "Buffalo Trace", category: "Bourbon", releaseDate: "Apr 1, 2026", allocation: 48, price: 65, status: "upcoming" },
  { product: "Dom Pérignon 2015", brand: "LVMH", category: "Champagne", releaseDate: "Mar 15, 2026", allocation: 12, price: 280, status: "live" },
  { product: "Patrón El Alto", brand: "Bacardi", category: "Tequila", releaseDate: "Apr 15, 2026", allocation: 36, price: 180, status: "upcoming" },
];

const allocationHistory = [
  { product: "Pappy Van Winkle 15yr", allocated: 6, requested: 24, fillRate: 25, revenue: 5400, date: "Feb 2026" },
  { product: "Louis XIII", allocated: 2, requested: 8, fillRate: 25, revenue: 7800, date: "Jan 2026" },
  { product: "Macallan 25yr", allocated: 4, requested: 16, fillRate: 25, revenue: 6800, date: "Dec 2025" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  live: { label: "Order Now", className: "bg-emerald-500/15 text-emerald-600" },
  pre_order: { label: "Pre-Order", className: "bg-blue-500/15 text-blue-600" },
  upcoming: { label: "Coming Soon", className: "bg-amber-500/15 text-amber-600" },
};

const LiquorAllocationReleases = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-600">
          <Wine className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Allocation & Limited Releases</h1>
          <p className="text-sm text-muted-foreground">Premium product allocations, pre-orders & release calendar</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Releases", value: "4", icon: Wine, color: "text-amber-500" },
          { label: "Pre-Orders", value: "12", icon: ShoppingCart, color: "text-blue-500" },
          { label: "Allocated Units", value: "120", icon: Lock, color: "text-primary" },
          { label: "Revenue (Alloc)", value: "$84K", icon: Star, color: "text-emerald-500" },
        ].map((k) => (
          <Card key={k.label}><CardContent className="p-4 text-center">
            <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
            <p className="text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="py-4 flex items-center gap-4">
          <Bell className="w-6 h-6 text-amber-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Dom Pérignon 2015 — Live Now</p>
            <p className="text-xs text-muted-foreground">12 units allocated to your organization. Order before Mar 15 to secure allocation.</p>
          </div>
          <Button size="sm">Order Now</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Upcoming Releases</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {upcomingReleases.map((r, i) => (
            <motion.div key={r.product} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="p-4 border rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Wine className="w-8 h-8 text-amber-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{r.product}</p>
                    <Badge variant="outline">{r.brand}</Badge>
                    <Badge className={statusConfig[r.status].className}>{statusConfig[r.status].label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{r.category} · Release: {r.releaseDate} · ${r.price}/bottle · {r.allocation} units allocated</p>
                </div>
              </div>
              {r.status === "live" ? (
                <Button size="sm">Order</Button>
              ) : r.status === "pre_order" ? (
                <Button size="sm" variant="outline">Pre-Order</Button>
              ) : (
                <Button size="sm" variant="ghost"><Bell className="w-4 h-4" /></Button>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Allocation History</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {allocationHistory.map((a, i) => (
            <motion.div key={a.product} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{a.product}</p>
                <p className="text-xs text-muted-foreground">{a.date} · Requested: {a.requested} · Allocated: {a.allocated} ({a.fillRate}% fill)</p>
              </div>
              <p className="font-bold text-sm">${a.revenue.toLocaleString()}</p>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorAllocationReleases;
