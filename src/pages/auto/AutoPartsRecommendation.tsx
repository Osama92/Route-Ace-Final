import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Car, Package } from "lucide-react";

const recommendations = [
  { vehicle: "Toyota Hilux 2020", issue: "Scheduled Service 60K", parts: ["Oil Filter", "Air Filter", "Brake Fluid", "Spark Plugs"], confidence: 98, totalCost: "₦42,500" },
  { vehicle: "MAN TGA 18.480", issue: "Clutch Replacement", parts: ["Clutch Plate HD", "Release Bearing", "Pilot Bush"], confidence: 94, totalCost: "₦380,000" },
  { vehicle: "Honda Accord 2019", issue: "Timing Belt Due", parts: ["Timing Belt Kit", "Water Pump", "Tensioner"], confidence: 96, totalCost: "₦85,000" },
  { vehicle: "Mercedes Actros", issue: "Brake System Overhaul", parts: ["Brake Pads HD", "Disc Rotors", "Brake Hoses", "ABS Sensor"], confidence: 92, totalCost: "₦520,000" },
];

const AutoPartsRecommendation = () => (
  <IndustryLayout industryCode="auto">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-zinc-800 flex items-center justify-center">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Parts Recommendation Engine</h1>
          <p className="text-muted-foreground">AI-powered parts suggestions based on vehicle and service needs</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Car className="w-5 h-5 text-zinc-500" />Active Recommendations</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((r) => (
              <div key={r.vehicle} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-semibold text-foreground">{r.vehicle}</p><p className="text-xs text-muted-foreground">{r.issue}</p></div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Confidence: {r.confidence}%</Badge>
                    <span className="text-sm font-medium text-foreground">{r.totalCost}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {r.parts.map((p) => (<Badge key={p} variant="outline" className="text-xs">{p}</Badge>))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AutoPartsRecommendation;
