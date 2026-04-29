import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  ShieldCheck, AlertTriangle, CheckCircle, Clock, FileText,
  Upload, Calendar, XCircle, Bell,
} from "lucide-react";

const complianceChecklist = [
  { item: "Liquor License", status: "valid", expiry: "Jun 30, 2026", daysLeft: 114, uploaded: true },
  { item: "Business Registration", status: "valid", expiry: "Dec 31, 2026", daysLeft: 298, uploaded: true },
  { item: "Tax Certificate", status: "expiring", expiry: "Apr 15, 2026", daysLeft: 38, uploaded: true },
  { item: "Fire Safety Certificate", status: "missing", expiry: null, daysLeft: null, uploaded: false },
  { item: "Health Permit", status: "valid", expiry: "Nov 30, 2026", daysLeft: 267, uploaded: true },
];

const expiryAlerts = [
  { document: "Tax Certificate", expiry: "Apr 15, 2026", daysLeft: 38, severity: "warning" },
  { document: "Liquor License", expiry: "Jun 30, 2026", daysLeft: 114, severity: "info" },
];

const auditHistory = [
  { date: "Mar 6, 2026", event: "Age verification check passed", result: "pass", cashier: "Cashier-04" },
  { date: "Mar 5, 2026", event: "License document re-uploaded", result: "pass", cashier: "Admin" },
  { date: "Mar 4, 2026", event: "Sale blocked — customer age 17", result: "fail", cashier: "Cashier-02" },
  { date: "Mar 3, 2026", event: "Monthly compliance report generated", result: "pass", cashier: "System" },
  { date: "Mar 1, 2026", event: "Tax certificate renewal reminder sent", result: "info", cashier: "System" },
];

const overallScore = 82;

const LiquorRetailerCompliance = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Retailer Compliance Dashboard</h1>
          <p className="text-sm text-muted-foreground">License status, expiry alerts & compliance checklist</p>
        </div>
      </div>

      {/* Compliance Score */}
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                strokeDasharray={`${overallScore * 2.64} 264`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">{overallScore}%</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-lg">Overall Compliance Score</p>
            <p className="text-sm text-muted-foreground">4 of 5 required documents uploaded and verified. 1 document missing.</p>
            <div className="flex gap-2 mt-2">
              <Badge className="bg-emerald-500/15 text-emerald-600">3 Valid</Badge>
              <Badge className="bg-amber-500/15 text-amber-600">1 Expiring</Badge>
              <Badge className="bg-destructive/15 text-destructive">1 Missing</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expiry Alerts */}
      {expiryAlerts.length > 0 && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4 space-y-2">
            {expiryAlerts.map((a) => (
              <div key={a.document} className="flex items-center gap-3">
                <Bell className={`w-5 h-5 flex-shrink-0 ${a.severity === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                <p className="text-sm flex-1">
                  <span className="font-semibold">{a.document}</span> expires on {a.expiry} ({a.daysLeft} days remaining)
                </p>
                <Button size="sm" variant="outline">Renew Now</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Checklist */}
        <Card>
          <CardHeader><CardTitle>Compliance Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {complianceChecklist.map((c, i) => (
              <motion.div key={c.item} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {c.status === "valid" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> :
                   c.status === "expiring" ? <Clock className="w-4 h-4 text-amber-500" /> :
                   <XCircle className="w-4 h-4 text-destructive" />}
                  <div>
                    <p className="text-sm font-medium">{c.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.expiry ? `Expires: ${c.expiry}` : "Not uploaded"}
                      {c.daysLeft !== null && ` · ${c.daysLeft}d left`}
                    </p>
                  </div>
                </div>
                {c.uploaded ? (
                  <Badge className={
                    c.status === "valid" ? "bg-emerald-500/15 text-emerald-600" :
                    c.status === "expiring" ? "bg-amber-500/15 text-amber-600" :
                    "bg-destructive/15 text-destructive"
                  }>{c.status === "valid" ? "Valid" : c.status === "expiring" ? "Expiring" : "Missing"}</Badge>
                ) : (
                  <Button size="sm" variant="outline" className="gap-1"><Upload className="w-3 h-3" /> Upload</Button>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Audit History */}
        <Card>
          <CardHeader><CardTitle>Recent Compliance Events</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {auditHistory.map((a, i) => (
              <motion.div key={`${a.date}-${i}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                {a.result === "pass" ? <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5" /> :
                 a.result === "fail" ? <XCircle className="w-4 h-4 text-destructive mt-0.5" /> :
                 <FileText className="w-4 h-4 text-blue-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm">{a.event}</p>
                  <p className="text-xs text-muted-foreground">{a.date} · {a.cashier}</p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default LiquorRetailerCompliance;
