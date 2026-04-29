import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wine, Search, Package, TrendingUp, AlertTriangle, Filter, DollarSign, Percent } from "lucide-react";

const catalog = [
  { name: "Hennessy VS 750ml", sku: "HEN-VS-750", category: "Cognac", caseSize: 12, unitPrice: "₦18,500", casePrice: "₦222,000", margin: 38, stock: 2840, velocity: 96, status: "active" },
  { name: "Johnnie Walker Black 1L", sku: "JWB-1000", category: "Scotch Whisky", caseSize: 12, unitPrice: "₦14,200", casePrice: "₦170,400", margin: 35, stock: 2120, velocity: 91, status: "active" },
  { name: "Smirnoff Vodka 1L", sku: "SMN-1000", category: "Vodka", caseSize: 12, unitPrice: "₦4,800", casePrice: "₦57,600", margin: 28, stock: 1980, velocity: 88, status: "active" },
  { name: "Baileys Original 750ml", sku: "BAI-750", category: "Liqueur", caseSize: 12, unitPrice: "₦8,200", casePrice: "₦98,400", margin: 42, stock: 1540, velocity: 82, status: "active" },
  { name: "Guinness FES 600ml", sku: "GN-FES-600", category: "Stout", caseSize: 24, unitPrice: "₦650", casePrice: "₦15,600", margin: 22, stock: 8200, velocity: 94, status: "active" },
  { name: "Moët & Chandon Brut", sku: "MOE-BRT-750", category: "Champagne", caseSize: 6, unitPrice: "₦42,000", casePrice: "₦252,000", margin: 45, stock: 320, velocity: 64, status: "active" },
  { name: "Rémy Martin VSOP 700ml", sku: "REM-VSOP-700", category: "Cognac", caseSize: 12, unitPrice: "₦22,800", casePrice: "₦273,600", margin: 36, stock: 890, velocity: 72, status: "active" },
  { name: "Gordon's London Dry 750ml", sku: "GOR-LD-750", category: "Gin", caseSize: 12, unitPrice: "₦3,200", casePrice: "₦38,400", margin: 25, stock: 4500, velocity: 86, status: "active" },
];

const categories = [
  { name: "Whisky & Scotch", skus: 42, revenue: "₦12.4M", share: 29 },
  { name: "Cognac & Brandy", skus: 28, revenue: "₦10.8M", share: 25 },
  { name: "Vodka", skus: 18, revenue: "₦4.2M", share: 10 },
  { name: "Gin", skus: 22, revenue: "₦3.8M", share: 9 },
  { name: "Beer & Stout", skus: 35, revenue: "₦8.6M", share: 20 },
  { name: "Wine & Champagne", skus: 24, revenue: "₦2.8M", share: 7 },
];

const LiquorCaseCatalog = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Case Catalog</h1>
            <p className="text-sm text-muted-foreground">Beverage portfolio with case pricing & velocity metrics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search SKUs..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Category</Button>
        </div>
      </div>

      {/* Category overview */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <Card key={cat.name} className="cursor-pointer hover:border-rose-500/30 transition-colors">
            <CardContent className="pt-4 pb-3 text-center">
              <p className="text-sm font-semibold">{cat.name}</p>
              <p className="text-lg font-bold mt-1">{cat.revenue}</p>
              <p className="text-xs text-muted-foreground">{cat.skus} SKUs · {cat.share}% share</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product table */}
      <Card>
        <CardHeader><CardTitle>Active Products — {catalog.length} SKUs</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {catalog.map((p) => (
              <div key={p.sku} className="flex items-center justify-between py-3 border-b last:border-0 border-border/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <Wine className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku} · {p.category} · {p.caseSize}/case</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{p.casePrice}</p>
                    <p className="text-xs text-muted-foreground">{p.unitPrice}/unit</p>
                  </div>
                  <div className="w-16 text-center">
                    <p className="text-sm font-bold">{p.stock.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">cases</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{p.velocity}% vel</Badge>
                  <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    <Percent className="w-3 h-3 mr-0.5" />{p.margin}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorCaseCatalog;
