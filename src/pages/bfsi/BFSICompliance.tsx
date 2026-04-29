import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, FileText, AlertTriangle, CheckCircle } from "lucide-react";

const checks = [
  { name: "KYC Verification", compliance: 96, total: 1200, passed: 1152, failed: 48, status: "good" },
  { name: "AML Screening", compliance: 99, total: 8400, passed: 8316, failed: 84, status: "excellent" },
  { name: "CBN Reporting", compliance: 100, total: 12, passed: 12, failed: 0, status: "excellent" },
  { name: "Data Privacy (NDPR)", compliance: 88, total: 24, passed: 21, failed: 3, status: "attention" },
  { name: "Agent Licensing", compliance: 92, total: 150, passed: 138, failed: 12, status: "good" },
];

const BFSICompliance = () => (
  <IndustryLayout industryCode="bfsi">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Regulatory Compliance</h1>
          <p className="text-muted-foreground">Monitor KYC, AML, and regulatory compliance across the network</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Compliance Dashboard</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((c) => (
              <div key={c.name} className="p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {c.status === "excellent" ? <CheckCircle className="w-4 h-4 text-emerald-500" /> :
                     c.status === "attention" ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                     <CheckCircle className="w-4 h-4 text-blue-500" />}
                    <p className="font-medium text-foreground">{c.name}</p>
                  </div>
                  <Badge variant={c.compliance >= 95 ? "default" : c.compliance >= 90 ? "secondary" : "destructive"}>{c.compliance}%</Badge>
                </div>
                <Progress value={c.compliance} className="h-2 mb-1" />
                <p className="text-xs text-muted-foreground">{c.passed}/{c.total} passed • {c.failed} failed</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BFSICompliance;
