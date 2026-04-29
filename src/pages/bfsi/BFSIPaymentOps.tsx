import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowRightLeft, TrendingUp } from "lucide-react";

const transactions = [
  { id: "TXN-8901", type: "P2P Transfer", amount: "₦250K", sender: "Chidi O.", receiver: "Ada M.", status: "completed", time: "2 min ago" },
  { id: "TXN-8902", type: "Loan Disbursement", amount: "₦5M", sender: "System", receiver: "Ngozi Ent.", status: "processing", time: "5 min ago" },
  { id: "TXN-8903", type: "Insurance Premium", amount: "₦1.2M", sender: "MTN Nigeria", receiver: "NAICOM Pool", status: "completed", time: "12 min ago" },
  { id: "TXN-8904", type: "Savings Deposit", amount: "₦85K", sender: "Ibrahim F.", receiver: "Savings Acc", status: "completed", time: "18 min ago" },
  { id: "TXN-8905", type: "Bill Payment", amount: "₦45K", sender: "Kola R.", receiver: "DSTV", status: "failed", time: "22 min ago" },
];

const BFSIPaymentOps = () => (
  <IndustryLayout industryCode="bfsi">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <CreditCard className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Payment Operations</h1>
          <p className="text-muted-foreground">Monitor payment processing, settlements, and transaction flows</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">24.8K</p><p className="text-xs text-muted-foreground">Today's Transactions</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦1.8B</p><p className="text-xs text-muted-foreground">Daily Volume</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-500">99.4%</p><p className="text-xs text-muted-foreground">Success Rate</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">1.2s</p><p className="text-xs text-muted-foreground">Avg Response</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-blue-500" />Recent Transactions</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{t.id} — {t.type}</p><p className="text-xs text-muted-foreground">{t.sender} → {t.receiver} • {t.time}</p></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{t.amount}</span>
                  <Badge variant={t.status === "completed" ? "default" : t.status === "failed" ? "destructive" : "secondary"}>{t.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BFSIPaymentOps;
