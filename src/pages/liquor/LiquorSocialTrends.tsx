import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, TrendingUp, MessageCircle, Eye, Flame, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const trendingDrinks = [
  { drink: "Tequila Sunrise", mentions: 14200, growth: "+68%", city: "Lagos", velocity: "Viral", platform: "Instagram" },
  { drink: "Aperol Spritz", mentions: 8400, growth: "+52%", city: "Lagos / Abuja", velocity: "Rising", platform: "TikTok" },
  { drink: "Hennessy VS", mentions: 22800, growth: "+34%", city: "Nationwide", velocity: "Steady", platform: "Twitter" },
  { drink: "Craft IPA", mentions: 6200, growth: "+48%", city: "Lagos", velocity: "Rising", platform: "Instagram" },
  { drink: "Moët & Chandon", mentions: 11500, growth: "+22%", city: "Lagos / Abuja", velocity: "Steady", platform: "Instagram" },
  { drink: "Jameson Irish", mentions: 7800, growth: "+28%", city: "PH / Lagos", velocity: "Rising", platform: "Twitter" },
  { drink: "Baileys Colada", mentions: 5400, growth: "+82%", city: "Lagos", velocity: "Viral", platform: "TikTok" },
  { drink: "Grey Goose Martini", mentions: 4200, growth: "+18%", city: "Abuja", velocity: "Emerging", platform: "Instagram" },
];

const mentionTimeline = [
  { week: "W1", tequila: 1800, craft: 920, whiskey: 3200, champagne: 1400, cocktails: 2100 },
  { week: "W2", tequila: 2200, craft: 1050, whiskey: 3400, champagne: 1500, cocktails: 2400 },
  { week: "W3", tequila: 2800, craft: 1200, whiskey: 3100, champagne: 1800, cocktails: 2800 },
  { week: "W4", tequila: 3500, craft: 1350, whiskey: 3600, champagne: 1650, cocktails: 3200 },
  { week: "W5", tequila: 4200, craft: 1500, whiskey: 3800, champagne: 2000, cocktails: 3600 },
  { week: "W6", tequila: 5100, craft: 1680, whiskey: 3500, champagne: 2200, cocktails: 4100 },
];

const hashtagData = [
  { tag: "#NightlifeNigeria", posts: 42800, trend: "up" },
  { tag: "#LagosNights", posts: 38200, trend: "up" },
  { tag: "#CocktailCulture", posts: 28400, trend: "up" },
  { tag: "#TequilaTime", posts: 18600, trend: "up" },
  { tag: "#CraftBeerNG", posts: 12400, trend: "up" },
  { tag: "#WhiskeyWednesday", posts: 15800, trend: "steady" },
  { tag: "#AbujaVibes", posts: 22100, trend: "up" },
  { tag: "#SpritzSeason", posts: 8200, trend: "up" },
];

const citySpread = [
  { city: "Lagos", mentions: 48200 },
  { city: "Abuja", mentions: 22400 },
  { city: "PH", mentions: 12800 },
  { city: "Ibadan", mentions: 6400 },
  { city: "Calabar", mentions: 4200 },
  { city: "Enugu", mentions: 3800 },
];

const velocityColor: Record<string, string> = {
  Viral: "bg-red-500/10 text-red-500",
  Rising: "bg-orange-500/10 text-orange-500",
  Steady: "bg-emerald-500/10 text-emerald-500",
  Emerging: "bg-blue-500/10 text-blue-500",
};

const LiquorSocialTrends = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Hash className="w-6 h-6 text-primary" /> Social Media Drink Trends
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Tracking viral drink trends, brand hashtags, and nightlife check-ins across social platforms</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Mentions (30d)", value: "186K", icon: MessageCircle },
          { label: "Trending Drinks", value: "8", icon: Flame },
          { label: "Hashtags Tracked", value: "124", icon: Hash },
          { label: "Platforms Monitored", value: "4", icon: Eye },
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
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-sm">Drink Category Mention Trends (6-Week)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mentionTimeline}>
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="tequila" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Tequila" />
                <Area type="monotone" dataKey="cocktails" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.1} name="Cocktails" />
                <Area type="monotone" dataKey="whiskey" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.1} name="Whiskey" />
                <Area type="monotone" dataKey="champagne" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.1} name="Champagne" />
                <Area type="monotone" dataKey="craft" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5))" fillOpacity={0.1} name="Craft Beer" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Geographic Mention Spread</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={citySpread} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="city" width={70} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="mentions" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} name="Mentions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Hash className="w-4 h-4" /> Top Hashtags</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hashtagData.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <span className="text-sm font-medium text-foreground">{h.tag}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{(h.posts / 1000).toFixed(1)}K</span>
                    {h.trend === "up" && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Drinks Table */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Flame className="w-4 h-4" /> Trending Drinks — Full Signal</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-muted-foreground">Drink</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Mentions</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Growth</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">City</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Velocity</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Platform</th>
                </tr>
              </thead>
              <tbody>
                {trendingDrinks.map((d, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 font-medium text-foreground">{d.drink}</td>
                    <td className="text-center p-2">{d.mentions.toLocaleString()}</td>
                    <td className="text-center p-2 text-primary font-medium">{d.growth}</td>
                    <td className="text-center p-2"><Badge variant="outline" className="text-[10px]">{d.city}</Badge></td>
                    <td className="text-center p-2"><span className={`px-2 py-0.5 rounded text-[10px] font-medium ${velocityColor[d.velocity]}`}>{d.velocity}</span></td>
                    <td className="text-center p-2 text-muted-foreground">{d.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorSocialTrends;
