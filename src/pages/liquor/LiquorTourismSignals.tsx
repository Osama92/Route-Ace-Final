import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Hotel, Calendar, TrendingUp, MapPin, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const tourismData = [
  { city: "Lagos", hotelOccupancy: 82, flightArrivals: 94, conferences: 18, festivals: 8, tourismScore: 88, demandImpact: "Very High" },
  { city: "Abuja", hotelOccupancy: 78, flightArrivals: 86, conferences: 24, festivals: 5, tourismScore: 82, demandImpact: "High" },
  { city: "Calabar", hotelOccupancy: 65, flightArrivals: 42, conferences: 4, festivals: 12, tourismScore: 72, demandImpact: "High (Seasonal)" },
  { city: "Port Harcourt", hotelOccupancy: 72, flightArrivals: 58, conferences: 8, festivals: 4, tourismScore: 62, demandImpact: "Medium" },
  { city: "Uyo", hotelOccupancy: 58, flightArrivals: 32, conferences: 3, festivals: 6, tourismScore: 48, demandImpact: "Medium" },
  { city: "Benin City", hotelOccupancy: 52, flightArrivals: 28, conferences: 2, festivals: 5, tourismScore: 42, demandImpact: "Medium" },
  { city: "Enugu", hotelOccupancy: 48, flightArrivals: 24, conferences: 3, festivals: 3, tourismScore: 38, demandImpact: "Low" },
  { city: "Ibadan", hotelOccupancy: 45, flightArrivals: 18, conferences: 2, festivals: 4, tourismScore: 35, demandImpact: "Low" },
];

const seasonalTrends = [
  { month: "Jan", lagos: 72, abuja: 68, calabar: 35, ph: 55 },
  { month: "Feb", lagos: 75, abuja: 70, calabar: 32, ph: 52 },
  { month: "Mar", lagos: 78, abuja: 72, calabar: 38, ph: 58 },
  { month: "Apr", lagos: 80, abuja: 74, calabar: 42, ph: 60 },
  { month: "May", lagos: 76, abuja: 68, calabar: 38, ph: 55 },
  { month: "Jun", lagos: 72, abuja: 65, calabar: 35, ph: 52 },
  { month: "Jul", lagos: 78, abuja: 70, calabar: 40, ph: 58 },
  { month: "Aug", lagos: 82, abuja: 75, calabar: 45, ph: 62 },
  { month: "Sep", lagos: 80, abuja: 72, calabar: 42, ph: 58 },
  { month: "Oct", lagos: 85, abuja: 78, calabar: 55, ph: 65 },
  { month: "Nov", lagos: 88, abuja: 82, calabar: 72, ph: 68 },
  { month: "Dec", lagos: 95, abuja: 88, calabar: 98, ph: 78 },
];

const upcomingSpikes = [
  { event: "Calabar Carnival", city: "Calabar", dates: "Dec 1-31", impact: "Critical", category: "All spirits", occupancyForecast: "98%" },
  { event: "Lagos Tech Week", city: "Lagos", dates: "Oct 15-22", impact: "High", category: "Premium spirits, wine", occupancyForecast: "92%" },
  { event: "Abuja Investment Forum", city: "Abuja", dates: "Apr 8-12", impact: "High", category: "Whiskey, champagne", occupancyForecast: "88%" },
  { event: "PH Oil & Gas Expo", city: "Port Harcourt", dates: "May 5-9", impact: "Medium", category: "Premium whiskey, beer", occupancyForecast: "82%" },
  { event: "Uyo Christmas Festival", city: "Uyo", dates: "Dec 15-28", impact: "Medium", category: "All categories", occupancyForecast: "75%" },
];

const LiquorTourismSignals = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Plane className="w-6 h-6 text-primary" /> Tourism & Event Demand Signals
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Monitoring tourism activity, hotel occupancy, and event-driven alcohol demand spikes</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Avg Hotel Occupancy", value: "68%", icon: Hotel },
          { label: "Upcoming Events", value: "42", icon: Calendar },
          { label: "Cities Tracked", value: "12", icon: MapPin },
          { label: "Tourist Arrivals (Mo)", value: "284K", icon: Users },
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
          <CardHeader><CardTitle className="text-sm">Tourism Score by City</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tourismData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="city" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="tourismScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Tourism Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Seasonal Hotel Occupancy Trends</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={seasonalTrends}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[20, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="lagos" stroke="hsl(var(--primary))" name="Lagos" strokeWidth={2} />
                <Line type="monotone" dataKey="abuja" stroke="hsl(var(--chart-2))" name="Abuja" strokeWidth={2} />
                <Line type="monotone" dataKey="calabar" stroke="hsl(var(--chart-3))" name="Calabar" strokeWidth={2} />
                <Line type="monotone" dataKey="ph" stroke="hsl(var(--chart-4))" name="PH" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tourism Spikes */}
      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> Upcoming Tourism-Driven Demand Spikes</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingSpikes.map((s, i) => (
              <div key={i} className={`p-4 rounded-lg border ${s.impact === "Critical" ? "border-red-500/30 bg-red-500/5" : s.impact === "High" ? "border-orange-500/30 bg-orange-500/5" : "border-yellow-500/30 bg-yellow-500/5"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-sm text-foreground">{s.event}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.city} • {s.dates}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">Occupancy forecast: {s.occupancyForecast}</span>
                    </div>
                  </div>
                  <Badge variant={s.impact === "Critical" ? "destructive" : s.impact === "High" ? "default" : "secondary"} className="text-[10px]">{s.impact}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* City Detail Table */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Tourism Signal Details</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium text-muted-foreground">City</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Hotel Occ.</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Flights</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Conferences</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Festivals</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Score</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Demand Impact</th>
                </tr>
              </thead>
              <tbody>
                {tourismData.map((t, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="p-2 font-medium text-foreground">{t.city}</td>
                    <td className="text-center p-2">{t.hotelOccupancy}%</td>
                    <td className="text-center p-2">{t.flightArrivals}</td>
                    <td className="text-center p-2">{t.conferences}</td>
                    <td className="text-center p-2">{t.festivals}</td>
                    <td className="text-center p-2"><Badge variant={t.tourismScore >= 70 ? "default" : "outline"} className="text-[10px]">{t.tourismScore}</Badge></td>
                    <td className="text-center p-2 text-primary text-[10px] font-medium">{t.demandImpact}</td>
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

export default LiquorTourismSignals;
