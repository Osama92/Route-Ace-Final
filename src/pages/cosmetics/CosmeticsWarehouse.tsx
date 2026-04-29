import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Package, AlertTriangle } from "lucide-react";

const inventory = [
  { name: "Foundation Range", sku: 24, stock: 18500, capacity: 25000, expiring: 320, condition: "climate-controlled" },
  { name: "Lipstick Collection", sku: 48, stock: 32000, capacity: 40000, expiring: 150, condition: "standard" },
  { name: "Skincare Serums", sku: 16, stock: 8200, capacity: 12000, expiring: 890, condition: "refrigerated" },
  { name: "Fragrances", sku: 12, stock: 4800, capacity: 8000, expiring: 45, condition: "dark-storage" },
  { name: "Hair Products", sku: 32, stock: 22000, capacity: 30000, expiring: 210, condition: "standard" },
];

const CosmeticsWarehouse = () => (
  <IndustryLayout industryCode="cosmetics">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Warehouse className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Beauty Warehouse</h1>
          <p className="text-muted-foreground">Inventory management for beauty and cosmetics products</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-pink-500" />Product Inventory</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.name} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-semibold text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{item.sku} SKUs • {item.condition}</p></div>
                  <div className="flex gap-2">
                    {item.expiring > 200 && <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{item.expiring} expiring</Badge>}
                    {item.expiring <= 200 && <Badge variant="outline">{item.expiring} expiring</Badge>}
                  </div>
                </div>
                <Progress value={(item.stock / item.capacity) * 100} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">{item.stock.toLocaleString()} / {item.capacity.toLocaleString()} units</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default CosmeticsWarehouse;
