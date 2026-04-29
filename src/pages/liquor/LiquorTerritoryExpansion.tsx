import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Target, MapPin, TrendingUp, Users, DollarSign, Brain,
  Zap, Globe, Truck, Wine, Beer, Martini, ArrowRight,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const expansionTargets = [
  {
    territory: "Lekki-Epe Corridor",
    city: "Lagos",
    score: 94,
    unservedOutlets: 386,
    currentCoverage: "18%",
    demand: "Very Strong",
    infra: "Good",
    opportunity: "₦48M/mo",
    topCategory: "Premium Spirits",
    nearestDist: "Lagos Spirits Co. (12km)",
    reason: "Fastest-growing residential + nightlife corridor. 14 new bars opened in 6 months.",
    competitors: 1,
  },
  {
    territory: "Abuja Maitama-Wuse",
    city: "Abuja",
    score: 91,
    unservedOutlets: 212,
    currentCoverage: "24%",
    demand: "Strong",
    infra: "Excellent",
    opportunity: "₦36M/mo",
    topCategory: "Champagne & Wine",
    nearestDist: "None (greenfield)",
    reason: "Diplomatic/expat district with premium drinking culture. No current distributor presence.",
    competitors: 0,
  },
  {
    territory: "Port Harcourt GRA",
    city: "Port Harcourt",
    score: 87,
    unservedOutlets: 178,
    currentCoverage: "32%",
    demand: "Strong",
    infra: "Moderate",
    opportunity: "₦28M/mo",
    topCategory: "Beer & Stout",
    nearestDist: "SouthBev (8km)",
    reason: "Oil & gas executive district. High purchasing power, underserved premium segment.",
    competitors: 2,
  },
  {
    territory: "Ibadan Ring Road",
    city: "Ibadan",
    score: 83,
    unservedOutlets: 294,
    currentCoverage: "12%",
    demand: "Moderate",
    infra: "Good",
    opportunity: "₦18M/mo",
    topCategory: "Value Spirits & Beer",
    nearestDist: "Mainland Drinks (22km)",
    reason: "Largest city by area with virtually zero formal distribution. High-volume opportunity.",
    competitors: 0,
  },
  {
    territory: "Enugu Independence Layout",
    city: "Enugu",
    score: 79,
    unservedOutlets: 142,
    currentCoverage: "28%",
    demand: "Moderate",
    infra: "Moderate",
    opportunity: "₦12M/mo",
    topCategory: "Beer & Spirits",
    nearestDist: "EastBev (6km)",
    reason: "Growing entertainment scene. University population driving cocktail culture emergence.",
    competitors: 1,
  },
];

const scoringWeights = [
  { factor: "Unserved Outlet Density", weight: 25 },
  { factor: "Revenue Potential", weight: 22 },
  { factor: "Category Demand", weight: 18 },
  { factor: "Infrastructure Quality", weight: 15 },
  { factor: "Competition Level", weight: 12 },
  { factor: "Logistics Feasibility", weight: 8 },
];

const LiquorTerritoryExpansion = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Territory Expansion Engine</h1>
            <p className="text-sm text-muted-foreground">AI-powered identification of high-potential new markets</p>
          </div>
          <Button><Globe className="w-4 h-4 mr-1" /> Generate Expansion Plan</Button>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Expansion Targets", value: "34", icon: Target, color: "text-primary" },
            { label: "Total Opportunity", value: "₦284M/mo", icon: DollarSign, color: "text-emerald-500" },
            { label: "Unserved Outlets", value: "1,842", icon: MapPin, color: "text-amber-500" },
            { label: "Greenfield Markets", value: "8", icon: Globe, color: "text-purple-500" },
          ].map(k => (
            <Card key={k.label}>
              <CardContent className="p-3 text-center">
                <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Expansion Map */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Expansion Opportunity Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/20 rounded-xl p-4 min-h-[280px]">
              <svg viewBox="0 0 700 280" className="w-full" preserveAspectRatio="xMidYMid meet">
                {/* Nigeria outline */}
                <ellipse cx="350" cy="140" rx="180" ry="120" fill="none" stroke="hsl(var(--border))" strokeWidth="1.5" strokeDasharray="6 4" />
                <text x="350" y="145" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="600">NIGERIA</text>

                {/* Territory nodes */}
                {expansionTargets.map((t, i) => {
                  const positions = [
                    { x: 280, y: 110 }, { x: 380, y: 80 }, { x: 460, y: 140 },
                    { x: 300, y: 160 }, { x: 420, y: 180 },
                  ];
                  const p = positions[i];
                  const color = t.score >= 90 ? "hsl(142 76% 36%)" : t.score >= 85 ? "hsl(217 91% 60%)" : "hsl(45 93% 47%)";
                  const r = Math.max(14, t.score / 5);
                  return (
                    <g key={t.territory}>
                      <circle cx={p.x} cy={p.y} r={r + 6} fill={color} opacity="0.15">
                        <animate attributeName="r" from={r + 2} to={r + 10} dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.2" to="0" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={p.x} cy={p.y} r="8" fill={color} />
                      <text x={p.x} y={p.y - 14} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="9" fontWeight="600">{t.territory.length > 20 ? t.territory.substring(0, 20) + "…" : t.territory}</text>
                      <text x={p.x} y={p.y + 20} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">{t.opportunity}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Expansion Targets */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Top Expansion Targets</h3>
          {expansionTargets.map((t, i) => (
            <motion.div key={t.territory} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{t.score}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{t.territory}</p>
                          <Badge variant="outline">{t.city}</Badge>
                          {t.competitors === 0 && <Badge className="bg-emerald-500/15 text-emerald-600">Greenfield</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.reason}</p>
                      </div>
                    </div>
                    <Button size="sm"><Zap className="w-3 h-3 mr-1" /> Expand</Button>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { label: "Outlets", value: String(t.unservedOutlets), icon: MapPin },
                      { label: "Coverage", value: t.currentCoverage, icon: Target },
                      { label: "Demand", value: t.demand, icon: TrendingUp },
                      { label: "Opportunity", value: t.opportunity, icon: DollarSign },
                      { label: "Top Category", value: t.topCategory.substring(0, 12), icon: Wine },
                      { label: "Competitors", value: String(t.competitors), icon: Users },
                    ].map(m => (
                      <div key={m.label} className="text-center p-2 bg-muted/30 rounded-lg">
                        <m.icon className="w-3 h-3 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-xs font-bold truncate">{m.value}</p>
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Scoring Model */}
        <Card>
          <CardHeader><CardTitle className="text-sm">AI Scoring Model — Factor Weights</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={scoringWeights} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 30]} fontSize={10} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="factor" fontSize={9} stroke="hsl(var(--muted-foreground))" width={140} />
                <Tooltip />
                <Bar dataKey="weight" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insight */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Expansion Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                Abuja Maitama-Wuse is a rare greenfield opportunity — zero distributor presence 
                in a ₦36M/month market. The Lekki-Epe Corridor shows highest urgency with 14 new 
                bars opening in 6 months. Recommend deploying a dedicated distributor with premium 
                spirits focus in both markets within 60 days.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorTerritoryExpansion;
