import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Rocket, Calendar, TrendingUp } from "lucide-react";

const launches = [
  { name: "Vitamin C Serum Pro", category: "Skincare", launchDate: "2026-04-15", progress: 72, channels: 8, preorders: 4200, status: "on_track" },
  { name: "Matte Lip Collection", category: "Makeup", launchDate: "2026-05-01", progress: 45, channels: 12, preorders: 8900, status: "on_track" },
  { name: "Natural Hair Oil", category: "Haircare", launchDate: "2026-06-10", progress: 22, channels: 5, preorders: 1200, status: "delayed" },
  { name: "Oud Signature EDP", category: "Fragrance", launchDate: "2026-07-20", progress: 10, channels: 3, preorders: 340, status: "planning" },
];

const CosmeticsProductLaunch = () => (
  <IndustryLayout industryCode="cosmetics">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Rocket className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Product Launch Pipeline</h1>
          <p className="text-muted-foreground">Plan and track beauty product launches across channels</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-pink-500" />Upcoming Launches</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {launches.map((l) => (
              <div key={l.name} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-semibold text-foreground">{l.name}</p><p className="text-xs text-muted-foreground">{l.category} • Launch: {l.launchDate} • {l.channels} channels</p></div>
                  <Badge variant={l.status === "on_track" ? "default" : l.status === "delayed" ? "destructive" : "secondary"}>{l.status.replace("_", " ")}</Badge>
                </div>
                <Progress value={l.progress} className="h-2 mb-2" />
                <div className="flex gap-4 text-xs text-muted-foreground"><span>{l.progress}% ready</span><span>{l.preorders.toLocaleString()} pre-orders</span></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default CosmeticsProductLaunch;
