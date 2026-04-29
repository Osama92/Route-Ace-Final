import FMCGLayout from "@/components/fmcg/FMCGLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Store, CreditCard, TrendingUp, AlertTriangle } from "lucide-react";

const retailers = [
  { name: "ShopRite Ikeja", type: "Modern Trade", creditScore: 92, creditLimit: "₦5M", used: "₦1.2M", ltv: "₦18.4M", churnRisk: 5, segment: "Platinum" },
  { name: "Spar Lekki", type: "Modern Trade", creditScore: 88, creditLimit: "₦3M", used: "₦2.1M", ltv: "₦12.1M", churnRisk: 8, segment: "Gold" },
  { name: "Mama Nkechi Store", type: "Traditional", creditScore: 74, creditLimit: "₦200K", used: "₦180K", ltv: "₦2.4M", churnRisk: 22, segment: "Silver" },
  { name: "Baba Ahmed Kiosk", type: "Kiosk", creditScore: 61, creditLimit: "₦50K", used: "₦48K", ltv: "₦890K", churnRisk: 35, segment: "Bronze" },
  { name: "Game VI", type: "Modern Trade", creditScore: 85, creditLimit: "₦4M", used: "₦1.8M", ltv: "₦15.2M", churnRisk: 12, segment: "Gold" },
  { name: "Justrite Oshodi", type: "Supermarket", creditScore: 79, creditLimit: "₦2M", used: "₦1.5M", ltv: "₦8.9M", churnRisk: 18, segment: "Silver" },
];

const summaryKPIs = [
  { label: "Total Outlets", value: "2,847", icon: Store, color: "text-emerald-600" },
  { label: "Credit Exposure", value: "₦12.4M", icon: CreditCard, color: "text-purple-600" },
  { label: "Avg Retailer LTV", value: "₦4.2M", icon: TrendingUp, color: "text-green-600" },
  { label: "At-Risk Outlets", value: "142", icon: AlertTriangle, color: "text-red-600" },
];

const FMCGRetailers = () => (
  <FMCGLayout title="Retailer Management" subtitle="AI-powered outlet profiles, credit scoring & churn prediction">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {summaryKPIs.map((kpi) => (
        <Card key={kpi.label}>
          <CardContent className="pt-6 flex items-center gap-4">
            <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
            <div>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle>Outlet Intelligence Board</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {retailers.map((r) => (
            <div key={r.name} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-sm text-muted-foreground">{r.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={r.segment === "Platinum" ? "default" : r.segment === "Bronze" ? "destructive" : "secondary"}>{r.segment}</Badge>
                  {r.churnRisk > 25 && <Badge variant="destructive">Churn Risk</Badge>}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div><span className="text-muted-foreground">Credit Score</span><p className="font-semibold">{r.creditScore}/100</p></div>
                <div><span className="text-muted-foreground">Credit Limit</span><p className="font-semibold">{r.creditLimit}</p></div>
                <div><span className="text-muted-foreground">Used</span><p className="font-semibold">{r.used}</p></div>
                <div><span className="text-muted-foreground">Lifetime Value</span><p className="font-semibold">{r.ltv}</p></div>
                <div><span className="text-muted-foreground">Churn Risk</span><p className={`font-semibold ${r.churnRisk > 25 ? "text-red-600" : "text-green-600"}`}>{r.churnRisk}%</p></div>
              </div>
              <Progress value={r.creditScore} className="h-1 mt-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </FMCGLayout>
);

export default FMCGRetailers;
