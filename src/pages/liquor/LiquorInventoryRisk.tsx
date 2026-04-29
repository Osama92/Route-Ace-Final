import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Package, Clock, TrendingDown } from "lucide-react";

const stockoutRisks = [
  { retailer: "Bar Central Lagos", product: "Hennessy VS 70cl", daysLeft: 3, riskScore: 94, weeklyVelocity: 18, currentStock: 8, reorderQty: 24 },
  { retailer: "Club Vibe Abuja", product: "Johnnie Walker Black", daysLeft: 5, riskScore: 87, weeklyVelocity: 12, currentStock: 9, reorderQty: 18 },
  { retailer: "Ocean Bar PH", product: "Smirnoff Vodka 1L", daysLeft: 2, riskScore: 96, weeklyVelocity: 22, currentStock: 6, reorderQty: 30 },
  { retailer: "Nite Owl Ibadan", product: "Jack Daniels 70cl", daysLeft: 7, riskScore: 72, weeklyVelocity: 8, currentStock: 8, reorderQty: 12 },
  { retailer: "Sky Lounge Victoria Island", product: "Grey Goose 75cl", daysLeft: 4, riskScore: 89, weeklyVelocity: 6, currentStock: 3, reorderQty: 10 },
  { retailer: "The Grill House Lekki", product: "Baileys 70cl", daysLeft: 6, riskScore: 78, weeklyVelocity: 10, currentStock: 9, reorderQty: 14 },
];

const riskSummary = [
  { label: "Critical (< 3 days)", count: 2, color: "text-red-500" },
  { label: "High Risk (3-5 days)", count: 3, color: "text-orange-500" },
  { label: "Monitor (5-7 days)", count: 1, color: "text-yellow-500" },
];

const LiquorInventoryRisk = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-destructive" /> Inventory Risk Prediction
          </h2>
          <p className="text-sm text-muted-foreground mt-1">AI-predicted stockout risks across the retail network</p>
        </div>
        <Badge variant="destructive">{stockoutRisks.filter(r => r.daysLeft <= 3).length} Critical Alerts</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {riskSummary.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
              </div>
              <Package className={`w-8 h-8 ${s.color} opacity-40`} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingDown className="w-4 h-4" /> Predicted Stockouts</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockoutRisks.map((r, i) => (
              <div key={i} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{r.retailer}</p>
                    <p className="text-sm text-muted-foreground">{r.product}</p>
                  </div>
                  <Badge variant={r.daysLeft <= 3 ? "destructive" : r.daysLeft <= 5 ? "secondary" : "outline"}>
                    <Clock className="w-3 h-3 mr-1" />{r.daysLeft} days left
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-xs mb-2">
                  <div><span className="text-muted-foreground">Risk Score</span><p className="text-lg font-bold text-foreground">{r.riskScore}%</p></div>
                  <div><span className="text-muted-foreground">Weekly Velocity</span><p className="text-lg font-bold text-foreground">{r.weeklyVelocity}</p></div>
                  <div><span className="text-muted-foreground">Current Stock</span><p className="text-lg font-bold text-foreground">{r.currentStock}</p></div>
                  <div><span className="text-muted-foreground">Reorder Qty</span><p className="text-lg font-bold text-primary">{r.reorderQty}</p></div>
                </div>
                <Progress value={r.riskScore} className="h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorInventoryRisk;
