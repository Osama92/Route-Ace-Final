import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Wrench } from "lucide-react";

const mechanics = [
  { name: "Emeka Obi", specialty: "Engine Diagnostics", certLevel: "Master", jobs: 890, rating: 4.9, workshop: "Eko Auto Care" },
  { name: "Sule Mohammed", specialty: "Heavy Diesel", certLevel: "Senior", jobs: 1240, rating: 4.7, workshop: "Highway Truck Stop" },
  { name: "Taiwo Adeyemi", specialty: "Electrical Systems", certLevel: "Master", jobs: 650, rating: 4.8, workshop: "Abuja Premium" },
  { name: "Chukwu Nnamdi", specialty: "Transmission", certLevel: "Certified", jobs: 420, rating: 4.5, workshop: "Quick Fix Autos" },
  { name: "Hassan Bala", specialty: "Body & Paint", certLevel: "Senior", jobs: 380, rating: 4.3, workshop: "Northern Fleet" },
];

const AutoMechanicRegistry = () => (
  <IndustryLayout industryCode="auto">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-zinc-800 flex items-center justify-center">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Certified Mechanic Registry</h1>
          <p className="text-muted-foreground">Mechanic skill classification and certification tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">1,842</p><p className="text-xs text-muted-foreground">Registered Mechanics</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">342</p><p className="text-xs text-muted-foreground">Master Certified</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">+18%</p><p className="text-xs text-muted-foreground">Network Growth</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">4.6</p><p className="text-xs text-muted-foreground">Avg Rating</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-zinc-500" />Top Mechanics</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mechanics.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{m.name}</p><p className="text-xs text-muted-foreground">{m.specialty} • {m.workshop} • {m.jobs} jobs</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">⭐ {m.rating}</span>
                  <Badge variant={m.certLevel === "Master" ? "default" : "secondary"}>{m.certLevel}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default AutoMechanicRegistry;
