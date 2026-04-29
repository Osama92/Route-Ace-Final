import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, CreditCard, MapPin, TrendingUp } from "lucide-react";

const merchants = [
  { name: "QuickMart POS", location: "Ikeja", transactions: 4520, volume: "₦124M", status: "active", type: "POS Agent" },
  { name: "Alhaji Money Exchange", location: "Kano", transactions: 3200, volume: "₦89M", status: "active", type: "Mobile Money" },
  { name: "Grace Savings Hub", location: "Ibadan", transactions: 1800, volume: "₦42M", status: "active", type: "Microfinance" },
  { name: "TechPay Digital", location: "Lagos", transactions: 8900, volume: "₦312M", status: "premium", type: "Digital Payments" },
];

const BFSIMerchantNetwork = () => (
  <IndustryLayout industryCode="bfsi">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <Store className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Merchant Partner Network</h1>
          <p className="text-muted-foreground">Manage POS agents, mobile money, and payment partners</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">892</p><p className="text-xs text-muted-foreground">Active Merchants</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦567M</p><p className="text-xs text-muted-foreground">Monthly Volume</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">18.4K</p><p className="text-xs text-muted-foreground">Daily Transactions</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">99.2%</p><p className="text-xs text-muted-foreground">Uptime</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top Merchants</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {merchants.map((m) => (
              <div key={m.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{m.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{m.location} • {m.type}</p></div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{m.transactions.toLocaleString()} txns</span>
                  <span className="font-medium text-foreground">{m.volume}</span>
                  <Badge variant={m.status === "premium" ? "default" : "secondary"}>{m.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BFSIMerchantNetwork;
