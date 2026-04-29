import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  DollarSign, CreditCard, TrendingUp, Clock, ShieldCheck, Zap,
  Users, Brain, BarChart3, CheckCircle, AlertTriangle, Wallet,
} from "lucide-react";

const retailerCredits = [
  { retailer: "The Gold Barrel Lounge", type: "Bar", limit: "₦8M", used: "₦5.2M", utilization: 65, paymentScore: 97, status: "Active", tenure: "4 years" },
  { retailer: "Metro Wines & Spirits", type: "Liquor Store", limit: "₦12M", used: "₦9.8M", utilization: 82, paymentScore: 94, status: "Active", tenure: "6 years" },
  { retailer: "Skyline Nightclub", type: "Nightclub", limit: "₦15M", used: "₦14.2M", utilization: 95, paymentScore: 88, status: "Warning", tenure: "3 years" },
  { retailer: "La Maison Bistro", type: "Restaurant", limit: "₦6M", used: "₦2.4M", utilization: 40, paymentScore: 99, status: "Active", tenure: "2 years" },
  { retailer: "Supreme Beverages", type: "Liquor Store", limit: "₦10M", used: "₦7.6M", utilization: 76, paymentScore: 92, status: "Active", tenure: "5 years" },
];

const distributorFinancing = [
  { distributor: "PrimeBev Distributors", facility: "Working Capital", amount: "₦50M", drawn: "₦32M", rate: "18%", tenor: "90 days", status: "Active" },
  { distributor: "Lagos Spirits Co.", facility: "Inventory Finance", amount: "₦30M", drawn: "₦24M", rate: "16%", tenor: "60 days", status: "Active" },
  { distributor: "NorthCity Beverages", facility: "Working Capital", amount: "₦20M", drawn: "₦8M", rate: "20%", tenor: "90 days", status: "Active" },
];

const loanApplications = [
  { applicant: "Corner Liquors Express", type: "Inventory Credit", amount: "₦2M", purpose: "Stock festive inventory", riskScore: 72, status: "Under Review" },
  { applicant: "Nite Owl Lounge", type: "Trade Loan", amount: "₦5M", purpose: "Bar renovation + stock", riskScore: 84, status: "Approved" },
  { applicant: "Mainland Drinks Ltd", type: "Working Capital", amount: "₦15M", purpose: "Fleet expansion", riskScore: 68, status: "Under Review" },
];

const LiquorTradeFinancing = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Trade Financing Hub</h1>
            <p className="text-sm text-muted-foreground">Embedded financing for retailers and distributors — credit, loans, and working capital</p>
          </div>
          <Button><Wallet className="w-4 h-4 mr-1" /> Apply for Credit</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Credit Lines", value: "₦486M", icon: CreditCard, color: "text-primary" },
            { label: "Utilization Rate", value: "68%", icon: BarChart3, color: "text-blue-500" },
            { label: "On-Time Payments", value: "94%", icon: CheckCircle, color: "text-emerald-500" },
            { label: "Pending Applications", value: "12", icon: Clock, color: "text-amber-500" },
          ].map(k => (
            <Card key={k.label}>
              <CardContent className="p-3 text-center">
                <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="retailer" className="space-y-4">
          <TabsList>
            <TabsTrigger value="retailer">Retailer Credit</TabsTrigger>
            <TabsTrigger value="distributor">Distributor Financing</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="retailer" className="space-y-3">
            {retailerCredits.map((r, i) => (
              <motion.div key={r.retailer} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{r.retailer}</p>
                          <Badge variant="outline">{r.type}</Badge>
                          <Badge className={
                            r.status === "Warning" ? "bg-amber-500/15 text-amber-600" : "bg-emerald-500/15 text-emerald-600"
                          }>{r.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Customer for {r.tenure} · Payment Score: {r.paymentScore}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{r.used}</p>
                        <p className="text-[10px] text-muted-foreground">of {r.limit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={r.utilization} className={`flex-1 h-2 ${r.utilization > 90 ? "[&>div]:bg-rose-500" : ""}`} />
                      <span className="text-xs font-medium">{r.utilization}%</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="distributor" className="space-y-3">
            {distributorFinancing.map((d, i) => (
              <motion.div key={d.distributor} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{d.distributor}</p>
                        <p className="text-xs text-muted-foreground">{d.facility} · {d.rate} p.a. · {d.tenor}</p>
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-600">{d.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={(parseFloat(d.drawn.replace(/[₦M]/g, "")) / parseFloat(d.amount.replace(/[₦M]/g, ""))) * 100} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{d.drawn} / {d.amount}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="applications" className="space-y-3">
            {loanApplications.map((l, i) => (
              <motion.div key={l.applicant} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className={`border-l-4 ${l.status === "Approved" ? "border-l-emerald-500" : "border-l-amber-500"}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold">{l.applicant}</p>
                        <p className="text-xs text-muted-foreground">{l.type} · {l.amount} · "{l.purpose}"</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Risk: {l.riskScore}</Badge>
                        <Badge className={l.status === "Approved" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"}>
                          {l.status}
                        </Badge>
                      </div>
                    </div>
                    {l.status === "Under Review" && (
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline"><CheckCircle className="w-3 h-3 mr-1" /> Approve</Button>
                        <Button size="sm" variant="outline" className="text-destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Decline</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Financing Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                Skyline Nightclub at 95% credit utilization — recommend triggering payment reminder. 
                La Maison Bistro has excellent payment behavior (99 score) with only 40% utilization — 
                candidate for credit limit increase to ₦10M to capture more premium wine orders.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorTradeFinancing;
