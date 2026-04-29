import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CreditCard, TrendingUp, Shield } from "lucide-react";

const customers = [
  { name: "Ngozi Enterprises", segment: "SME", creditScore: 720, products: ["Loan", "Insurance"], balance: "₦8.4M", risk: "low" },
  { name: "Ibrahim Farms", segment: "Agriculture", creditScore: 680, products: ["Agri Loan"], balance: "₦2.1M", risk: "medium" },
  { name: "Ada Motors", segment: "Auto", creditScore: 750, products: ["Asset Finance", "Insurance"], balance: "₦12.8M", risk: "low" },
  { name: "Kola Retail", segment: "Micro", creditScore: 590, products: ["Microfinance"], balance: "₦450K", risk: "high" },
];

const BFSICustomerProfiling = () => (
  <IndustryLayout industryCode="bfsi">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Customer Financial Profiling</h1>
          <p className="text-muted-foreground">360° view of customer financial profiles and risk assessment</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Customer Profiles</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customers.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.segment} • Credit: {c.creditScore} • Products: {c.products.join(", ")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{c.balance}</span>
                  <Badge variant={c.risk === "low" ? "default" : c.risk === "high" ? "destructive" : "secondary"}>
                    {c.risk} risk
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BFSICustomerProfiling;
