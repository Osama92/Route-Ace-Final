import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/usePermissions";
import { Shield, CheckCircle, AlertTriangle, Coins } from "lucide-react";
import TransactionLogTab, { type StablecoinTransaction } from "@/components/stablecoin/TransactionLogTab";
import ComplianceTab from "@/components/stablecoin/ComplianceTab";
import BusinessWalletsTab from "@/components/stablecoin/BusinessWalletsTab";
import FiatConversionTab from "@/components/stablecoin/FiatConversionTab";
import TreasuryExposureTab from "@/components/stablecoin/TreasuryExposureTab";

const mockTransactions: StablecoinTransaction[] = [
  { id: "1", hash: "0x7a3f...e9b2", sender: "0x1234...abcd", receiver: "0x9876...ef01", token: "USDT", network: "Ethereum", amount: 25000, riskScore: 12, amlFlag: "clear", status: "settled", country: "UK", walletAge: 892, exchangeSource: "Coinbase" },
  { id: "2", hash: "0x8b4c...f1a3", sender: "0x5678...dcba", receiver: "0x9876...ef01", token: "USDC", network: "Polygon", amount: 150000, riskScore: 68, amlFlag: "review", status: "pending_review", country: "US", walletAge: 45, exchangeSource: "Unknown" },
  { id: "3", hash: "TRX...x9f2", sender: "T9Yq...3mKp", receiver: "T7Hx...8nRq", token: "USDT", network: "Tron", amount: 8500, riskScore: 5, amlFlag: "clear", status: "settled", country: "Nigeria", walletAge: 1204, exchangeSource: "Binance" },
  { id: "4", hash: "0xcc1d...b4e7", sender: "0xaaaa...1111", receiver: "0x9876...ef01", token: "EURC", network: "Ethereum", amount: 500000, riskScore: 85, amlFlag: "flagged", status: "frozen", country: "Unknown", walletAge: 3, exchangeSource: "Mixer detected" },
];

const StablecoinSettlement = () => {
  const { isSuperAdmin, isFinanceManager } = usePermissions();

  const totalVolume = mockTransactions.reduce((s, t) => s + t.amount, 0);
  const settledCount = mockTransactions.filter(t => t.status === "settled").length;
  const flaggedCount = mockTransactions.filter(t => t.amlFlag === "flagged").length;
  const avgRisk = Math.round(mockTransactions.reduce((s, t) => s + t.riskScore, 0) / mockTransactions.length);

  return (
    <DashboardLayout title="Stablecoin Settlement Engine" subtitle="Compliant digital settlement with full transparency & AML enforcement">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10"><Coins className="h-5 w-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">Total Volume</p><p className="text-2xl font-bold">${totalVolume.toLocaleString()}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-emerald-500/10"><CheckCircle className="h-5 w-5 text-emerald-500" /></div><div><p className="text-sm text-muted-foreground">Settled</p><p className="text-2xl font-bold">{settledCount}/{mockTransactions.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-destructive/10"><AlertTriangle className="h-5 w-5 text-destructive" /></div><div><p className="text-sm text-muted-foreground">Flagged</p><p className="text-2xl font-bold">{flaggedCount}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-amber-500/10"><Shield className="h-5 w-5 text-amber-500" /></div><div><p className="text-sm text-muted-foreground">Avg Risk Score</p><p className="text-2xl font-bold">{avgRisk}/100</p></div></div></CardContent></Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transaction Log</TabsTrigger>
          {(isSuperAdmin || isFinanceManager) && <TabsTrigger value="compliance">AML & Compliance</TabsTrigger>}
          {isSuperAdmin && <TabsTrigger value="wallets">Business Wallets</TabsTrigger>}
          {isSuperAdmin && <TabsTrigger value="conversion">Fiat Conversion</TabsTrigger>}
          <TabsTrigger value="treasury">Treasury Exposure</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions"><TransactionLogTab transactions={mockTransactions} /></TabsContent>
        <TabsContent value="compliance"><ComplianceTab transactions={mockTransactions} /></TabsContent>
        <TabsContent value="wallets"><BusinessWalletsTab /></TabsContent>
        <TabsContent value="conversion"><FiatConversionTab /></TabsContent>
        <TabsContent value="treasury"><TreasuryExposureTab /></TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default StablecoinSettlement;
