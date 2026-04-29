import FMCGLayout from "@/components/fmcg/FMCGLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Wallet, ShieldCheck, TrendingUp, AlertTriangle, CreditCard, Banknote, HandCoins, Fuel, Receipt, Users, ArrowUpRight, Clock } from "lucide-react";

const distributorCredits = [
  { name: "Dangote Distributors Ltd", region: "Lagos West", score: 87, limit: 25000000, utilized: 14200000, velocity: "High", turnover: 4.2, status: "active", products: ["Inventory Credit", "Working Capital"] },
  { name: "Olam West Africa", region: "Abuja FCT", score: 92, limit: 40000000, utilized: 18500000, velocity: "Very High", turnover: 5.1, status: "active", products: ["Inventory Credit", "Promotion Finance"] },
  { name: "TGI Distribution", region: "Kano North", score: 74, limit: 15000000, utilized: 13800000, velocity: "Medium", turnover: 3.1, status: "review", products: ["Inventory Credit"] },
  { name: "Chi Distribution Network", region: "PH South", score: 81, limit: 20000000, utilized: 9200000, velocity: "High", turnover: 3.8, status: "active", products: ["Working Capital", "Promotion Finance"] },
  { name: "Promasidor Partners", region: "Ibadan SW", score: 68, limit: 10000000, utilized: 9400000, velocity: "Low", turnover: 2.4, status: "warning", products: ["Inventory Credit"] },
];

const financingProducts = [
  { name: "Inventory Credit", description: "Purchase stock from manufacturers using RouteAce financing", totalDisbursed: "₦2.4B", activeLoans: 42, avgTenure: "45 days", defaultRate: 2.1, apr: 18 },
  { name: "Delivery Working Capital", description: "Short-term financing for fuel, wages, delivery operations", totalDisbursed: "₦890M", activeLoans: 28, avgTenure: "14 days", defaultRate: 1.4, apr: 24 },
  { name: "Promotion Financing", description: "Finance trade promotions and retail incentives", totalDisbursed: "₦560M", activeLoans: 15, avgTenure: "60 days", defaultRate: 3.2, apr: 15 },
];

const riskFactors = [
  { factor: "Sales Velocity", weight: 25, description: "Volume and consistency of sales throughput" },
  { factor: "Inventory Turnover", weight: 20, description: "How quickly stock converts to revenue" },
  { factor: "Payment History", weight: 20, description: "Track record of on-time repayments" },
  { factor: "Delivery Completion", weight: 15, description: "Percentage of successful deliveries" },
  { factor: "Market Demand Trends", weight: 10, description: "Territory-specific demand trajectory" },
  { factor: "Territory Coverage", weight: 10, description: "Breadth of retail network served" },
];

const recentDisbursements = [
  { distributor: "Dangote Distributors", product: "Inventory Credit", amount: 5200000, date: "Today", tenure: "45 days", status: "disbursed" },
  { distributor: "Olam West Africa", product: "Working Capital", amount: 2800000, date: "Yesterday", tenure: "14 days", status: "disbursed" },
  { distributor: "Chi Distribution", product: "Promotion Finance", amount: 1500000, date: "2 days ago", tenure: "60 days", status: "pending_approval" },
  { distributor: "TGI Distribution", product: "Inventory Credit", amount: 3200000, date: "3 days ago", tenure: "30 days", status: "repaid" },
];

const FMCGDistributorFinancing = () => {
  return (
    <FMCGLayout title="Distributor Financing Layer" subtitle="Embedded fintech — AI-powered working capital, inventory credit & promotion financing">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Book Size", value: "₦3.8B", icon: Wallet, color: "text-blue-600" },
          { label: "Active Facilities", value: "85", icon: CreditCard, color: "text-green-600" },
          { label: "Avg Default Rate", value: "2.2%", icon: ShieldCheck, color: "text-emerald-600" },
          { label: "Portfolio Yield", value: "19.4%", icon: TrendingUp, color: "text-purple-600" },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <m.icon className={`w-8 h-8 ${m.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-2xl font-bold">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="credit-engine">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="credit-engine" className="gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Credit Engine</TabsTrigger>
          <TabsTrigger value="products" className="gap-1"><Banknote className="w-3.5 h-3.5" /> Financing Products</TabsTrigger>
          <TabsTrigger value="risk-model" className="gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Risk Model</TabsTrigger>
          <TabsTrigger value="disbursements" className="gap-1"><HandCoins className="w-3.5 h-3.5" /> Disbursements</TabsTrigger>
        </TabsList>

        <TabsContent value="credit-engine">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" /> Distributor Credit Profiles</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributorCredits.map((d) => (
                  <div key={d.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{d.name}</h3>
                        <p className="text-sm text-muted-foreground">{d.region}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={d.status === "active" ? "default" : d.status === "review" ? "secondary" : "destructive"}>
                          {d.status}
                        </Badge>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${d.score >= 80 ? "bg-green-100 text-green-700" : d.score >= 70 ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                          {d.score}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Credit Limit</p>
                        <p className="font-medium">₦{(d.limit / 1000000).toFixed(0)}M</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Utilization</p>
                        <div className="flex items-center gap-2">
                          <Progress value={(d.utilized / d.limit) * 100} className="h-2 flex-1" />
                          <span className="text-xs">{Math.round((d.utilized / d.limit) * 100)}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Sales Velocity</p>
                        <p className="font-medium">{d.velocity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Inv. Turnover</p>
                        <p className="font-medium">{d.turnover}x</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Products</p>
                        <div className="flex gap-1 flex-wrap">
                          {d.products.map(p => <Badge key={p} variant="outline" className="text-xs">{p}</Badge>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="w-5 h-5" /> Financing Product Suite</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                {financingProducts.map((p) => (
                  <div key={p.name} className="p-6 border-2 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{p.name}</h3>
                        <p className="text-sm text-muted-foreground">{p.description}</p>
                      </div>
                      <Badge variant="default" className="text-lg px-4 py-1">{p.apr}% APR</Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Total Disbursed</p>
                        <p className="text-xl font-bold">{p.totalDisbursed}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Active Loans</p>
                        <p className="text-xl font-bold">{p.activeLoans}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Avg Tenure</p>
                        <p className="text-xl font-bold">{p.avgTenure}</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">Default Rate</p>
                        <p className={`text-xl font-bold ${p.defaultRate > 3 ? "text-red-600" : "text-green-600"}`}>{p.defaultRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-model">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> AI Credit Risk Model</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Distributor Credit Score Composition</h3>
                <p className="text-sm text-muted-foreground">AI evaluates distributor creditworthiness using weighted factors from operational and financial signals</p>
              </div>
              <div className="space-y-4">
                {riskFactors.map((f) => (
                  <div key={f.factor} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{f.factor}</h3>
                        <p className="text-sm text-muted-foreground">{f.description}</p>
                      </div>
                      <span className="text-2xl font-bold text-primary">{f.weight}%</span>
                    </div>
                    <Progress value={f.weight * 4} className="h-3" />
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 border-2 border-dashed rounded-xl">
                <h3 className="font-bold mb-3">AI Decision Output</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Credit Limit</p>
                    <p className="text-lg font-bold text-green-700">Auto-calculated</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Interest Rate</p>
                    <p className="text-lg font-bold text-blue-700">Risk-adjusted</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Loan Approval</p>
                    <p className="text-lg font-bold text-purple-700">AI-scored</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disbursements">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Receipt className="w-5 h-5" /> Recent Disbursements</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDisbursements.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {d.status === "disbursed" ? <ArrowUpRight className="w-5 h-5 text-green-600" /> : d.status === "repaid" ? <ShieldCheck className="w-5 h-5 text-blue-600" /> : <Clock className="w-5 h-5 text-orange-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{d.distributor}</h3>
                        <p className="text-sm text-muted-foreground">{d.product} · {d.tenure}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">₦{(d.amount / 1000000).toFixed(1)}M</p>
                        <p className="text-xs text-muted-foreground">{d.date}</p>
                      </div>
                      <Badge variant={d.status === "disbursed" ? "default" : d.status === "repaid" ? "secondary" : "outline"}>
                        {d.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FMCGLayout>
  );
};

export default FMCGDistributorFinancing;
