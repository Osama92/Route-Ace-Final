import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, FileText, Clock } from "lucide-react";

const orders = [
  { id: "PO-2401", supplier: "Dangote Cement", material: "Cement 42.5R", qty: "2000 bags", value: "₦12.4M", status: "approved", date: "2026-03-05" },
  { id: "PO-2402", supplier: "BUA Steel", material: "Rebar 12mm", qty: "50 tons", value: "₦45M", status: "pending", date: "2026-03-07" },
  { id: "PO-2403", supplier: "Rak Ceramics", material: "Floor Tiles", qty: "5000 sqm", value: "₦18.5M", status: "delivered", date: "2026-03-01" },
  { id: "PO-2404", supplier: "Berger Paints", material: "Emulsion Paint", qty: "1000 ltrs", value: "₦4.2M", status: "in_transit", date: "2026-03-06" },
];

const BuildingProcurement = () => (
  <IndustryLayout industryCode="building">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <ShoppingCart className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Contractor Procurement</h1>
          <p className="text-muted-foreground">Manage purchase orders and supplier relationships</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-amber-500" />Purchase Orders</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <p className="font-semibold text-foreground">{o.id} — {o.material}</p>
                  <p className="text-xs text-muted-foreground">{o.supplier} • {o.qty} • {o.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{o.value}</span>
                  <Badge variant={o.status === "delivered" ? "default" : o.status === "approved" ? "secondary" : o.status === "pending" ? "outline" : "default"}>
                    {o.status.replace("_", " ")}
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

export default BuildingProcurement;
