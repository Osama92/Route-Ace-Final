import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Radio, TrendingUp, MapPin, Zap, AlertTriangle, Clock, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from "recharts";

const cityDemandScores = [
  { city: "Lagos", nightlife: 94, social: 88, tourism: 72, hospitality: 91, events: 85, overall: 92 },
  { city: "Abuja", nightlife: 78, social: 71, tourism: 68, hospitality: 82, events: 74, overall: 78 },
  { city: "Port Harcourt", nightlife: 72, social: 62, tourism: 45, hospitality: 68, events: 58, overall: 65 },
  { city: "Ibadan", nightlife: 58, social: 52, tourism: 32, hospitality: 55, events: 48, overall: 52 },
  { city: "Calabar", nightlife: 45, social: 38, tourism: 82, hospitality: 52, events: 72, overall: 58 },
  { city: "Enugu", nightlife: 42, social: 35, tourism: 28, hospitality: 48, events: 38, overall: 42 },
  { city: "Benin City", nightlife: 52, social: 44, tourism: 35, hospitality: 58, events: 42, overall: 48 },
  { city: "Uyo", nightlife: 38, social: 32, tourism: 42, hospitality: 44, events: 35, overall: 38 },
];

const trendTimeline = [
  { month: "Oct", tequila: 32, craft_beer: 45, whiskey: 68, wine: 28, rtd: 18 },
  { month: "Nov", tequila: 38, craft_beer: 52, whiskey: 72, wine: 32, rtd: 24 },
  { month: "Dec", tequila: 56, craft_beer: 58, whiskey: 88, wine: 48, rtd: 35 },
  { month: "Jan", tequila: 62, craft_beer: 64, whiskey: 78, wine: 38, rtd: 42 },
  { month: "Feb", tequila: 74, craft_beer: 72, whiskey: 82, wine: 42, rtd: 48 },
  { month: "Mar", tequila: 88, craft_beer: 78, whiskey: 85, wine: 45, rtd: 56 },
];

const earlyAlerts = [
  { signal: "Tequila cocktail trend rising across Lagos nightlife", source: "Social + Nightlife", confidence: 92, timeframe: "60-90 days", severity: "critical" as const, category: "Tequila" },
  { signal: "Tourism spike expected in Calabar during festival season", source: "Tourism + Events", confidence: 88, timeframe: "30-45 days", severity: "high" as const, category: "All Spirits" },
  { signal: "Rapid restaurant growth detected in Lekki Phase 1", source: "Hospitality", confidence: 85, timeframe: "90-120 days", severity: "high" as const, category: "Premium Spirits" },
  { signal: "Craft beer demand rising among Lagos tech professionals", source: "Social Media", confidence: 82, timeframe: "60 days", severity: "medium" as const, category: "Craft Beer" },
  { signal: "Afrobeats concert series scheduled in Lagos — alcohol surge expected", source: "Events", confidence: 90, timeframe: "14-21 days", severity: "critical" as const, category: "All Categories" },
  { signal: "New luxury district emerging in Abuja Maitama", source: "Economic", confidence: 78, timeframe: "120-180 days", severity: "medium" as const, category: "Premium Whiskey" },
  { signal: "RTD cocktail mentions surging on Instagram Lagos", source: "Social Media", confidence: 75, timeframe: "90 days", severity: "medium" as const, category: "RTD Cocktails" },
  { signal: "Sports viewing venues expanding in PH — beer demand spike", source: "Hospitality + Events", confidence: 84, timeframe: "30 days", severity: "high" as const, category: "Beer" },
];

const radarData = [
  { signal: "Nightlife", Lagos: 94, Abuja: 78, PH: 72 },
  { signal: "Social", Lagos: 88, Abuja: 71, PH: 62 },
  { signal: "Tourism", Lagos: 72, Abuja: 68, PH: 45 },
  { signal: "Hospitality", Lagos: 91, Abuja: 82, PH: 68 },
  { signal: "Events", Lagos: 85, Abuja: 74, PH: 58 },
  { signal: "Economic", Lagos: 90, Abuja: 85, PH: 62 },
];

const severityColor = {
  critical: "border-red-500/30 bg-red-500/5",
  high: "border-orange-500/30 bg-orange-500/5",
  medium: "border-yellow-500/30 bg-yellow-500/5",
};

const LiquorDemandSignals = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Radio className="w-6 h-6 text-primary" /> Demand Signal Harvester
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Early demand radar — detecting alcohol trends before they hit sales data</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive">{earlyAlerts.filter(a => a.severity === "critical").length} Critical Signals</Badge>
          <Badge variant="secondary">{earlyAlerts.length} Active Signals</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Signals", value: "24", icon: Radio, delta: "+6 this week" },
          { label: "Cities Monitored", value: "12", icon: MapPin, delta: "All major metros" },
          { label: "Trend Accuracy", value: "87%", icon: TrendingUp, delta: "+3% vs last quarter" },
          { label: "Early Detections", value: "142", icon: Zap, delta: "Last 90 days" },
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <kpi.icon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-[10px] text-primary mt-0.5">{kpi.delta}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview"><BarChart3 className="w-3.5 h-3.5 mr-1" />Signal Overview</TabsTrigger>
          <TabsTrigger value="trends"><TrendingUp className="w-3.5 h-3.5 mr-1" />Category Trends</TabsTrigger>
          <TabsTrigger value="alerts"><AlertTriangle className="w-3.5 h-3.5 mr-1" />Early Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-sm">City Demand Opportunity Scores</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cityDemandScores} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="city" width={90} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="overall" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Demand Score" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-sm">Signal Strength Radar — Top 3 Cities</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="signal" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Lagos" dataKey="Lagos" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                    <Radar name="Abuja" dataKey="Abuja" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} />
                    <Radar name="PH" dataKey="PH" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.1} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Signal breakdown table */}
            <Card className="lg:col-span-2">
              <CardHeader><CardTitle className="text-sm">Signal Breakdown by City</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2 font-medium text-muted-foreground">City</th>
                        <th className="text-center p-2 font-medium text-muted-foreground">Nightlife</th>
                        <th className="text-center p-2 font-medium text-muted-foreground">Social</th>
                        <th className="text-center p-2 font-medium text-muted-foreground">Tourism</th>
                        <th className="text-center p-2 font-medium text-muted-foreground">Hospitality</th>
                        <th className="text-center p-2 font-medium text-muted-foreground">Events</th>
                        <th className="text-center p-2 font-medium text-muted-foreground">Overall</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cityDemandScores.map((c, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="p-2 font-medium text-foreground">{c.city}</td>
                          {[c.nightlife, c.social, c.tourism, c.hospitality, c.events].map((v, j) => (
                            <td key={j} className="text-center p-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${v >= 80 ? "bg-emerald-500/10 text-emerald-500" : v >= 60 ? "bg-yellow-500/10 text-yellow-500" : "bg-muted text-muted-foreground"}`}>{v}</span>
                            </td>
                          ))}
                          <td className="text-center p-2">
                            <Badge variant={c.overall >= 80 ? "default" : c.overall >= 60 ? "secondary" : "outline"} className="text-[10px]">{c.overall}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader><CardTitle className="text-sm">Category Demand Signal Trends (6-Month)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={trendTimeline}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="tequila" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Tequila" />
                  <Area type="monotone" dataKey="craft_beer" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.1} name="Craft Beer" />
                  <Area type="monotone" dataKey="whiskey" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.1} name="Whiskey" />
                  <Area type="monotone" dataKey="wine" stroke="hsl(var(--chart-4))" fill="hsl(var(--chart-4))" fillOpacity={0.1} name="Wine" />
                  <Area type="monotone" dataKey="rtd" stroke="hsl(var(--chart-5))" fill="hsl(var(--chart-5))" fillOpacity={0.1} name="RTD Cocktails" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Early Demand Alerts</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {earlyAlerts.map((a, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${severityColor[a.severity]}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{a.signal}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline" className="text-[10px]">{a.source}</Badge>
                          <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {a.timeframe}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <Badge variant={a.severity === "critical" ? "destructive" : a.severity === "high" ? "secondary" : "outline"} className="text-[10px]">{a.severity}</Badge>
                        <p className="text-xs text-primary mt-1 font-medium">{a.confidence}% confidence</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorDemandSignals;
