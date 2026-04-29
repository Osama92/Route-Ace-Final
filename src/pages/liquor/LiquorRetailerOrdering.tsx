import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ShoppingCart, Search, Package, Clock, Truck, CheckCircle,
  Star, History, Tag, Zap, MapPin, CreditCard,
} from "lucide-react";

const quickOrderItems = [
  { name: "Hennessy VS 70cl", lastOrdered: "3 days ago", qty: 5, price: "₦30,200" },
  { name: "Grey Goose 75cl", lastOrdered: "1 week ago", qty: 2, price: "₦34,500" },
  { name: "Heineken 33cl x 24", lastOrdered: "2 days ago", qty: 12, price: "₦16,800" },
  { name: "Ciroc Vodka 70cl", lastOrdered: "5 days ago", qty: 3, price: "₦29,800" },
];

const activePromotions = [
  { product: "Hennessy VS 70cl", promo: "Buy 5 Cases Get 1 Free", expires: "7 days", savings: "₦324,000" },
  { product: "Heineken 33cl", promo: "Buy 20 Cases Get 2 Free", expires: "14 days", savings: "₦33,600" },
  { product: "Patrón Silver 75cl", promo: "Launch Promo — 15% Off", expires: "30 days", savings: "₦34,650/case" },
];

const orderHistory = [
  { id: "ORD-2024-4821", date: "Mar 5, 2026", items: 6, total: "₦1,842,000", status: "Delivered", delivery: "Same Day" },
  { id: "ORD-2024-4798", date: "Mar 2, 2026", items: 4, total: "₦968,000", status: "Delivered", delivery: "Next Day" },
  { id: "ORD-2024-4756", date: "Feb 27, 2026", items: 8, total: "₦2,456,000", status: "Delivered", delivery: "Same Day" },
  { id: "ORD-2024-4712", date: "Feb 22, 2026", items: 3, total: "₦724,000", status: "Delivered", delivery: "Next Day" },
  { id: "ORD-2024-4689", date: "Feb 18, 2026", items: 5, total: "₦1,124,000", status: "Delivered", delivery: "Same Day" },
];

const LiquorRetailerOrdering = () => {
  const [search, setSearch] = useState("");

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Retailer Ordering Portal</h1>
            <p className="text-sm text-muted-foreground">Place orders, track deliveries, access promotions — mobile-first</p>
          </div>
          <Button><ShoppingCart className="w-4 h-4 mr-1" /> New Order</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Orders This Month", value: "12", icon: Package, color: "text-primary" },
            { label: "Total Spend (MTD)", value: "₦8.4M", icon: CreditCard, color: "text-emerald-500" },
            { label: "Pending Deliveries", value: "2", icon: Truck, color: "text-blue-500" },
            { label: "Savings from Promos", value: "₦392K", icon: Tag, color: "text-amber-500" },
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

        <Tabs defaultValue="quick" className="space-y-4">
          <TabsList>
            <TabsTrigger value="quick">Quick Reorder</TabsTrigger>
            <TabsTrigger value="promos">Promotions</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-3">
            <p className="text-sm text-muted-foreground">Based on your purchase history — one-tap reorder</p>
            {quickOrderItems.map((item, i) => (
              <motion.div key={item.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Last: {item.lastOrdered} · Qty: {item.qty} cases</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{item.price}/case</span>
                      <Button size="sm"><Zap className="w-3 h-3 mr-1" /> Reorder</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="promos" className="space-y-3">
            {activePromotions.map((p, i) => (
              <motion.div key={p.product} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{p.product}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          <span className="text-sm text-emerald-700 font-medium">{p.promo}</span>
                        </div>
                      </div>
                      <Button size="sm"><ShoppingCart className="w-3 h-3 mr-1" /> Order Now</Button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>Expires in {p.expires}</span>
                      <span>Savings: {p.savings}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="history" className="space-y-2">
            {orderHistory.map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="font-medium text-sm">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.date} · {o.items} items · {o.delivery}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{o.total}</span>
                      <Badge className="bg-emerald-500/15 text-emerald-600">{o.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </IndustryLayout>
  );
};

export default LiquorRetailerOrdering;
