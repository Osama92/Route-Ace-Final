import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Warehouse, Package, AlertTriangle, Thermometer } from "lucide-react";

const inventory = [
  { name: "Cement 42.5R", stock: 12000, capacity: 15000, unit: "bags", condition: "good", expiry: "N/A" },
  { name: "Steel Rebar (mixed)", stock: 450, capacity: 800, unit: "tons", condition: "good", expiry: "N/A" },
  { name: "Ceramic Tiles", stock: 18000, capacity: 25000, unit: "sqm", condition: "fragile", expiry: "N/A" },
  { name: "Emulsion Paint", stock: 3200, capacity: 5000, unit: "ltrs", condition: "temperature-sensitive", expiry: "2027-03" },
  { name: "PVC Pipes", stock: 2800, capacity: 4000, unit: "lengths", condition: "good", expiry: "N/A" },
  { name: "Electrical Cable", stock: 15000, capacity: 20000, unit: "meters", condition: "dry-store", expiry: "N/A" },
];

const BuildingWarehouse = () => (
  <IndustryLayout industryCode="building">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Warehouse className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Warehouse Operations</h1>
          <p className="text-muted-foreground">Manage construction material storage and inventory</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-amber-500" />Material Inventory</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.name} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.stock.toLocaleString()} / {item.capacity.toLocaleString()} {item.unit}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{item.condition}</Badge>
                    {item.expiry !== "N/A" && <Badge variant="secondary">Exp: {item.expiry}</Badge>}
                  </div>
                </div>
                <Progress value={(item.stock / item.capacity) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BuildingWarehouse;
