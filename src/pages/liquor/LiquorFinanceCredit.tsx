import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard, DollarSign, AlertTriangle, CheckCircle, Receipt,
  TrendingUp, Brain, ShieldCheck, Clock, Wine, Ban,
} from "lucide-react";

const creditAccounts = [
  { account: "Sky Lounge Bar", type: "Nightclub", limit: "₦2.5M", utilized: 1200000, utilPct: 48, riskScore: 12, paymentDays: 7, status: "good" },
  { account: "Club Mirage", type: "Nightclub", limit: "₦3.0M", utilized: 2700000, utilPct: 90, riskScore: 65, paymentDays: 24, status: "warning" },
  { account: "The Grill House", type: "Restaurant", limit: "₦1.5M", utilized: 800000, utilPct: 53, riskScore: 18, paymentDays: 10, status: "good" },
  { account: "Mama's Kitchen", type: "Restaurant", limit: "₦500K", utilized: 480000, utilPct: 96, riskScore: 82, paymentDays: 32, status: "critical" },
  { account: "Premium Liquors", type: "Liquor Store", limit: "₦4.0M", utilized: 1600000, utilPct: 40, riskScore: 8, paymentDays: 5, status: "good" },
];

const reconciliation = [
  { id: "REC-1201", account: "Sky Lounge Bar", amount: "₦840,000", method: "Transfer", date: "Today", matched: true },
  { id: "REC-1202", account: "Club Mirage", amount: "₦1,200,000", method: "Cheque", date: "Yesterday", matched: false },
  { id: "REC-1203", account: "Premium Liquors", amount: "₦2,400,000", method: "Transfer", date: "2 days ago", matched: true },
  { id: "REC-1204", account: "The Grill House", amount: "₦320,000", method: "Cash", date: "Today", matched: true },
];

const statusConfig = {
  good: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  warning: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  critical: { color: "bg-destructive/15 text-destructive border-destructive/30" },
};

const LiquorFinanceCredit = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
          <CreditCard className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Finance & Credit Engine</h1>
          <p className="text-sm text-muted-foreground">Bar/restaurant credit, reconciliation & margin protection</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-bold">₦11.5M</p>
          <p className="text-xs text-muted-foreground">Total Credit Limit</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-400" />
          <p className="text-xl font-bold">₦6.8M</p>
          <p className="text-xs text-muted-foreground">Credit Utilized</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <Receipt className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <p className="text-xl font-bold">₦4.76M</p>
          <p className="text-xs text-muted-foreground">Payments Received</p>
        </CardContent></Card>
        <Card className="border-destructive/20"><CardContent className="pt-5 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
          <p className="text-xl font-bold">2</p>
          <p className="text-xs text-muted-foreground">High Risk Accounts</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <Clock className="w-5 h-5 mx-auto mb-1 text-violet-400" />
          <p className="text-xl font-bold">14d</p>
          <p className="text-xs text-muted-foreground">Avg Payment Days</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="credit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="credit">Bar/Restaurant Credit</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="aging">Aging Report</TabsTrigger>
        </TabsList>

        <TabsContent value="credit" className="space-y-3">
          {creditAccounts.map((acc) => (
            <Card key={acc.account} className={acc.status === "critical" ? "border-destructive/30" : acc.status === "warning" ? "border-amber-500/30" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Wine className="w-5 h-5 text-rose-400" />
                    <div>
                      <p className="font-semibold text-sm">{acc.account}</p>
                      <p className="text-xs text-muted-foreground">{acc.type} · Limit: {acc.limit} · Pay: {acc.paymentDays}d avg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`text-xs ${statusConfig[acc.status as keyof typeof statusConfig].color}`}>
                      Risk: {acc.riskScore}
                    </Badge>
                    {acc.utilPct > 85 && <Badge variant="destructive" className="text-xs"><Ban className="w-3 h-3 mr-0.5" />Near Limit</Badge>}
                  </div>
                </div>
                <Progress value={acc.utilPct} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">₦{(acc.utilized / 1000000).toFixed(1)}M utilized</span>
                  <span className="text-xs text-muted-foreground">{acc.utilPct}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-3">
          {reconciliation.map((r) => (
            <Card key={r.id}>
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {r.matched ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  <div>
                    <p className="font-medium text-sm">{r.account}</p>
                    <p className="text-xs text-muted-foreground">{r.id} · {r.method} · {r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-sm">{r.amount}</p>
                  <Badge className={r.matched ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}>
                    {r.matched ? "Matched" : "Unmatched"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="aging">
          <div className="grid grid-cols-4 gap-4">
            {[
              { range: "0-15 days", amount: "₦3.2M", pct: 47, color: "text-emerald-400" },
              { range: "16-30 days", amount: "₦1.8M", pct: 26, color: "text-blue-400" },
              { range: "31-60 days", amount: "₦1.2M", pct: 18, color: "text-amber-400" },
              { range: "60+ days", amount: "₦0.6M", pct: 9, color: "text-destructive" },
            ].map((b) => (
              <Card key={b.range}>
                <CardContent className="pt-5 text-center">
                  <p className={`text-2xl font-bold ${b.color}`}>{b.amount}</p>
                  <p className="text-sm font-medium mt-1">{b.range}</p>
                  <p className="text-xs text-muted-foreground">{b.pct}% of total AR</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorFinanceCredit;
