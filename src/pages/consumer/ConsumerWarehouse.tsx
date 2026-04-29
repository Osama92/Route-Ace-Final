import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Package, AlertTriangle } from "lucide-react";

const inventory = [
  { category: "Home Care", skus: 48, stock: 42000, capacity: 50000, nearExpiry: 1200, turnover: 6.2 },
  { category: "Personal Care", skus: 65, stock: 38000, capacity: 45000, nearExpiry: 800, turnover: 7.8 },
  { category: "Food & Beverages", skus: 82, stock: 55000, capacity: 60000, nearExpiry: 4200, turnover: 12.4 },
  { category: "Baby Care", skus: 24, stock: 12000, capacity: 15000, nearExpiry: 340, turnover: 5.1 },
  { category: "Household", skus: 36, stock: 28000, capacity: 35000, nearExpiry: 150, turnover: 4.8 },
];

const ConsumerWarehouse = () => (
  <IndustryLayout industryCode="consumer">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <Warehouse className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Warehouse Management</h1>
          <p className="text-muted-foreground">Inventory control, picking operations, and stock analytics</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-teal-500" />Inventory by Category</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.category} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-semibold text-foreground">{item.category}</p><p className="text-xs text-muted-foreground">{item.skus} SKUs • Turnover: {item.turnover}x</p></div>
                  <div className="flex gap-2">
                    {item.nearExpiry > 1000 && <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{item.nearExpiry} expiring</Badge>}
                    {item.nearExpiry <= 1000 && <Badge variant="outline">{item.nearExpiry} near-expiry</Badge>}
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

export default ConsumerWarehouse;
