import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, Sun, CloudRain, Thermometer, Leaf, Target, Brain, MapPin } from "lucide-react";

const advisories = [
  { title: "Early Planting Advisory — Kaduna Zone", crop: "Maize", recommendation: "Begin planting by March 15. Apply NPK 15:15:15 at 150kg/ha during land preparation.", urgency: "high", confidence: 92 },
  { title: "Pest Alert — Fall Armyworm Risk", crop: "Maize, Sorghum", recommendation: "Apply Emamectin benzoate at first sign of infestation. Monitor fields daily.", urgency: "critical", confidence: 88 },
  { title: "Fertilizer Timing — Rice Fields", crop: "Rice", recommendation: "Apply Urea top-dressing at 30 days after transplanting. Rate: 100kg/ha.", urgency: "medium", confidence: 85 },
  { title: "Irrigation Advisory — Dry Spell Expected", crop: "All crops", recommendation: "Expect 14-day dry spell in Sokoto/Zamfara. Ensure irrigation capacity for 3 weeks.", urgency: "high", confidence: 79 },
  { title: "Harvest Window — Early Maize", crop: "Maize", recommendation: "Kaduna early-planted maize approaching maturity. Schedule harvest in 2-3 weeks.", urgency: "medium", confidence: 91 },
];

const soilData = [
  { zone: "Kaduna North", ph: 6.2, nitrogen: "Medium", phosphorus: "Low", organic: "2.1%", recommendation: "Apply DAP" },
  { zone: "Kano Central", ph: 7.1, nitrogen: "Low", phosphorus: "Medium", organic: "1.8%", recommendation: "Apply Urea + SSP" },
  { zone: "Benue Valley", ph: 5.8, nitrogen: "High", phosphorus: "Medium", organic: "3.4%", recommendation: "Lime application" },
  { zone: "Oyo West", ph: 6.5, nitrogen: "Medium", phosphorus: "High", organic: "2.6%", recommendation: "Reduce P fertilizer" },
];

const AgriFarmAdvisory = () => (
  <IndustryLayout industryCode="agri">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-lime-600 flex items-center justify-center">
          <Leaf className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Farm Advisory System</h1>
          <p className="text-muted-foreground">AI-powered crop recommendations, soil analytics, and input advisory</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Advisories", value: "18", icon: Brain, color: "text-green-500" },
          { label: "Zones Covered", value: "42", icon: MapPin, color: "text-blue-500" },
          { label: "Soil Tests", value: "1,240", icon: Sprout, color: "text-amber-500" },
          { label: "Adoption Rate", value: "72%", icon: Target, color: "text-violet-500" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Advisories */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-green-500" />Active Crop Advisories</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {advisories.map((a, i) => (
            <div key={i} className={`p-4 rounded-xl border ${a.urgency === "critical" ? "border-destructive/30 bg-destructive/5" : a.urgency === "high" ? "border-amber-500/30 bg-amber-500/5" : "border-border/50"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Crop: {a.crop}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={a.urgency === "critical" ? "destructive" : a.urgency === "high" ? "secondary" : "outline"} className="text-[10px]">{a.urgency}</Badge>
                  <Badge variant="outline" className="text-[10px]">{a.confidence}% conf.</Badge>
                </div>
              </div>
              <p className="text-xs text-foreground mt-2 bg-muted/30 p-2 rounded">{a.recommendation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Soil Analytics */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Sprout className="w-5 h-5 text-amber-500" />Soil Analytics Summary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {soilData.map((s) => (
              <div key={s.zone} className="p-4 rounded-xl border border-border/50">
                <p className="font-medium text-sm text-foreground">{s.zone}</p>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <div><p className="text-[10px] text-muted-foreground">pH</p><p className="text-sm font-bold">{s.ph}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">N</p><p className="text-sm font-bold">{s.nitrogen}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">P</p><p className="text-sm font-bold">{s.phosphorus}</p></div>
                  <div><p className="text-[10px] text-muted-foreground">Organic</p><p className="text-sm font-bold">{s.organic}</p></div>
                </div>
                <p className="text-xs text-emerald-500 mt-2">→ {s.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AgriFarmAdvisory;
