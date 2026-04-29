import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Wine, Beer, Package, Star, TrendingUp, ShoppingCart, Filter,
  Search, Globe, Zap, DollarSign, Percent, Tag, ChevronRight,
} from "lucide-react";

const suppliers = [
  { name: "Diageo Nigeria", type: "Global Distiller", brands: 24, rating: 4.9, totalSKUs: 186, territory: "Nationwide", logo: "🥃", verified: true },
  { name: "Pernod Ricard West Africa", type: "Global Distiller", brands: 18, rating: 4.8, totalSKUs: 142, territory: "Nationwide", logo: "🍷", verified: true },
  { name: "Nigerian Breweries (Heineken)", type: "Brewery", brands: 12, rating: 4.7, totalSKUs: 68, territory: "Nationwide", logo: "🍺", verified: true },
  { name: "Bacardi Africa", type: "Global Distiller", brands: 14, rating: 4.6, totalSKUs: 94, territory: "West Africa", logo: "🥂", verified: true },
  { name: "Moët Hennessy", type: "Luxury Spirits", brands: 8, rating: 4.9, totalSKUs: 52, territory: "Premium Markets", logo: "🍾", verified: true },
  { name: "Grand Oak Distillery", type: "Local Distiller", brands: 4, rating: 4.2, totalSKUs: 28, territory: "Nigeria", logo: "🥃", verified: true },
];

const catalog = [
  { sku: "HEN-VS-70CL", name: "Hennessy VS 70cl", supplier: "Diageo Nigeria", category: "Cognac", unitPrice: "₦28,500", casePrice: "₦324,000", casePack: 12, moq: 5, stock: "In Stock", allocation: "Open", incentive: "5+1 Free", velocity: 8.2 },
  { sku: "JWB-70CL", name: "Johnnie Walker Black 70cl", supplier: "Diageo Nigeria", category: "Scotch", unitPrice: "₦24,800", casePrice: "₦285,600", casePack: 12, moq: 3, stock: "In Stock", allocation: "Open", incentive: null, velocity: 7.1 },
  { sku: "GG-75CL", name: "Grey Goose Vodka 75cl", supplier: "Bacardi Africa", category: "Vodka", unitPrice: "₦32,000", casePrice: "₦192,000", casePack: 6, moq: 2, stock: "Low Stock", allocation: "Open", incentive: "10% Volume Discount", velocity: 6.8 },
  { sku: "MC-75CL", name: "Moët & Chandon Brut 75cl", supplier: "Moët Hennessy", category: "Champagne", unitPrice: "₦42,000", casePrice: "₦252,000", casePack: 6, moq: 1, stock: "In Stock", allocation: "Allocated", incentive: null, velocity: 5.4 },
  { sku: "CRC-70CL", name: "Ciroc Vodka 70cl", supplier: "Diageo Nigeria", category: "Vodka", unitPrice: "₦28,000", casePrice: "₦168,000", casePack: 6, moq: 2, stock: "In Stock", allocation: "Open", incentive: "Display Bonus ₦50K", velocity: 5.8 },
  { sku: "HNK-33CL", name: "Heineken Lager 33cl x 24", supplier: "Nigerian Breweries", category: "Beer", unitPrice: "₦650", casePrice: "₦15,600", casePack: 24, moq: 10, stock: "In Stock", allocation: "Open", incentive: "Buy 20 Get 2 Free", velocity: 14.2 },
  { sku: "GFES-60CL", name: "Guinness FES 60cl x 12", supplier: "Nigerian Breweries", category: "Stout", unitPrice: "₦980", casePrice: "₦11,760", casePack: 12, moq: 10, stock: "In Stock", allocation: "Open", incentive: null, velocity: 12.6 },
  { sku: "PT-75CL", name: "Patrón Silver 75cl", supplier: "Bacardi Africa", category: "Tequila", unitPrice: "₦38,500", casePrice: "₦231,000", casePack: 6, moq: 1, stock: "Limited", allocation: "Allocated", incentive: "Launch Promo 15% Off", velocity: 3.2 },
];

const LiquorSupplierMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<string[]>([]);

  const filteredCatalog = catalog.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Supplier Marketplace</h1>
            <p className="text-sm text-muted-foreground">Browse catalogs, place wholesale orders, access distributor incentives</p>
          </div>
          <Button disabled={cart.length === 0}>
            <ShoppingCart className="w-4 h-4 mr-1" /> Cart ({cart.length})
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Suppliers", value: "42", icon: Globe, color: "text-primary" },
            { label: "Available SKUs", value: "1,847", icon: Package, color: "text-blue-500" },
            { label: "Active Promotions", value: "28", icon: Tag, color: "text-emerald-500" },
            { label: "Avg Savings", value: "12.4%", icon: Percent, color: "text-amber-500" },
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

        <Tabs defaultValue="catalog" className="space-y-4">
          <TabsList>
            <TabsTrigger value="catalog">Product Catalog</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="incentives">Incentives</TabsTrigger>
          </TabsList>

          {/* Catalog */}
          <TabsContent value="catalog" className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search products, categories..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Filter</Button>
            </div>

            {filteredCatalog.map((item, i) => (
              <motion.div key={item.sku} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{item.name}</p>
                          <Badge variant="outline" className="text-[10px]">{item.sku}</Badge>
                          {item.allocation === "Allocated" && <Badge className="bg-purple-500/15 text-purple-600">Allocated</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.supplier} · {item.category}</p>
                      </div>
                      <Button size="sm" onClick={() => setCart(prev => [...prev, item.sku])} disabled={cart.includes(item.sku)}>
                        <ShoppingCart className="w-3 h-3 mr-1" /> {cart.includes(item.sku) ? "Added" : "Add to Cart"}
                      </Button>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { label: "Unit Price", value: item.unitPrice },
                        { label: "Case Price", value: item.casePrice },
                        { label: "Case Pack", value: `${item.casePack} units` },
                        { label: "MOQ", value: `${item.moq} cases` },
                        { label: "Velocity", value: `${item.velocity}/mo` },
                        { label: "Stock", value: item.stock },
                      ].map(m => (
                        <div key={m.label} className="text-center p-2 bg-muted/30 rounded-lg">
                          <p className="text-xs font-bold">{m.value}</p>
                          <p className="text-[10px] text-muted-foreground">{m.label}</p>
                        </div>
                      ))}
                    </div>
                    {item.incentive && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-emerald-500/10 rounded-lg">
                        <Zap className="w-3 h-3 text-emerald-600" />
                        <span className="text-xs text-emerald-700 font-medium">{item.incentive}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Suppliers */}
          <TabsContent value="suppliers" className="space-y-3">
            {suppliers.map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center text-2xl">{s.logo}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{s.name}</p>
                          {s.verified && <Badge className="bg-blue-500/15 text-blue-600 text-[10px]">Verified</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{s.type} · {s.territory}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">{s.totalSKUs} SKUs</p>
                        <p className="text-xs text-muted-foreground">{s.brands} brands</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium">{s.rating}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* Incentives */}
          <TabsContent value="incentives" className="space-y-3">
            {catalog.filter(c => c.incentive).map((item, i) => (
              <motion.div key={item.sku} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.supplier}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-emerald-500/15 text-emerald-600">{item.incentive}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Case Price: {item.casePrice}</p>
                      </div>
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

export default LiquorSupplierMarketplace;
