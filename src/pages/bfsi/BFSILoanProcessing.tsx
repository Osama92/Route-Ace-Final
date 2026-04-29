import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

const loans = [
  { id: "LN-4521", applicant: "Ngozi Enterprises", amount: "₦5M", type: "SME Loan", submitted: "2026-03-05", status: "under_review", creditScore: 720 },
  { id: "LN-4522", applicant: "Ibrahim Farms", amount: "₦2.5M", type: "Agri Loan", submitted: "2026-03-06", status: "approved", creditScore: 680 },
  { id: "LN-4523", applicant: "Ada Motors", amount: "₦8M", type: "Asset Finance", submitted: "2026-03-04", status: "disbursed", creditScore: 750 },
  { id: "LN-4524", applicant: "Kola Retail", amount: "₦1.2M", type: "Microfinance", submitted: "2026-03-07", status: "pending_docs", creditScore: 590 },
  { id: "LN-4525", applicant: "Bola Textiles", amount: "₦3M", type: "Working Capital", submitted: "2026-03-03", status: "rejected", creditScore: 420 },
];

const BFSILoanProcessing = () => (
  <IndustryLayout industryCode="bfsi">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Loan Application Processing</h1>
          <p className="text-muted-foreground">Manage loan applications, approvals, and disbursements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">342</p><p className="text-xs text-muted-foreground">Applications MTD</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-500">72%</p><p className="text-xs text-muted-foreground">Approval Rate</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦1.2B</p><p className="text-xs text-muted-foreground">Disbursed MTD</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">2.4 days</p><p className="text-xs text-muted-foreground">Avg Processing</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Applications</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loans.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  {l.status === "approved" || l.status === "disbursed" ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
                   l.status === "rejected" ? <XCircle className="w-5 h-5 text-red-500" /> :
                   <Clock className="w-5 h-5 text-amber-500" />}
                  <div><p className="font-semibold text-foreground">{l.id} — {l.applicant}</p><p className="text-xs text-muted-foreground">{l.type} • {l.amount} • Credit: {l.creditScore}</p></div>
                </div>
                <Badge variant={l.status === "approved" || l.status === "disbursed" ? "default" : l.status === "rejected" ? "destructive" : "secondary"}>
                  {l.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BFSILoanProcessing;
