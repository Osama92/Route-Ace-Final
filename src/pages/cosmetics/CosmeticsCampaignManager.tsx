import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Megaphone, TrendingUp, Eye, DollarSign, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const campaigns = [
  { name: "Summer Glow Collection", type: "Product Launch", reach: "2.4M", engagement: "8.2%", roi: "340%", status: "active", budget: "₦45M" },
  { name: "Bridal Season Push", type: "Seasonal", reach: "1.8M", engagement: "12.1%", roi: "520%", status: "active", budget: "₦28M" },
  { name: "Clean Beauty Awareness", type: "Brand Awareness", reach: "3.1M", engagement: "5.4%", roi: "180%", status: "completed", budget: "₦62M" },
  { name: "Valentine's Gift Set", type: "Promotional", reach: "980K", engagement: "15.3%", roi: "680%", status: "completed", budget: "₦15M" },
];

const channelPerf = [
  { channel: "Instagram", reach: 45, conversion: 12 },
  { channel: "TikTok", reach: 30, conversion: 18 },
  { channel: "In-Store", reach: 15, conversion: 35 },
  { channel: "YouTube", reach: 8, conversion: 8 },
  { channel: "WhatsApp", reach: 2, conversion: 22 },
];

const CosmeticsCampaignManager = () => (
  <IndustryLayout industryCode="cosmetics">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Megaphone className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Campaign Management</h1>
          <p className="text-muted-foreground">Manage beauty campaigns, ROI tracking, and channel performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><Eye className="w-5 h-5 text-pink-500 mb-2" /><p className="text-2xl font-bold text-foreground">8.3M</p><p className="text-xs text-muted-foreground">Total Reach</p></CardContent></Card>
        <Card><CardContent className="p-4"><TrendingUp className="w-5 h-5 text-pink-500 mb-2" /><p className="text-2xl font-bold text-foreground">10.2%</p><p className="text-xs text-muted-foreground">Avg Engagement</p></CardContent></Card>
        <Card><CardContent className="p-4"><DollarSign className="w-5 h-5 text-pink-500 mb-2" /><p className="text-2xl font-bold text-foreground">430%</p><p className="text-xs text-muted-foreground">Average ROI</p></CardContent></Card>
        <Card><CardContent className="p-4"><Target className="w-5 h-5 text-pink-500 mb-2" /><p className="text-2xl font-bold text-foreground">6</p><p className="text-xs text-muted-foreground">Active Campaigns</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Campaigns</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{c.name}</p><p className="text-xs text-muted-foreground">{c.type} • Budget: {c.budget}</p></div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Reach: {c.reach}</span>
                  <span className="text-xs text-muted-foreground">Eng: {c.engagement}</span>
                  <Badge variant="secondary">ROI: {c.roi}</Badge>
                  <Badge variant={c.status === "active" ? "default" : "outline"}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Channel Performance</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={channelPerf}>
              <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="reach" fill="hsl(var(--primary))" name="Reach %" />
              <Bar dataKey="conversion" fill="#ec4899" name="Conversion %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default CosmeticsCampaignManager;
