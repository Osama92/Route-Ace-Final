import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Store, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const promos = [
  { name: "Buy 2 Get 1 Free — Lipsticks", store: "All Stores", sellThrough: "78%", uplift: "+42%", status: "active" },
  { name: "Skincare Starter Kit Bundle", store: "Flagship", sellThrough: "92%", uplift: "+68%", status: "active" },
  { name: "End-of-Season Clearance", store: "Online", sellThrough: "65%", uplift: "+28%", status: "scheduled" },
];

const displayData = [
  { location: "Counter", effectiveness: 85 },
  { location: "Window", effectiveness: 72 },
  { location: "End-Cap", effectiveness: 91 },
  { location: "POS", effectiveness: 68 },
  { location: "Digital", effectiveness: 78 },
];

const CosmeticsRetailPromo = () => (
  <IndustryLayout industryCode="cosmetics">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Tag className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Retail Promotions</h1>
          <p className="text-muted-foreground">Manage retail promotions and display analytics</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Promotions</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {promos.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{p.name}</p><p className="text-xs text-muted-foreground">{p.store}</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Sell-through: {p.sellThrough}</span>
                  <Badge variant="secondary">{p.uplift}</Badge>
                  <Badge variant={p.status === "active" ? "default" : "outline"}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-pink-500" />Display Effectiveness</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={displayData}>
              <XAxis dataKey="location" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="effectiveness" fill="#ec4899" name="Effectiveness %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default CosmeticsRetailPromo;
