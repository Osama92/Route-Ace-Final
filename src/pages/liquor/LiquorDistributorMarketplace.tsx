import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Package, Truck, MapPin, Clock, Search, Filter, ShoppingCart,
  Star, TrendingUp, Zap, Wine, Beer, CheckCircle,
} from "lucide-react";

const inventory = [
  { product: "Hennessy VS 70cl", distributor: "PrimeBev Distributors", zone: "Victoria Island", qty: 248, price: "₦30,200", delivery: "Same Day", freshness: "Fresh", popular: true },
  { product: "Grey Goose 75cl", distributor: "PrimeBev Distributors", zone: "Victoria Island", qty: 84, price: "₦34,500", delivery: "Same Day", freshness: "Fresh", popular: true },
  { product: "Johnnie Walker Black 70cl", distributor: "Lagos Spirits Co.", zone: "Lekki", qty: 412, price: "₦26,400", delivery: "Next Day", freshness: "Fresh", popular: true },
  { product: "Heineken 33cl x 24", distributor: "NorthCity Beverages", zone: "Ikeja", qty: 1240, price: "₦16,800", delivery: "Same Day", freshness: "Fresh", popular: false },
  { product: "Moët & Chandon Brut 75cl", distributor: "Peninsula Wines", zone: "Ikoyi", qty: 36, price: "₦45,000", delivery: "Next Day", freshness: "Fresh", popular: false },
  { product: "Ciroc Vodka 70cl", distributor: "PrimeBev Distributors", zone: "Victoria Island", qty: 156, price: "₦29,800", delivery: "Same Day", freshness: "Fresh", popular: true },
  { product: "Guinness FES 60cl x 12", distributor: "Mainland Drinks", zone: "Surulere", qty: 890, price: "₦12,400", delivery: "Same Day", freshness: "Fresh", popular: false },
  { product: "Patrón Silver 75cl", distributor: "Lagos Spirits Co.", zone: "Lekki", qty: 18, price: "₦42,000", delivery: "2–3 Days", freshness: "Limited", popular: false },
];

const deliverySlots = [
  { slot: "Morning (6AM–10AM)", available: true, surcharge: null },
  { slot: "Midday (10AM–2PM)", available: true, surcharge: null },
  { slot: "Afternoon (2PM–6PM)", available: true, surcharge: null },
  { slot: "Evening (6PM–10PM)", available: true, surcharge: "₦5,000" },
  { slot: "Night (10PM–6AM)", available: false, surcharge: null },
];

const LiquorDistributorMarketplace = () => {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<string[]>([]);

  const filtered = inventory.filter(i =>
    i.product.toLowerCase().includes(search.toLowerCase()) ||
    i.distributor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Distributor Inventory Marketplace</h1>
            <p className="text-sm text-muted-foreground">Real-time inventory from distributors — browse, order, schedule delivery</p>
          </div>
          <Button disabled={cart.length === 0}><ShoppingCart className="w-4 h-4 mr-1" /> Cart ({cart.length})</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Products Available", value: "1,247", icon: Package, color: "text-primary" },
            { label: "Distributors Online", value: "86", icon: Truck, color: "text-emerald-500" },
            { label: "Same-Day Delivery", value: "72%", icon: Clock, color: "text-blue-500" },
            { label: "Active Promotions", value: "34", icon: Zap, color: "text-amber-500" },
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

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Live Inventory</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Slots</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products or distributors..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter</Button>
            </div>

            {filtered.map((item, i) => (
              <motion.div key={`${item.product}-${item.distributor}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{item.product}</p>
                          {item.freshness === "Limited" && <Badge className="bg-amber-500/15 text-amber-600">Limited</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.distributor} · {item.zone}</p>
                      </div>
                      <Button size="sm" onClick={() => setCart(p => [...p, item.product])} disabled={cart.includes(item.product)}>
                        <ShoppingCart className="w-3 h-3 mr-1" /> Order
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-sm font-bold">{item.price}</p>
                        <p className="text-[10px] text-muted-foreground">Price</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-sm font-bold">{item.qty}</p>
                        <p className="text-[10px] text-muted-foreground">Available</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-sm font-bold">{item.delivery}</p>
                        <p className="text-[10px] text-muted-foreground">Delivery</p>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <p className="text-sm font-bold">{item.zone}</p>
                        <p className="text-[10px] text-muted-foreground">Zone</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="delivery" className="space-y-3">
            <Card>
              <CardHeader><CardTitle className="text-sm">Available Delivery Windows — Today</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {deliverySlots.map(s => (
                  <div key={s.slot} className={`flex items-center justify-between p-3 rounded-lg ${s.available ? "bg-muted/30" : "bg-muted/10 opacity-50"}`}>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${s.available ? "text-emerald-500" : "text-muted-foreground"}`} />
                      <span className="text-sm font-medium">{s.slot}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.surcharge && <Badge variant="outline" className="text-[10px]">+{s.surcharge}</Badge>}
                      {s.available ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600">Available</Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground">Unavailable</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular" className="space-y-3">
            {inventory.filter(i => i.popular).map((item, i) => (
              <motion.div key={item.product} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <p className="font-semibold">{item.product}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.distributor} · {item.delivery}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{item.price}</span>
                      <Button size="sm" variant="outline"><ShoppingCart className="w-3 h-3 mr-1" /> Order</Button>
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

export default LiquorDistributorMarketplace;
