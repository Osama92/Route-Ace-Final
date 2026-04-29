import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, MapPin, Music, Users, TrendingUp, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const nightlifeData = [
  { district: "Victoria Island", venues: 142, eventFreq: 28, peakNight: "Friday", density: 96, growth: "+18%" },
  { district: "Lekki Phase 1", venues: 98, eventFreq: 22, peakNight: "Saturday", density: 84, growth: "+32%" },
  { district: "Ikeja GRA", venues: 65, eventFreq: 15, peakNight: "Friday", density: 62, growth: "+12%" },
  { district: "Abuja Wuse II", venues: 78, eventFreq: 18, peakNight: "Saturday", density: 74, growth: "+24%" },
  { district: "PH GRA", venues: 52, eventFreq: 12, peakNight: "Friday", density: 58, growth: "+8%" },
  { district: "Ibadan Ring Road", venues: 35, eventFreq: 8, peakNight: "Saturday", density: 38, growth: "+15%" },
  { district: "Calabar Marina", venues: 28, eventFreq: 10, peakNight: "Saturday", density: 42, growth: "+22%" },
  { district: "Enugu Independence", venues: 22, eventFreq: 6, peakNight: "Friday", density: 28, growth: "+10%" },
];

const weeklyActivity = [
  { day: "Mon", activity: 22 }, { day: "Tue", activity: 18 }, { day: "Wed", activity: 35 },
  { day: "Thu", activity: 48 }, { day: "Fri", activity: 92 }, { day: "Sat", activity: 98 }, { day: "Sun", activity: 42 },
];

const venueGrowth = [
  { month: "Oct", bars: 520, clubs: 145, lounges: 210, restaurants: 380 },
  { month: "Nov", bars: 535, clubs: 148, lounges: 218, restaurants: 395 },
  { month: "Dec", bars: 558, clubs: 155, lounges: 228, restaurants: 412 },
  { month: "Jan", bars: 572, clubs: 158, lounges: 235, restaurants: 425 },
  { month: "Feb", bars: 588, clubs: 162, lounges: 242, restaurants: 438 },
  { month: "Mar", bars: 608, clubs: 168, lounges: 252, restaurants: 455 },
];

const upcomingEvents = [
  { name: "Lagos Nightlife Awards", date: "Mar 22", venue: "VI", impact: "High", expectedDemand: "Premium spirits +45%" },
  { name: "Abuja Jazz Festival", date: "Apr 5-7", venue: "Wuse II", impact: "High", expectedDemand: "Wine & champagne +60%" },
  { name: "PH Carnival", date: "Apr 15-18", venue: "GRA", impact: "Medium", expectedDemand: "All categories +35%" },
  { name: "Calabar Cultural Festival", date: "Dec 1-31", venue: "Marina", impact: "Critical", expectedDemand: "All spirits +120%" },
];

const LiquorNightlifeSignals = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Moon className="w-6 h-6 text-primary" /> Nightlife Activity Signals
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Tracking nightlife density, venue growth, and event-driven demand across Nigerian cities</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Venues Tracked", value: "1,483", icon: MapPin },
          { label: "Active Events/Month", value: "119", icon: Calendar },
          { label: "Peak Districts", value: "8", icon: Music },
          { label: "New Venues (30d)", value: "+42", icon: TrendingUp },
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
          <CardHeader><CardTitle className="text-sm">Nightlife Density by District</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nightlifeData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="district" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="density" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Density Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Weekly Activity Pattern</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="activity" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Activity Index" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Venue Growth Trends (6-Month)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={venueGrowth}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="bars" stroke="hsl(var(--primary))" name="Bars" strokeWidth={2} />
                <Line type="monotone" dataKey="restaurants" stroke="hsl(var(--chart-2))" name="Restaurants" strokeWidth={2} />
                <Line type="monotone" dataKey="lounges" stroke="hsl(var(--chart-3))" name="Lounges" strokeWidth={2} />
                <Line type="monotone" dataKey="clubs" stroke="hsl(var(--chart-4))" name="Clubs" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> Upcoming Events — Demand Impact</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((e, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-foreground">{e.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{e.venue} • {e.date}</p>
                    </div>
                    <Badge variant={e.impact === "Critical" ? "destructive" : e.impact === "High" ? "default" : "secondary"} className="text-[10px]">{e.impact}</Badge>
                  </div>
                  <p className="text-xs text-primary mt-1">{e.expectedDemand}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District Detail Table */}
      <Card>
        <CardHeader><CardTitle className="text-sm">District Signal Details</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-muted-foreground">District</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Venues</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Events/Mo</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Peak Night</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Density</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Growth</th>
                </tr>
              </thead>
              <tbody>
                {nightlifeData.map((d, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 font-medium text-foreground">{d.district}</td>
                    <td className="text-center p-2">{d.venues}</td>
                    <td className="text-center p-2">{d.eventFreq}</td>
                    <td className="text-center p-2"><Badge variant="outline" className="text-[10px]">{d.peakNight}</Badge></td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${d.density >= 80 ? "bg-emerald-500/10 text-emerald-500" : d.density >= 50 ? "bg-yellow-500/10 text-yellow-500" : "bg-muted text-muted-foreground"}`}>{d.density}</span>
                    </td>
                    <td className="text-center p-2 text-primary font-medium">{d.growth}</td>
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

export default LiquorNightlifeSignals;
