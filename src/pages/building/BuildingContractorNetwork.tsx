import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Building2, TrendingUp } from "lucide-react";

const contractors = [
  { name: "Dangote Projects Ltd", type: "General Contractor", projects: 8, rating: 4.8, spend: "₦1.2B", status: "platinum" },
  { name: "Julius Berger Nigeria", type: "Civil Engineering", projects: 5, rating: 4.6, spend: "₦890M", status: "gold" },
  { name: "Cappa & D'Alberto", type: "Building Construction", projects: 12, rating: 4.5, spend: "₦2.1B", status: "platinum" },
  { name: "AG Leventis Builders", type: "Electrical/MEP", projects: 6, rating: 4.2, spend: "₦340M", status: "silver" },
  { name: "HFP Engineering", type: "Plumbing/HVAC", projects: 4, rating: 3.9, spend: "₦180M", status: "bronze" },
];

const BuildingContractorNetwork = () => (
  <IndustryLayout industryCode="building">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Contractor Network</h1>
          <p className="text-muted-foreground">Manage contractor relationships and procurement accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">142</p><p className="text-xs text-muted-foreground">Active Contractors</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">94%</p><p className="text-xs text-muted-foreground">Retention Rate</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦4.7B</p><p className="text-xs text-muted-foreground">Total Procurement</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">4.4</p><p className="text-xs text-muted-foreground">Avg Rating</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-amber-500" />Top Contractors</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contractors.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.type} • {c.projects} projects</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /><span className="text-sm font-medium text-foreground">{c.rating}</span></div>
                  <span className="text-sm text-muted-foreground">{c.spend}</span>
                  <Badge variant={c.status === "platinum" ? "default" : "secondary"}>{c.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BuildingContractorNetwork;
