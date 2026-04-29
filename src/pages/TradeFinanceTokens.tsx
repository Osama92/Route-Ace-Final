import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Coins, Shield, FileText, TrendingUp, Plus, CheckCircle } from "lucide-react";

const mockTokens = [
  { id: "1", tokenId: "TFT-2026-001", contract: "NG-LOS-ABJ-0045", corridor: "Lagos → Abuja", asset: "Freight Receivable", yield: 8.5, maturity: "2026-06-15", risk: 12, insured: true, investor: "Institutional", status: "active", regulatory: "SEC-NG", amount: 15000000 },
  { id: "2", tokenId: "TFT-2026-002", contract: "NG-PHC-KAN-0078", corridor: "PH → Kano", asset: "Freight Receivable", yield: 9.2, maturity: "2026-08-30", risk: 18, insured: true, investor: "Institutional", status: "active", regulatory: "SEC-NG", amount: 8500000 },
  { id: "3", tokenId: "TFT-2026-003", contract: "GH-ACC-KUM-0012", corridor: "Accra → Kumasi", asset: "Trade Finance", yield: 7.8, maturity: "2026-05-20", risk: 22, insured: false, investor: "Retail", status: "draft", regulatory: "SEC-GH", amount: 3200000 },
  { id: "4", tokenId: "TFT-2026-004", contract: "ZA-JNB-CPT-0034", corridor: "JHB → Cape Town", asset: "Freight Receivable", yield: 6.5, maturity: "2026-12-01", risk: 8, insured: true, investor: "Institutional", status: "active", regulatory: "FSCA-ZA", amount: 22000000 },
];

const TradeFinanceTokens = () => {
  const totalIssuance = mockTokens.reduce((s, t) => s + t.amount, 0);
  const activeCount = mockTokens.filter(t => t.status === "active").length;
  const avgYield = (mockTokens.reduce((s, t) => s + t.yield, 0) / mockTokens.length).toFixed(1);
  const insuredCount = mockTokens.filter(t => t.insured).length;

  return (
    <DashboardLayout title="On-Chain Trade Finance" subtitle="Tokenized freight-backed trade instruments">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10"><Coins className="h-5 w-5 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Issuance</p><p className="text-2xl font-bold">₦{(totalIssuance / 1e6).toFixed(1)}M</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle className="h-5 w-5 text-emerald-500" /></div>
            <div><p className="text-sm text-muted-foreground">Active Tokens</p><p className="text-2xl font-bold">{activeCount}/{mockTokens.length}</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10"><TrendingUp className="h-5 w-5 text-blue-500" /></div>
            <div><p className="text-sm text-muted-foreground">Avg Yield</p><p className="text-2xl font-bold">{avgYield}%</p></div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><Shield className="h-5 w-5 text-amber-500" /></div>
            <div><p className="text-sm text-muted-foreground">Insurance Backed</p><p className="text-2xl font-bold">{insuredCount}/{mockTokens.length}</p></div>
          </div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Token Issuance Register</CardTitle>
          <Button size="sm"><Plus className="w-4 h-4 mr-2" />Issue Token</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token ID</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Corridor</TableHead>
                <TableHead>Asset Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Yield</TableHead>
                <TableHead>Maturity</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Insured</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTokens.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-sm">{t.tokenId}</TableCell>
                  <TableCell className="text-sm">{t.contract}</TableCell>
                  <TableCell>{t.corridor}</TableCell>
                  <TableCell><Badge variant="outline">{t.asset}</Badge></TableCell>
                  <TableCell className="font-semibold">₦{(t.amount / 1e6).toFixed(1)}M</TableCell>
                  <TableCell className="text-emerald-500 font-semibold">{t.yield}%</TableCell>
                  <TableCell className="text-sm">{t.maturity}</TableCell>
                  <TableCell>
                    <Badge variant={t.risk > 20 ? "destructive" : "outline"}>{t.risk}/100</Badge>
                  </TableCell>
                  <TableCell>
                    {t.insured ? <Shield className="w-4 h-4 text-emerald-500" /> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={t.status === "active" ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"}>
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

export default TradeFinanceTokens;
