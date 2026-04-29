import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Brain, Target, MapPin, Users, TrendingUp, Star, Zap,
  Search, ChevronRight, Martini, Wine, Beer, Copy,
} from "lucide-react";

const seedOutlet = {
  name: "The Gold Barrel Lounge",
  type: "Premium Cocktail Bar",
  district: "Victoria Island",
  spend: "₦4.2M/mo",
  tier: "Platinum",
  topCategory: "Premium Spirits",
  score: 92,
};

const lookalikes = [
  { name: "Azure Sky Bar", district: "Lekki Phase 1", type: "Rooftop Bar", similarity: 94, estSpend: "₦3.8M", topCategory: "Premium Spirits", status: "Not Onboarded", distance: "4.2km", footfall: "High", nightlife: true },
  { name: "Velvet & Vine Lounge", district: "Ikoyi", type: "Wine & Cocktail Bar", similarity: 91, estSpend: "₦4.1M", topCategory: "Wine & Spirits", status: "Not Onboarded", distance: "2.8km", footfall: "High", nightlife: true },
  { name: "The Brass Monkey", district: "Victoria Island", type: "Cocktail Bar", similarity: 88, estSpend: "₦3.2M", topCategory: "Spirits", status: "Competitor Served", distance: "1.6km", footfall: "Medium", nightlife: true },
  { name: "Moonlight Social", district: "Lekki", type: "Lounge Bar", similarity: 85, estSpend: "₦2.9M", topCategory: "Premium Spirits", status: "Not Onboarded", distance: "6.1km", footfall: "High", nightlife: true },
  { name: "Pour Decisions Bar", district: "Ikeja GRA", type: "Sports & Cocktail Bar", similarity: 82, estSpend: "₦2.4M", topCategory: "Beer & Spirits", status: "Not Onboarded", distance: "12km", footfall: "Medium", nightlife: false },
  { name: "Ember & Oak", district: "Victoria Island", type: "Speakeasy", similarity: 79, estSpend: "₦3.6M", topCategory: "Premium Spirits", status: "Not Onboarded", distance: "0.8km", footfall: "Low", nightlife: true },
];

const matchFactors = [
  { factor: "Category Mix Similarity", weight: 30 },
  { factor: "Spend Potential", weight: 25 },
  { factor: "Outlet Type Match", weight: 20 },
  { factor: "Location Proximity", weight: 15 },
  { factor: "Footfall Pattern", weight: 10 },
];

const LiquorOutletLookalike = () => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (i: number) => {
    setSelected(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Outlet Lookalike Discovery</h1>
            <p className="text-sm text-muted-foreground">AI identifies high-potential outlets similar to your top performers</p>
          </div>
          {selected.length > 0 && (
            <Button><Target className="w-4 h-4 mr-1" /> Add {selected.length} to Route Plan</Button>
          )}
        </div>

        {/* Seed Outlet */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Martini className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold">Seed Account: {seedOutlet.name}</p>
                    <Badge className="bg-amber-500/15 text-amber-600">{seedOutlet.tier}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{seedOutlet.type} · {seedOutlet.district} · {seedOutlet.spend}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{seedOutlet.score}</p>
                <p className="text-xs text-muted-foreground">Intelligence Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matching Algorithm */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2"><Brain className="w-4 h-4" /> AI Matching Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {matchFactors.map(f => (
                <div key={f.factor} className="text-center p-2 bg-muted/30 rounded-lg">
                  <p className="text-lg font-bold text-primary">{f.weight}%</p>
                  <p className="text-[10px] text-muted-foreground">{f.factor}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lookalike Results */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {lookalikes.length} Lookalike Outlets Found
            </h3>
            <p className="text-xs text-muted-foreground">Sorted by similarity score</p>
          </div>

          {lookalikes.map((l, i) => (
            <motion.div key={l.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`transition-all cursor-pointer ${selected.includes(i) ? "border-primary bg-primary/5" : "hover:border-primary/30"}`} onClick={() => toggleSelect(i)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                        <span className="text-lg font-bold text-primary">{l.similarity}%</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{l.name}</p>
                          <Badge variant="outline" className={
                            l.status === "Not Onboarded" ? "text-emerald-600 border-emerald-300" : "text-amber-600 border-amber-300"
                          }>{l.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{l.type} · {l.district} · {l.distance} away</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{l.estSpend}</p>
                      <p className="text-[10px] text-muted-foreground">Est. Monthly Spend</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                      <p className="text-xs font-medium">{l.topCategory}</p>
                      <p className="text-[10px] text-muted-foreground">Top Category</p>
                    </div>
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                      <p className="text-xs font-medium">{l.footfall}</p>
                      <p className="text-[10px] text-muted-foreground">Footfall</p>
                    </div>
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                      <p className="text-xs font-medium">{l.nightlife ? "Yes" : "No"}</p>
                      <p className="text-[10px] text-muted-foreground">Nightlife</p>
                    </div>
                    <div className="text-center p-2 bg-muted/20 rounded-lg">
                      <p className="text-xs font-medium">{l.distance}</p>
                      <p className="text-[10px] text-muted-foreground">Distance</p>
                    </div>
                  </div>
                  <Progress value={l.similarity} className="h-1.5 mt-3" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Insight */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Prospecting Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                6 high-similarity outlets identified within 15km radius. 5 are currently unserved — 
                representing ₦16.4M/month in potential revenue. Azure Sky Bar and Velvet & Vine 
                are the highest-priority targets due to 94%+ similarity and premium spirits affinity. 
                Recommend assigning to your VI/Lekki sales team this week.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorOutletLookalike;
