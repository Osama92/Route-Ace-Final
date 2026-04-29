import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Package } from "lucide-react";

const inventory = [
  { category: "Brake Components", skus: 148, stock: 12400, value: "₦186M", turnover: 4.2 },
  { category: "Engine Parts", skus: 220, stock: 8200, value: "₦412M", turnover: 3.1 },
  { category: "Filters & Fluids", skus: 85, stock: 28000, value: "₦92M", turnover: 8.5 },
  { category: "Transmission", skus: 95, stock: 3200, value: "₦245M", turnover: 2.4 },
  { category: "Electrical", skus: 180, stock: 15800, value: "₦128M", turnover: 5.2 },
  { category: "Lubricants", skus: 42, stock: 45000, value: "₦156M", turnover: 12.1 },
];

const AutoWarehouse = () => (
  <IndustryLayout industryCode="auto">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-zinc-800 flex items-center justify-center">
          <Warehouse className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Parts Warehouse</h1>
          <p className="text-muted-foreground">Inventory management for auto parts and lubricants</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-zinc-500" />Inventory by Category</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.category} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-semibold text-foreground">{item.category}</p><p className="text-xs text-muted-foreground">{item.skus} SKUs • {item.stock.toLocaleString()} units</p></div>
                  <div className="flex gap-3 text-sm"><span className="text-muted-foreground">Value: {item.value}</span><Badge variant="outline">Turn: {item.turnover}x</Badge></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AutoWarehouse;
