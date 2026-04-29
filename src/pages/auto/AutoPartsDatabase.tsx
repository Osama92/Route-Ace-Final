import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Search, Car, Wrench } from "lucide-react";

const parts = [
  { name: "Brake Pad Set — Front", oem: "Toyota Camry 2018-2024", sku: "BRK-TOY-F01", compat: 12, stock: 450, price: "₦18,500" },
  { name: "Oil Filter", oem: "Honda Accord 2016-2023", sku: "FLT-HON-O01", compat: 8, stock: 1200, price: "₦4,200" },
  { name: "Alternator Assembly", oem: "Mercedes C-Class W205", sku: "ALT-MER-C01", compat: 3, stock: 24, price: "₦185,000" },
  { name: "Timing Belt Kit", oem: "Hyundai Elantra 2017-2022", sku: "TBK-HYU-E01", compat: 6, stock: 180, price: "₦42,000" },
  { name: "Engine Oil 5W-30 (4L)", oem: "Universal", sku: "LUB-UNV-530", compat: 50, stock: 3200, price: "₦12,800" },
  { name: "Clutch Plate — Heavy Duty", oem: "MAN TGA Truck", sku: "CLT-MAN-HD1", compat: 4, stock: 35, price: "₦280,000" },
];

const AutoPartsDatabase = () => (
  <IndustryLayout industryCode="auto">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-zinc-800 flex items-center justify-center">
          <Database className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Vehicle Compatibility Database</h1>
          <p className="text-muted-foreground">Search parts by vehicle make, model, and VIN compatibility</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">24,800</p><p className="text-xs text-muted-foreground">Parts in Database</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">1,240</p><p className="text-xs text-muted-foreground">Vehicle Models</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">97.2%</p><p className="text-xs text-muted-foreground">Fit Accuracy</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">42</p><p className="text-xs text-muted-foreground">OEM Brands</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-5 h-5 text-zinc-500" />Parts Catalog</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {parts.map((p) => (
              <div key={p.sku} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.oem} • SKU: {p.sku} • {p.compat} compatible vehicles</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{p.stock} in stock</span>
                  <span className="text-sm font-medium text-foreground">{p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AutoPartsDatabase;
