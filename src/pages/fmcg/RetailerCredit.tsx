import FMCGLayout from "@/components/fmcg/FMCGLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";

const retailers = [
  { name: "ShopRite Ikeja", limit: 5000000, balance: 2400000, risk: "low", default_prob: 3, terms: "Net 30", timeliness: 95 },
  { name: "Spar Lekki", limit: 3000000, balance: 2800000, risk: "medium", default_prob: 12, terms: "Net 15", timeliness: 78 },
  { name: "Justrite Oshodi", limit: 2000000, balance: 1900000, risk: "high", default_prob: 28, terms: "COD", timeliness: 52 },
  { name: "Game Store VI", limit: 4000000, balance: 800000, risk: "low", default_prob: 2, terms: "Net 30", timeliness: 97 },
  { name: "Market Square Ajah", limit: 1500000, balance: 1200000, risk: "medium", default_prob: 15, terms: "Net 7", timeliness: 72 },
];

const RetailerCredit = () => {
  return (
    <FMCGLayout title="Retailer Micro-Credit" subtitle="AI-driven credit scoring and dynamic limit management">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Exposure", value: "₦12.4M", icon: CreditCard },
          { label: "Low Risk", value: "67%", icon: ShieldCheck },
          { label: "High Risk", value: "8%", icon: AlertTriangle },
          { label: "Collection Rate", value: "91.2%", icon: TrendingUp },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <m.icon className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-2xl font-bold">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Retailer Credit Portfolio</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retailers.map((r) => (
              <div key={r.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{r.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.risk === "low" ? "default" : r.risk === "medium" ? "secondary" : "destructive"}>{r.risk} risk</Badge>
                    <Badge variant="outline">{r.terms}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Credit Limit</p>
                    <p className="font-medium">₦{(r.limit / 1000000).toFixed(1)}M</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Utilization</p>
                    <div className="flex items-center gap-2">
                      <Progress value={(r.balance / r.limit) * 100} className="h-2 flex-1" />
                      <span className="text-xs">{Math.round((r.balance / r.limit) * 100)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Default Prob</p>
                    <p className={`font-medium ${r.default_prob > 20 ? "text-red-600" : r.default_prob > 10 ? "text-orange-600" : "text-green-600"}`}>{r.default_prob}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Timeliness</p>
                    <p className={`font-medium ${r.timeliness > 85 ? "text-green-600" : r.timeliness > 65 ? "text-orange-600" : "text-red-600"}`}>{r.timeliness}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </FMCGLayout>
  );
};

export default RetailerCredit;
