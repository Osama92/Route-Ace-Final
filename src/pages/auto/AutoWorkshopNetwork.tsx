import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Star, MapPin, TrendingUp } from "lucide-react";

const workshops = [
  { name: "Eko Auto Care", location: "Surulere", specialty: "Passenger", rating: 4.8, jobs: 245, revenue: "₦18.4M", tier: "platinum" },
  { name: "Northern Fleet Services", location: "Kano", specialty: "Heavy Trucks", rating: 4.5, jobs: 180, revenue: "₦42M", tier: "gold" },
  { name: "Abuja Premium Motors", location: "Wuse II", specialty: "Luxury", rating: 4.7, jobs: 120, revenue: "₦28M", tier: "platinum" },
  { name: "Highway Truck Stop", location: "Ore Junction", specialty: "Commercial Fleet", rating: 4.2, jobs: 340, revenue: "₦56M", tier: "gold" },
  { name: "Quick Fix Autos", location: "Ikeja", specialty: "General", rating: 3.9, jobs: 420, revenue: "₦12M", tier: "silver" },
];

const AutoWorkshopNetwork = () => (
  <IndustryLayout industryCode="auto">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-zinc-800 flex items-center justify-center">
          <Wrench className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Workshop Network</h1>
          <p className="text-muted-foreground">Manage workshop partnerships and performance tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">342</p><p className="text-xs text-muted-foreground">Active Workshops</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">78%</p><p className="text-xs text-muted-foreground">Activation Rate</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">4.4</p><p className="text-xs text-muted-foreground">Avg Rating</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">92%</p><p className="text-xs text-muted-foreground">Completion Rate</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top Workshops</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {workshops.map((w) => (
              <div key={w.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{w.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{w.location} • {w.specialty} • {w.jobs} jobs</p></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="text-sm text-foreground">{w.rating}</span></div>
                  <span className="text-sm text-muted-foreground">{w.revenue}</span>
                  <Badge variant={w.tier === "platinum" ? "default" : "secondary"}>{w.tier}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AutoWorkshopNetwork;
