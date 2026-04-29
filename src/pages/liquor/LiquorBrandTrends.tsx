import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Flame, Star, MapPin, ArrowUpRight } from "lucide-react";

const trendData = [
  { month: "Jan", hennessy: 4200, johnnie: 3800, smirnoff: 5100, craft: 1200 },
  { month: "Feb", hennessy: 4600, johnnie: 3900, smirnoff: 5400, craft: 1500 },
  { month: "Mar", hennessy: 5100, johnnie: 4200, smirnoff: 5200, craft: 1900 },
  { month: "Apr", hennessy: 5800, johnnie: 4100, smirnoff: 5600, craft: 2400 },
  { month: "May", hennessy: 6200, johnnie: 4500, smirnoff: 5900, craft: 3100 },
  { month: "Jun", hennessy: 7100, johnnie: 4800, smirnoff: 6100, craft: 3800 },
];

const trendingBrands = [
  { brand: "Hennessy VS", growth: "+34%", segment: "Premium Cognac", cities: ["Lagos", "Abuja"], retailers: 482, momentum: 96 },
  { brand: "Craft Beer Co", growth: "+48%", segment: "Craft Beer", cities: ["PH", "Lagos"], retailers: 128, momentum: 92 },
  { brand: "Clase Azul", growth: "+28%", segment: "Ultra-Premium Tequila", cities: ["Lagos"], retailers: 42, momentum: 88 },
  { brand: "Aperol", growth: "+52%", segment: "Aperitif", cities: ["Lagos", "Abuja", "PH"], retailers: 210, momentum: 94 },
  { brand: "Jameson", growth: "+18%", segment: "Irish Whiskey", cities: ["Ibadan", "Enugu"], retailers: 340, momentum: 79 },
];

const cityTrends = [
  { city: "Lagos", topBrand: "Hennessy", volume: "₦42M", growth: "+22%", segments: ["Cognac", "Champagne", "Craft"] },
  { city: "Abuja", topBrand: "Johnnie Walker", volume: "₦28M", growth: "+18%", segments: ["Whiskey", "Vodka"] },
  { city: "Port Harcourt", topBrand: "Smirnoff", volume: "₦14M", growth: "+28%", segments: ["Vodka", "Craft Beer"] },
  { city: "Ibadan", topBrand: "Star Lager", volume: "₦8M", growth: "+12%", segments: ["Beer", "Spirits"] },
];

const LiquorBrandTrends = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" /> Brand Trend Prediction
        </h2>
        <p className="text-sm text-muted-foreground mt-1">AI-predicted brand momentum across cities, segments, and retail channels</p>
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Trending Brands</TabsTrigger>
          <TabsTrigger value="chart">Growth Chart</TabsTrigger>
          <TabsTrigger value="cities">City Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="space-y-4">
            {trendingBrands.map((b, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{b.brand}</p>
                        <p className="text-xs text-muted-foreground">{b.segment}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-500">{b.growth}</p>
                      <p className="text-xs text-muted-foreground">Momentum: {b.momentum}/100</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {b.cities.map((c) => (
                      <Badge key={c} variant="outline" className="text-[10px]"><MapPin className="w-2.5 h-2.5 mr-1" />{c}</Badge>
                    ))}
                    <span className="text-xs text-muted-foreground ml-2">{b.retailers} retailers</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader><CardTitle className="text-sm">Brand Growth Trajectory</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={360}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="hennessy" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="Hennessy" />
                  <Area type="monotone" dataKey="craft" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.2} name="Craft Beer" />
                  <Area type="monotone" dataKey="smirnoff" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.2} name="Smirnoff" />
                  <Area type="monotone" dataKey="johnnie" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.1} name="Johnnie Walker" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cityTrends.map((c, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{c.city}</h3>
                    <Badge variant="secondary"><ArrowUpRight className="w-3 h-3 mr-1" />{c.growth}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-muted-foreground">Top Brand</span><p className="font-semibold text-foreground">{c.topBrand}</p></div>
                    <div><span className="text-muted-foreground">Volume</span><p className="font-semibold text-foreground">{c.volume}</p></div>
                  </div>
                  <div className="flex gap-1 mt-2">{c.segments.map((s) => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorBrandTrends;
