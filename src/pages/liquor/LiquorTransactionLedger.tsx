import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  BookOpen, DollarSign, Package, Truck, Search, Filter,
  ArrowUpRight, ArrowDownRight, CheckCircle, Clock, ShieldCheck,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const transactions = [
  { id: "TXN-28941", type: "Order", from: "The Gold Barrel Lounge", to: "PrimeBev Distributors", amount: "₦1,842,000", items: 6, date: "Mar 8, 2026 · 14:22", status: "Completed", compliance: "Verified" },
  { id: "TXN-28940", type: "Payment", from: "Metro Wines & Spirits", to: "Lagos Spirits Co.", amount: "₦2,456,000", items: null, date: "Mar 8, 2026 · 13:45", status: "Completed", compliance: "Verified" },
  { id: "TXN-28939", type: "Delivery", from: "PrimeBev Distributors", to: "Skyline Nightclub", amount: "₦4,200,000", items: 12, date: "Mar 8, 2026 · 12:30", status: "Confirmed", compliance: "Age Verified" },
  { id: "TXN-28938", type: "Promotion", from: "Diageo Nigeria", to: "18 Distributors", amount: "₦3,200,000", items: null, date: "Mar 8, 2026 · 11:00", status: "Activated", compliance: "N/A" },
  { id: "TXN-28937", type: "Credit", from: "Trade Finance Hub", to: "Corner Liquors Express", amount: "₦2,000,000", items: null, date: "Mar 8, 2026 · 10:15", status: "Disbursed", compliance: "KYC Verified" },
  { id: "TXN-28936", type: "Order", from: "La Maison Bistro", to: "Peninsula Wines", amount: "₦968,000", items: 4, date: "Mar 7, 2026 · 16:42", status: "Completed", compliance: "Verified" },
  { id: "TXN-28935", type: "Allocation", from: "Moët Hennessy", to: "6 Distributors", amount: "₦12,600,000", items: 200, date: "Mar 7, 2026 · 09:00", status: "Distributed", compliance: "License Verified" },
  { id: "TXN-28934", type: "Payment", from: "Supreme Beverages", to: "NorthCity Beverages", amount: "₦1,680,000", items: null, date: "Mar 7, 2026 · 08:30", status: "Completed", compliance: "Verified" },
];

const volumeData = [
  { day: "Mon", orders: 142, payments: 98, deliveries: 124 },
  { day: "Tue", orders: 168, payments: 112, deliveries: 148 },
  { day: "Wed", orders: 156, payments: 134, deliveries: 132 },
  { day: "Thu", orders: 184, payments: 148, deliveries: 162 },
  { day: "Fri", orders: 248, payments: 186, deliveries: 198 },
  { day: "Sat", orders: 312, payments: 124, deliveries: 268 },
  { day: "Sun", orders: 86, payments: 42, deliveries: 64 },
];

const typeIcons: Record<string, typeof Package> = {
  Order: Package,
  Payment: DollarSign,
  Delivery: Truck,
  Promotion: ArrowUpRight,
  Credit: DollarSign,
  Allocation: ShieldCheck,
};

const typeColors: Record<string, string> = {
  Order: "text-primary",
  Payment: "text-emerald-500",
  Delivery: "text-blue-500",
  Promotion: "text-amber-500",
  Credit: "text-purple-500",
  Allocation: "text-rose-500",
};

const LiquorTransactionLedger = () => {
  const [search, setSearch] = useState("");

  const filtered = transactions.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.from.toLowerCase().includes(search.toLowerCase()) ||
    t.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Transaction Ledger</h1>
          <p className="text-sm text-muted-foreground">Complete audit trail of all commerce activity across the exchange</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Today's Transactions", value: "1,247", icon: BookOpen, color: "text-primary" },
            { label: "Total Value (Today)", value: "₦486M", icon: DollarSign, color: "text-emerald-500" },
            { label: "Compliance Rate", value: "99.8%", icon: ShieldCheck, color: "text-blue-500" },
            { label: "Avg Settlement", value: "4.2 hrs", icon: Clock, color: "text-amber-500" },
          ].map(k => (
            <Card key={k.label}>
              <CardContent className="p-3 text-center">
                <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Volume Chart */}
        <Card>
          <CardHeader><CardTitle className="text-sm">Weekly Transaction Volume</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} name="Orders" />
                <Area type="monotone" dataKey="payments" stroke="hsl(142 76% 36%)" fill="hsl(142 76% 36%)" fillOpacity={0.1} strokeWidth={2} name="Payments" />
                <Area type="monotone" dataKey="deliveries" stroke="hsl(217 91% 60%)" fill="hsl(217 91% 60%)" fillOpacity={0.1} strokeWidth={2} name="Deliveries" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Transaction List */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter</Button>
          </div>

          {filtered.map((t, i) => {
            const Icon = typeIcons[t.type] || Package;
            const color = typeColors[t.type] || "text-muted-foreground";
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{t.id}</p>
                          <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.from} → {t.to} · {t.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm">{t.amount}</span>
                      <Badge className="bg-emerald-500/15 text-emerald-600 text-[10px]">{t.compliance}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </IndustryLayout>
  );
};

export default LiquorTransactionLedger;
