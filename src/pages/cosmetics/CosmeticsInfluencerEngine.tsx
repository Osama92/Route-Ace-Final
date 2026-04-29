import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, TrendingUp, Heart } from "lucide-react";

const influencers = [
  { name: "Jackie Aina", platform: "YouTube/IG", followers: "3.2M", engagement: "8.5%", conversions: 12400, tier: "mega", roi: "520%" },
  { name: "Dimma Umeh", platform: "YouTube", followers: "850K", engagement: "12.3%", conversions: 8200, tier: "macro", roi: "680%" },
  { name: "Ronke Raji", platform: "Instagram", followers: "420K", engagement: "15.8%", conversions: 5100, tier: "mid", roi: "450%" },
  { name: "Beauty by Lola", platform: "TikTok", followers: "180K", engagement: "22.4%", conversions: 3800, tier: "micro", roi: "890%" },
  { name: "Shade Matters", platform: "IG/TikTok", followers: "95K", engagement: "28.1%", conversions: 2400, tier: "nano", roi: "1200%" },
];

const CosmeticsInfluencerEngine = () => (
  <IndustryLayout industryCode="cosmetics">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Heart className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Influencer Marketing Engine</h1>
          <p className="text-muted-foreground">Manage influencer partnerships, track performance and ROI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">48</p><p className="text-xs text-muted-foreground">Active Partners</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">31.9K</p><p className="text-xs text-muted-foreground">Total Conversions</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">748%</p><p className="text-xs text-muted-foreground">Avg ROI</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">16.2%</p><p className="text-xs text-muted-foreground">Avg Engagement</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-pink-500" />Influencer Partners</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {influencers.map((inf) => (
              <div key={inf.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{inf.name}</p><p className="text-xs text-muted-foreground">{inf.platform} • {inf.followers} followers</p></div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Eng: {inf.engagement}</span>
                  <span className="text-muted-foreground">{inf.conversions.toLocaleString()} sales</span>
                  <Badge variant="secondary">ROI: {inf.roi}</Badge>
                  <Badge variant={inf.tier === "mega" ? "default" : "outline"}>{inf.tier}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default CosmeticsInfluencerEngine;
