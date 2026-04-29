/**
 * TenantWallet — Per-tenant wallet with auto-deduction,
 * top-up, and real-time billing for deliveries, API, and AI credits.
 */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet, CreditCard, Zap, TrendingUp, ArrowUpRight,
  ArrowDownLeft, AlertTriangle, RefreshCw, Shield, Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTenantConfig } from "@/hooks/useTenantConfig";

const fmt = (n: number) => `₦${n.toLocaleString()}`;

interface WalletTransaction {
  id: string;
  type: "debit" | "credit";
  category: "delivery" | "api_call" | "ai_credit" | "subscription" | "top_up" | "refund";
  description: string;
  amount: number;
  balance_after: number;
  timestamp: string;
}

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: "W-001", type: "credit", category: "top_up", description: "Wallet top-up via card", amount: 500000, balance_after: 892000, timestamp: "2m ago" },
  { id: "W-002", type: "debit", category: "delivery", description: "DSP-20240321-0012 (Multi-drop × 8 stops)", amount: 400, balance_after: 891600, timestamp: "15m ago" },
  { id: "W-003", type: "debit", category: "ai_credit", description: "Route optimization (2 credits)", amount: 100, balance_after: 891500, timestamp: "22m ago" },
  { id: "W-004", type: "debit", category: "api_call", description: "Tracking API × 45 calls", amount: 450, balance_after: 891050, timestamp: "1h ago" },
  { id: "W-005", type: "debit", category: "subscription", description: "Growth plan – March 2026", amount: 75000, balance_after: 816050, timestamp: "3d ago" },
  { id: "W-006", type: "debit", category: "delivery", description: "DSP-20240320-0087 (Haulage)", amount: 20000, balance_after: 796050, timestamp: "4d ago" },
  { id: "W-007", type: "credit", category: "refund", description: "Refund: cancelled dispatch DSP-0045", amount: 250, balance_after: 816300, timestamp: "5d ago" },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  delivery: { label: "Delivery", color: "bg-blue-500/10 text-blue-600" },
  api_call: { label: "API", color: "bg-purple-500/10 text-purple-600" },
  ai_credit: { label: "AI Credit", color: "bg-orange-500/10 text-orange-600" },
  subscription: { label: "Subscription", color: "bg-green-500/10 text-green-600" },
  top_up: { label: "Top-up", color: "bg-emerald-500/10 text-emerald-600" },
  refund: { label: "Refund", color: "bg-amber-500/10 text-amber-600" },
};

const TenantWallet = () => {
  const { config } = useTenantConfig();
  const [showAll, setShowAll] = useState(false);

  const walletBalance = 892000;
  const monthlySpend = 156400;
  const autoTopUp = true;
  const lowBalanceThreshold = 100000;
  const isLowBalance = walletBalance < lowBalanceThreshold;

  const aiCreditsUsed = config?.ai_credits_used || 0;
  const aiCreditsTotal = config?.ai_credits_total || 500;
  const aiPct = aiCreditsTotal > 0 ? Math.round((aiCreditsUsed / aiCreditsTotal) * 100) : 0;

  const displayed = showAll ? MOCK_TRANSACTIONS : MOCK_TRANSACTIONS.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={isLowBalance ? "border-destructive/40" : "border-primary/20"}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Wallet Balance</p>
                  <p className="text-xl font-bold mt-1">{fmt(walletBalance)}</p>
                  {isLowBalance && (
                    <span className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertTriangle className="h-3 w-3" /> Low balance
                    </span>
                  )}
                </div>
                <Wallet className="h-8 w-8 text-primary opacity-60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Spend</p>
                  <p className="text-xl font-bold mt-1">{fmt(monthlySpend)}</p>
                  <span className="text-xs text-muted-foreground">This billing cycle</span>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">AI Credits</p>
                  <p className="text-xl font-bold mt-1">{aiCreditsTotal - aiCreditsUsed} left</p>
                  <Progress value={aiPct} className="h-1.5 mt-2 w-24" />
                </div>
                <Zap className="h-8 w-8 text-yellow-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Auto Top-up</p>
                  <p className="text-sm font-semibold mt-1">
                    {autoTopUp ? "Enabled" : "Disabled"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Trigger at {fmt(lowBalanceThreshold)}
                  </span>
                </div>
                <RefreshCw className="h-8 w-8 text-green-500 opacity-60" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button size="sm" className="text-xs">
          <Plus className="h-3 w-3 mr-1" /> Top Up Wallet
        </Button>
        <Button size="sm" variant="outline" className="text-xs">
          <Zap className="h-3 w-3 mr-1" /> Buy AI Credits
        </Button>
        <Button size="sm" variant="outline" className="text-xs">
          <CreditCard className="h-3 w-3 mr-1" /> Payment Methods
        </Button>
      </div>

      {/* Billing Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Delivery Charges</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{fmt(82400)}</p>
            <p className="text-xs text-muted-foreground mt-1">1,648 drops × ₦50 avg</p>
            <Progress value={53} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">API Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{fmt(45000)}</p>
            <p className="text-xs text-muted-foreground mt-1">1,800 calls this cycle</p>
            <Progress value={36} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">AI Credit Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{fmt(29000)}</p>
            <p className="text-xs text-muted-foreground mt-1">290 credits consumed</p>
            <Progress value={aiPct} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Transaction History</CardTitle>
            <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : "View All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Balance</TableHead>
                <TableHead className="text-xs">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.map((tx) => {
                const cat = categoryLabels[tx.category];
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <Badge className={`text-[10px] ${cat.color}`}>{cat.label}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{tx.description}</TableCell>
                    <TableCell className={`text-xs font-semibold ${tx.type === "credit" ? "text-green-600" : "text-foreground"}`}>
                      {tx.type === "credit" ? "+" : "-"}{fmt(tx.amount)}
                    </TableCell>
                    <TableCell className="text-xs font-mono">{fmt(tx.balance_after)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{tx.timestamp}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Footer */}
      <Card className="border-primary/10">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span>All wallet transactions are recorded in an immutable ledger. Auto-deductions are scoped per tenant with zero cross-visibility.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantWallet;
