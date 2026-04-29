import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Target, TrendingUp, TrendingDown, Swords, MapPin, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const competitorSKUs = [
  { brand: "Competitor A — Premium Vodka", territory: "Lagos", marketShare: "22%", trend: "growing", velocity: 840, outlets: 142, threat: "High" },
  { brand: "Competitor B — Craft Gin", territory: "Lagos / Abuja", marketShare: "15%", trend: "growing", velocity: 520, outlets: 88, threat: "High" },
  { brand: "Competitor C — Local Whiskey", territory: "Nationwide", marketShare: "34%", trend: "stable", velocity: 1200, outlets: 320, threat: "Medium" },
  { brand: "Competitor D — RTD Cocktails", territory: "Lagos", marketShare: "8%", trend: "surging", velocity: 680, outlets: 65, threat: "Critical" },
  { brand: "Competitor E — Premium Beer", territory: "PH / Lagos", marketShare: "18%", trend: "declining", velocity: 450, outlets: 180, threat: "Low" },
  { brand: "Competitor F — Tequila Brand", territory: "Lagos", marketShare: "12%", trend: "growing", velocity: 380, outlets: 52, threat: "High" },
];

const categoryShare = [
  { category: "Whiskey", ours: 28, compA: 22, compB: 18, compC: 32 },
  { category: "Vodka", ours: 24, compA: 30, compB: 15, compC: 31 },
  { category: "Tequila", ours: 35, compA: 20, compB: 25, compC: 20 },
  { category: "Beer", ours: 18, compA: 25, compB: 22, compC: 35 },
  { category: "Wine", ours: 32, compA: 28, compB: 22, compC: 18 },
  { category: "RTD", ours: 15, compA: 35, compB: 28, compC: 22 },
];

const competitiveStrength = [
  { metric: "Distribution", ours: 82, competitor: 68 },
  { metric: "Brand Recall", ours: 75, competitor: 80 },
  { metric: "Price Value", ours: 70, competitor: 72 },
  { metric: "Outlet Coverage", ours: 88, competitor: 62 },
  { metric: "Promo Effectiveness", ours: 78, competitor: 65 },
  { metric: "Retailer Loyalty", ours: 85, competitor: 58 },
];

const territoryGaps = [
  { city: "Ibadan", ourOutlets: 42, compOutlets: 78, gap: -36, opportunity: "High — underserved market" },
  { city: "Benin City", ourOutlets: 28, compOutlets: 55, gap: -27, opportunity: "High — competitor expanding" },
  { city: "Enugu", ourOutlets: 35, compOutlets: 22, gap: +13, opportunity: "Defensive — maintain lead" },
  { city: "Abeokuta", ourOutlets: 18, compOutlets: 42, gap: -24, opportunity: "Medium — logistics barrier" },
  { city: "Kano (licensed)", ourOutlets: 8, compOutlets: 15, gap: -7, opportunity: "Low — regulatory risk" },
  { city: "Uyo", ourOutlets: 22, compOutlets: 18, gap: +4, opportunity: "Defensive — grow presence" },
];

const threatColor: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-500",
  High: "bg-orange-500/10 text-orange-500",
  Medium: "bg-yellow-500/10 text-yellow-500",
  Low: "bg-emerald-500/10 text-emerald-500",
};

const LiquorCompetitorIntel = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Swords className="w-6 h-6 text-primary" /> Competitor Intelligence
        </h2>
        <p className="text-sm text-muted-foreground mt-1">SKU tracking, market share analysis, and territorial gap detection vs competitors</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Competitor SKUs Tracked", value: "48", icon: Eye },
          { label: "Critical Threats", value: "3", icon: Target },
          { label: "Territory Gaps", value: "4", icon: MapPin },
          { label: "Categories Monitored", value: "6", icon: BarChart3 },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <kpi.icon className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Category Market Share Comparison</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryShare}>
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="ours" fill="hsl(var(--primary))" name="Our Network" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compA" fill="hsl(var(--chart-2))" name="Competitor A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compB" fill="hsl(var(--chart-3))" name="Competitor B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compC" fill="hsl(var(--chart-4))" name="Competitor C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Competitive Strength Radar</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={competitiveStrength}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Our Network" dataKey="ours" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                <Radar name="Top Competitor" dataKey="competitor" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.1} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Competitor SKU Table */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Eye className="w-4 h-4" /> Competitor SKU Tracker</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-muted-foreground">Brand / SKU</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Territory</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Share</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Trend</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Velocity</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Outlets</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Threat</th>
                </tr>
              </thead>
              <tbody>
                {competitorSKUs.map((c, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 font-medium text-foreground">{c.brand}</td>
                    <td className="text-center p-2"><Badge variant="outline" className="text-[10px]">{c.territory}</Badge></td>
                    <td className="text-center p-2 font-medium">{c.marketShare}</td>
                    <td className="text-center p-2">
                      <span className="flex items-center justify-center gap-1">
                        {c.trend === "growing" || c.trend === "surging" ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : c.trend === "declining" ? <TrendingDown className="w-3 h-3 text-red-500" /> : null}
                        <span className="text-[10px] capitalize">{c.trend}</span>
                      </span>
                    </td>
                    <td className="text-center p-2">{c.velocity}/mo</td>
                    <td className="text-center p-2">{c.outlets}</td>
                    <td className="text-center p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${threatColor[c.threat]}`}>{c.threat}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Territory Gap Analysis */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MapPin className="w-4 h-4" /> Territory Gap Analysis vs Competitors</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {territoryGaps.map((t, i) => (
              <div key={i} className={`p-3 rounded-lg border ${t.gap < 0 ? "border-red-500/20 bg-red-500/5" : "border-emerald-500/20 bg-emerald-500/5"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{t.city}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Our outlets: {t.ourOutlets} • Competitor: {t.compOutlets} • Gap: {t.gap > 0 ? "+" : ""}{t.gap}</p>
                  </div>
                  <Badge variant={t.gap < -20 ? "destructive" : t.gap < 0 ? "secondary" : "default"} className="text-[10px]">{t.opportunity}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorCompetitorIntel;
