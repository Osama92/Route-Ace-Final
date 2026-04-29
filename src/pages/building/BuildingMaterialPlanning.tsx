import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

const materials = [
  { name: "Portland Cement (42.5R)", sku: "CEM-425R", required: 5000, ordered: 4200, delivered: 3800, unit: "bags", stage: "Superstructure", urgency: "medium" },
  { name: "Steel Rebar 12mm", sku: "STL-RB12", required: 200, ordered: 200, delivered: 180, unit: "tons", stage: "Foundation", urgency: "high" },
  { name: "Ceramic Floor Tiles 60x60", sku: "TIL-CF60", required: 8000, ordered: 5000, delivered: 2000, unit: "sqm", stage: "Finishing", urgency: "low" },
  { name: "Emulsion Paint (White)", sku: "PNT-EMW", required: 1500, ordered: 0, delivered: 0, unit: "ltrs", stage: "Finishing", urgency: "low" },
  { name: "PVC Pipes 4-inch", sku: "PLB-PVC4", required: 800, ordered: 800, delivered: 600, unit: "lengths", stage: "MEP", urgency: "medium" },
  { name: "Electrical Cable 2.5mm", sku: "ELC-CB25", required: 5000, ordered: 3000, delivered: 2500, unit: "meters", stage: "MEP", urgency: "medium" },
];

const BuildingMaterialPlanning = () => (
  <IndustryLayout industryCode="building">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Package className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Material Requirement Planning</h1>
          <p className="text-muted-foreground">Plan and track material requirements by project stage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-foreground">₦847M</p><p className="text-xs text-muted-foreground">Total Material Value</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-foreground">78%</p><p className="text-xs text-muted-foreground">Fulfillment Rate</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-foreground">12</p><p className="text-xs text-muted-foreground">Pending Orders</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-amber-500" />Material Requirements</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground">Material</th>
                <th className="text-left p-3 text-muted-foreground">Stage</th>
                <th className="text-right p-3 text-muted-foreground">Required</th>
                <th className="text-right p-3 text-muted-foreground">Ordered</th>
                <th className="text-right p-3 text-muted-foreground">Delivered</th>
                <th className="text-center p-3 text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {materials.map((m) => (
                  <tr key={m.sku} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3"><p className="font-medium text-foreground">{m.name}</p><p className="text-xs text-muted-foreground">{m.sku}</p></td>
                    <td className="p-3"><Badge variant="outline">{m.stage}</Badge></td>
                    <td className="p-3 text-right text-foreground">{m.required.toLocaleString()} {m.unit}</td>
                    <td className="p-3 text-right text-foreground">{m.ordered.toLocaleString()}</td>
                    <td className="p-3 text-right text-foreground">{m.delivered.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      {m.delivered >= m.required ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> :
                       m.urgency === "high" ? <AlertTriangle className="w-4 h-4 text-red-500 mx-auto" /> :
                       <Badge variant={m.urgency === "medium" ? "secondary" : "outline"}>{m.urgency}</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BuildingMaterialPlanning;
