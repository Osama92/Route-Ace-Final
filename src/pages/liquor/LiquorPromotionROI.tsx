import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Megaphone, DollarSign, TrendingUp, Target, ArrowUpRight } from "lucide-react";

const campaigns = [
  { name: "Hennessy Summer Nights", brand: "Hennessy", spend: "₦4.2M", predictedROI: 3.8, actualROI: 4.1, demandLift: "+42%", status: "completed", retailers: 180 },
  { name: "Craft Beer Discovery", brand: "Craft Beer Co", spend: "₦1.8M", predictedROI: 2.4, actualROI: null, demandLift: "+28%", status: "active", retailers: 86 },
  { name: "Premium Whiskey Week", brand: "Johnnie Walker", spend: "₦3.5M", predictedROI: 3.2, actualROI: 2.9, demandLift: "+34%", status: "completed", retailers: 220 },
  { name: "Tequila Tuesdays", brand: "Jose Cuervo", spend: "₦2.1M", predictedROI: 2.8, actualROI: null, demandLift: "+22%", status: "planned", retailers: 120 },
  { name: "Aperol Spritz Season", brand: "Aperol", spend: "₦2.8M", predictedROI: 4.2, actualROI: null, demandLift: "+52%", status: "planned", retailers: 160 },
];

const roiChart = [
  { campaign: "Hennessy", predicted: 3.8, actual: 4.1 },
  { campaign: "Craft Beer", predicted: 2.4, actual: 0 },
  { campaign: "JW Week", predicted: 3.2, actual: 2.9 },
  { campaign: "Tequila", predicted: 2.8, actual: 0 },
  { campaign: "Aperol", predicted: 4.2, actual: 0 },
];

const LiquorPromotionROI = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="w-6 h-6 text-primary" /> Promotion ROI Predictor
        </h2>
        <p className="text-sm text-muted-foreground mt-1">AI-estimated campaign performance and demand lift before launch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">₦14.4M</p>
            <p className="text-xs text-muted-foreground">Total Campaign Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">3.3x</p>
            <p className="text-xs text-muted-foreground">Avg Predicted ROI</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">766</p>
            <p className="text-xs text-muted-foreground">Retailers Targeted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Predicted vs Actual ROI</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roiChart}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
              <XAxis dataKey="campaign" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="predicted" fill="hsl(var(--primary))" name="Predicted ROI" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="hsl(var(--accent))" name="Actual ROI" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Campaign Intelligence</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns.map((c, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.brand} • {c.retailers} retailers</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">Spend</p>
                    <p className="font-semibold text-foreground">{c.spend}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">Predicted ROI</p>
                    <p className="font-semibold text-primary">{c.predictedROI}x</p>
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">Demand Lift</p>
                    <p className="font-semibold text-emerald-500">{c.demandLift}</p>
                  </div>
                  <Badge variant={c.status === "completed" ? "default" : c.status === "active" ? "secondary" : "outline"}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorPromotionROI;
