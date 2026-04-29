import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Landmark, Shield, Globe, FileCheck, Clock } from "lucide-react";

const mockCBDC = [
  { id: "1", country: "Nigeria", code: "eNaira", corridor: "NG-UK", amount: 5000000, programmable: true, compliance: "compliant", finality: "settled", aml: 8, tax: "VAT-7.5%", status: "completed" },
  { id: "2", country: "Ghana", code: "eCedi", corridor: "GH-US", amount: 250000, programmable: false, compliance: "pending", finality: "pending", aml: 22, tax: "Exempt", status: "processing" },
  { id: "3", country: "South Africa", code: "eRand", corridor: "ZA-EU", amount: 1200000, programmable: true, compliance: "compliant", finality: "settled", aml: 5, tax: "VAT-15%", status: "completed" },
  { id: "4", country: "Kenya", code: "eKES", corridor: "KE-NG", amount: 800000, programmable: false, compliance: "review", finality: "pending", aml: 45, tax: "WHT-5%", status: "flagged" },
];

const CBDCIntegration = () => {
  const totalVolume = mockCBDC.reduce((s, t) => s + t.amount, 0);
  const settledCount = mockCBDC.filter(t => t.status === "completed").length;
  const complianceRate = Math.round((mockCBDC.filter(t => t.compliance === "compliant").length / mockCBDC.length) * 100);

  return (
    <DashboardLayout title="CBDC Integration Layer" subtitle="Sovereign digital currency settlement infrastructure">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Landmark className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Volume</p><p className="text-2xl font-bold">₦{(totalVolume / 1e6).toFixed(1)}M</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><FileCheck className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-sm text-muted-foreground">Settled</p><p className="text-2xl font-bold">{settledCount}/{mockCBDC.length}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><Globe className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-sm text-muted-foreground">Active CBDCs</p><p className="text-2xl font-bold">4</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><Shield className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Compliance Rate</p><p className="text-2xl font-bold">{complianceRate}%</p></div>
          </div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>CBDC Transaction Log</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>CBDC</TableHead>
                <TableHead>Corridor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Programmable</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>AML Score</TableHead>
                <TableHead>Tax Tag</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCBDC.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.country}</TableCell>
                  <TableCell><Badge variant="outline">{t.code}</Badge></TableCell>
                  <TableCell>{t.corridor}</TableCell>
                  <TableCell>₦{t.amount.toLocaleString()}</TableCell>
                  <TableCell>{t.programmable ? <Badge className="bg-primary/15 text-primary">Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                  <TableCell>
                    <Badge className={t.compliance === "compliant" ? "bg-emerald-500/15 text-emerald-500" : t.compliance === "review" ? "bg-amber-500/15 text-amber-500" : "bg-muted text-muted-foreground"}>
                      {t.compliance}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.aml > 30 ? "destructive" : t.aml > 15 ? "secondary" : "outline"}>{t.aml}/100</Badge>
                  </TableCell>
                  <TableCell>{t.tax}</TableCell>
                  <TableCell>
                    <Badge className={
                      t.status === "completed" ? "bg-emerald-500/15 text-emerald-500" :
                      t.status === "flagged" ? "bg-destructive/15 text-destructive" :
                      "bg-amber-500/15 text-amber-500"
                    }>
                      {t.status === "processing" && <Clock className="w-3 h-3 mr-1" />}
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CBDCIntegration;
