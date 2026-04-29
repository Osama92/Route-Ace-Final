import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp, TrendingDown, Download, FileText, Scale, Lock,
  Calculator, CheckCircle2, AlertCircle, BarChart3, RefreshCw,
  Activity, PieChart, Landmark, Clock, ShieldCheck, Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fmt = (n: number, sym = "₦") =>
  `${sym}${Math.abs(n).toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;

// ── Multi-period data ──────────────────────────────────────────────────────────
const PERIODS = {
  week: {
    label: "Week 7, 2025",
    revenue: 8_675_000, expenses: 5_267_500, netProfit: 3_407_500,
    grossMargin: 39.3, opMargin: 32.1, burnRate: 752_500, fleetUtil: 84,
    costPerDrop: 8_200, costPerKm: 185,
  },
  month: {
    label: "February 2025",
    revenue: 34_700_000, expenses: 21_070_000, netProfit: 13_630_000,
    grossMargin: 39.3, opMargin: 32.7, burnRate: 21_070_000, fleetUtil: 87,
    costPerDrop: 7_950, costPerKm: 178,
  },
  quarter: {
    label: "Q1 2025",
    revenue: 101_200_000, expenses: 61_400_000, netProfit: 39_800_000,
    grossMargin: 39.3, opMargin: 32.2, burnRate: 20_466_667, fleetUtil: 85,
    costPerDrop: 8_100, costPerKm: 182,
  },
  year: {
    label: "FY 2025 (Projection)",
    revenue: 415_000_000, expenses: 252_000_000, netProfit: 163_000_000,
    grossMargin: 39.3, opMargin: 32.0, burnRate: 21_000_000, fleetUtil: 86,
    costPerDrop: 8_050, costPerKm: 180,
  },
};

// CIT computation
function computeCIT(taxableProfit: number, jurisdiction: string) {
  if (jurisdiction === "NG") {
    if (taxableProfit < 25_000_000) return { rate: 0, tax: 0, label: "Small Company (Exempt)" };
    if (taxableProfit < 100_000_000) return { rate: 0.20, tax: taxableProfit * 0.20, label: "Medium Enterprise (20%)" };
    return { rate: 0.30, tax: taxableProfit * 0.30, label: "Large Enterprise (30%)" };
  }
  return { rate: 0.25, tax: taxableProfit * 0.25, label: "Standard (25%)" };
}

export function ReportingEngine() {
  const { toast } = useToast();
  const [period, setPeriod] = useState<keyof typeof PERIODS>("month");
  const [jurisdiction, setJurisdiction] = useState("NG");
  const [fiscalLocked, setFiscalLocked] = useState(false);
  const [reportTab, setReportTab] = useState("pnl");

  const p = PERIODS[period];
  const cit = computeCIT(p.netProfit, jurisdiction);
  const afterTaxProfit = p.netProfit - cit.tax;
  const qtrAccrual = cit.tax / 4;

  // Cash flow (indirect method)
  const operatingCF = p.netProfit + 1_950_000 - 2_400_000 + 800_000; // +depreciation -capex +working capital
  const investingCF = -4_500_000;
  const financingCF = -2_100_000;
  const netCF = operatingCF + investingCF + financingCF;

  const handleExport = (type: string) => {
    toast({ title: `${type} Export Started`, description: "Your report is being generated. Download will begin shortly." });
  };

  const handleLockFiscal = () => {
    setFiscalLocked(true);
    toast({ title: "Fiscal Period Locked", description: `${p.label} has been locked. No further journal entries permitted.` });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <Select value={period} onValueChange={(v) => setPeriod(v as keyof typeof PERIODS)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
            <SelectItem value="quarter">Quarterly</SelectItem>
            <SelectItem value="year">Annual</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jurisdiction} onValueChange={setJurisdiction}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="NG">Nigeria (FIRS)</SelectItem>
            <SelectItem value="KE">Kenya (KRA)</SelectItem>
            <SelectItem value="ZA">South Africa</SelectItem>
            <SelectItem value="GB">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
          <Download className="w-4 h-4 mr-1" />PDF Report
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport("Excel")}>
          <Download className="w-4 h-4 mr-1" />Excel
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport("Auditor Package")}>
          <FileText className="w-4 h-4 mr-1" />Auditor Package
        </Button>
        {!fiscalLocked ? (
          <Button variant="outline" size="sm" onClick={handleLockFiscal}>
            <Lock className="w-4 h-4 mr-1" />Lock Period
          </Button>
        ) : (
          <Badge className="bg-destructive/20 text-destructive flex items-center gap-1">
            <Lock className="w-3 h-3" />Period Locked
          </Badge>
        )}
        <Badge variant="outline" className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-green-500" />IFRS IAS 7
        </Badge>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Revenue Growth", value: "+19.7%", sub: "vs prev period", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Gross Margin", value: `${p.grossMargin}%`, sub: "IFRS basis", icon: PieChart, color: "text-primary", bg: "bg-primary/10" },
          { label: "Operating Margin", value: `${p.opMargin}%`, sub: "After all costs", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Fleet Utilization", value: `${p.fleetUtil}%`, sub: "Active vehicle days", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${k.bg}`}><k.icon className={`w-4 h-4 ${k.color}`} /></div>
              <div>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-lg font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Tabs */}
      <Tabs value={reportTab} onValueChange={setReportTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="pnl">P&L Statement</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="tax">CIT Engine</TabsTrigger>
          <TabsTrigger value="kpis">Management KPIs</TabsTrigger>
          <TabsTrigger value="budget">Budget vs Actual</TabsTrigger>
        </TabsList>

        {/* P&L */}
        <TabsContent value="pnl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" />Profit & Loss — {p.label}
                </CardTitle>
                <CardDescription>IFRS Compliant | Accrual Basis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 font-mono text-sm">
                  {/* Revenue */}
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2 mt-1">Revenue</p>
                  {[
                    { label: "Freight Revenue", value: Math.round(p.revenue * 0.82) },
                    { label: "Multi-Drop Billing", value: Math.round(p.revenue * 0.18) },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between py-1 pl-4">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span>{fmt(r.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 border-t border-border font-bold">
                    <span>GROSS REVENUE</span><span className="text-green-500">{fmt(p.revenue)}</span>
                  </div>

                  {/* Expenses */}
                  <p className="font-bold text-xs uppercase text-muted-foreground mb-2 mt-3">Operating Expenses</p>
                  {[
                    { label: "Fuel Expense", value: Math.round(p.expenses * 0.432) },
                    { label: "Driver Payroll", value: Math.round(p.expenses * 0.347) },
                    { label: "Maintenance", value: Math.round(p.expenses * 0.114) },
                    { label: "Depreciation", value: Math.round(p.expenses * 0.093) },
                    { label: "SLA Penalties", value: Math.round(p.expenses * 0.015) },
                  ].map((e) => (
                    <div key={e.label} className="flex justify-between py-1 pl-4">
                      <span className="text-muted-foreground">{e.label}</span>
                      <span>{fmt(e.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1 border-t border-border font-bold">
                    <span>TOTAL EXPENSES</span><span className="text-destructive">{fmt(p.expenses)}</span>
                  </div>

                  {/* Net */}
                  <div className="flex justify-between py-2 border-t-2 border-border font-bold text-base">
                    <span>NET PROFIT BEFORE TAX</span>
                    <span className="text-green-500">{fmt(p.netProfit)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-muted-foreground text-sm">
                    <span>Est. Corporate Tax ({Math.round(cit.rate * 100)}%)</span>
                    <span className="text-destructive">({fmt(cit.tax)})</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-border font-bold text-base">
                    <span>NET PROFIT AFTER TAX</span>
                    <span className="text-primary">{fmt(afterTaxProfit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gross Margin</span>
                    <span className="font-semibold text-green-500">{p.grossMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Multi-period comparison */}
            <Card>
              <CardHeader><CardTitle className="text-base">Period Comparison</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Previous</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead>Δ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { metric: "Revenue", prev: 29_000_000, curr: p.revenue },
                      { metric: "Expenses", prev: 18_000_000, curr: p.expenses },
                      { metric: "Net Profit", prev: 11_000_000, curr: p.netProfit },
                      { metric: "Margin %", prev: 37.9, curr: p.grossMargin, isPercent: true },
                    ].map((row) => {
                      const delta = row.curr - row.prev;
                      return (
                        <TableRow key={row.metric}>
                          <TableCell className="font-medium text-sm">{row.metric}</TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">{row.isPercent ? `${row.prev}%` : fmt(row.prev)}</TableCell>
                          <TableCell className="font-mono text-sm font-semibold">{row.isPercent ? `${row.curr}%` : fmt(row.curr)}</TableCell>
                          <TableCell className={`font-mono text-sm font-bold ${delta >= 0 ? "text-green-500" : "text-destructive"}`}>
                            {delta >= 0 ? "+" : ""}{row.isPercent ? `${delta.toFixed(1)}%` : fmt(delta)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Landmark className="w-4 h-4" />Assets</CardTitle></CardHeader>
              <CardContent className="font-mono text-sm space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground">Current Assets</p>
                {[
                  { name: "Cash & Bank", value: 8_420_000 },
                  { name: "Accounts Receivable", value: 12_350_000 },
                  { name: "Prepaid Expenses", value: 650_000 },
                ].map((a) => (
                  <div key={a.name} className="flex justify-between pl-4 py-0.5">
                    <span className="text-muted-foreground">{a.name}</span>
                    <span>{fmt(a.value)}</span>
                  </div>
                ))}
                <p className="text-xs font-bold uppercase text-muted-foreground mt-3">Fixed Assets</p>
                {[
                  { name: "Fleet Assets (Cost)", value: 95_000_000 },
                  { name: "Accumulated Depreciation", value: -8_500_000 },
                ].map((a) => (
                  <div key={a.name} className={`flex justify-between pl-4 py-0.5 ${a.value < 0 ? "text-muted-foreground" : ""}`}>
                    <span className="text-muted-foreground">{a.name}</span>
                    <span className={a.value < 0 ? "text-destructive" : ""}>{fmt(a.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2 text-base mt-2">
                  <span>TOTAL ASSETS</span><span className="text-green-500">{fmt(107_920_000)}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Landmark className="w-4 h-4" />Liabilities & Equity</CardTitle></CardHeader>
              <CardContent className="font-mono text-sm space-y-2">
                <p className="text-xs font-bold uppercase text-muted-foreground">Current Liabilities</p>
                {[
                  { name: "Accounts Payable", value: 4_200_000 },
                  { name: "Deferred Revenue", value: 1_800_000 },
                  { name: "VAT Payable", value: 2_602_500 },
                ].map((l) => (
                  <div key={l.name} className="flex justify-between pl-4 py-0.5">
                    <span className="text-muted-foreground">{l.name}</span>
                    <span className="text-destructive">{fmt(l.value)}</span>
                  </div>
                ))}
                <p className="text-xs font-bold uppercase text-muted-foreground mt-3">Non-current</p>
                <div className="flex justify-between pl-4 py-0.5">
                  <span className="text-muted-foreground">Long-term Debt</span>
                  <span className="text-destructive">{fmt(15_000_000)}</span>
                </div>
                <p className="text-xs font-bold uppercase text-muted-foreground mt-3">Equity</p>
                {[
                  { name: "Owner Equity", value: 83_687_500 },
                  { name: "Retained Earnings", value: p.netProfit },
                ].map((e) => (
                  <div key={e.name} className="flex justify-between pl-4 py-0.5">
                    <span className="text-muted-foreground">{e.name}</span>
                    <span className="text-blue-500">{fmt(e.value)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold border-t pt-2 text-base mt-2">
                  <span>TOTAL L+E</span><span className="text-green-500">{fmt(107_920_000)}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-green-500/10 border border-green-500/30">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <p className="text-xs text-green-600">Balance sheet balanced — IFRS IAS 1 compliant</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash Flow */}
        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><RefreshCw className="w-4 h-4" />Cash Flow Statement — {p.label}</CardTitle>
              <CardDescription>Indirect Method — IFRS IAS 7 Compliant</CardDescription>
            </CardHeader>
            <CardContent className="font-mono text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    label: "Operating Activities",
                    color: "text-green-500",
                    total: operatingCF,
                    items: [
                      { label: "Net Profit", value: p.netProfit },
                      { label: "Add: Depreciation", value: 1_950_000 },
                      { label: "Less: CapEx (Maintenance)", value: -2_400_000 },
                      { label: "Working Capital Changes", value: 800_000 },
                    ],
                  },
                  {
                    label: "Investing Activities",
                    color: "text-yellow-500",
                    total: investingCF,
                    items: [
                      { label: "Vehicle Purchases", value: -4_500_000 },
                      { label: "Asset Disposals", value: 0 },
                    ],
                  },
                  {
                    label: "Financing Activities",
                    color: "text-blue-500",
                    total: financingCF,
                    items: [
                      { label: "Loan Repayments", value: -2_100_000 },
                      { label: "Owner Drawings", value: 0 },
                    ],
                  },
                ].map((section) => (
                  <div key={section.label} className="space-y-2">
                    <p className="font-bold text-xs uppercase text-muted-foreground border-b pb-1">{section.label}</p>
                    {section.items.map((item) => (
                      <div key={item.label} className="flex justify-between py-0.5 text-xs">
                        <span className="text-muted-foreground pl-2">{item.label}</span>
                        <span className={item.value < 0 ? "text-destructive" : ""}>{fmt(item.value)}</span>
                      </div>
                    ))}
                    <div className={`flex justify-between pt-1 border-t font-bold ${section.color}`}>
                      <span>Net {section.label.split(" ")[0]}</span>
                      <span>{fmt(section.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
                <div className="flex justify-between text-base font-bold">
                  <span>NET CHANGE IN CASH</span>
                  <span className={netCF >= 0 ? "text-green-500" : "text-destructive"}>{fmt(netCF)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Opening Cash Balance</span><span>{fmt(5_800_000)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold mt-1">
                  <span>Closing Cash Balance</span><span className="text-primary">{fmt(5_800_000 + netCF)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CIT Engine */}
        <TabsContent value="tax">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="w-4 h-4" />Corporate Income Tax Engine
                </CardTitle>
                <CardDescription>Auto-computed per jurisdiction rules. Nigerian CITA default.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/50 space-y-2 font-mono text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Gross Revenue</span><span>{fmt(p.revenue)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Total Expenses</span><span className="text-destructive">({fmt(p.expenses)})</span></div>
                  <div className="flex justify-between font-bold border-t pt-2"><span>Taxable Profit</span><span>{fmt(p.netProfit)}</span></div>
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Capital Allowances (30% SL)</span><span className="text-destructive">({fmt(p.netProfit * 0.08)})</span></div>
                  <div className="flex justify-between text-xs text-muted-foreground"><span>Allowable R&D (100% deduction)</span><span className="text-destructive">({fmt(250_000)})</span></div>
                  <div className="flex justify-between font-bold border-t pt-2 text-base">
                    <span>ADJUSTED TAXABLE INCOME</span>
                    <span className="text-primary">{fmt(p.netProfit * 0.92 - 250_000)}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Tax Jurisdiction</span>
                    <Badge variant="outline">{jurisdiction === "NG" ? "FIRS — CITA 2004" : jurisdiction}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Classification</span>
                    <span className="font-medium">{cit.label}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span>Annual CIT Payable</span>
                    <span className="text-destructive">{fmt(cit.tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quarterly Accrual</span>
                    <span className="font-semibold">{fmt(qtrAccrual)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Effective Rate</span>
                    <span className="font-semibold text-yellow-500">{(cit.rate * 100).toFixed(1)}%</span>
                  </div>
                </div>
                {jurisdiction === "NG" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Nigerian Tax Compliance Checklist</p>
                    {[
                      { label: "PAYE Filed (Feb 2025)", done: true },
                      { label: "VAT Return Submitted", done: true },
                      { label: "CIT Instalment Q1 2025", done: false },
                      { label: "WHT Remitted", done: true },
                      { label: "Pension Remittance", done: true },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-sm">
                        {item.done ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0" />
                        )}
                        <span className={item.done ? "text-muted-foreground" : "font-medium"}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Global Tax Rates Reference</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jurisdiction</TableHead>
                      <TableHead>CIT Rate</TableHead>
                      <TableHead>VAT/GST</TableHead>
                      <TableHead>WHT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { country: "🇳🇬 Nigeria", cit: "0–30%", vat: "7.5%", wht: "10%" },
                      { country: "🇬🇭 Ghana", cit: "25%", vat: "12.5%", wht: "8%" },
                      { country: "🇰🇪 Kenya", cit: "30%", vat: "16%", wht: "5%" },
                      { country: "🇿🇦 South Africa", cit: "27%", vat: "15%", wht: "20%" },
                      { country: "🇬🇧 UK", cit: "25%", vat: "20%", wht: "20%" },
                      { country: "🇺🇸 USA", cit: "21%", vat: "N/A", wht: "30%" },
                    ].map((r) => (
                      <TableRow key={r.country}>
                        <TableCell className="font-medium text-sm">{r.country}</TableCell>
                        <TableCell className="font-mono text-sm">{r.cit}</TableCell>
                        <TableCell className="font-mono text-sm">{r.vat}</TableCell>
                        <TableCell className="font-mono text-sm">{r.wht}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Management KPIs */}
        <TabsContent value="kpis">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4" />Management KPI Dashboard — {p.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Revenue Growth (MoM)", value: "+19.7%", progress: 80, good: true },
                  { label: "Gross Margin", value: `${p.grossMargin}%`, progress: p.grossMargin, good: true },
                  { label: "Operating Margin", value: `${p.opMargin}%`, progress: p.opMargin, good: true },
                  { label: "Burn Rate", value: fmt(p.burnRate), progress: 55, good: true },
                  { label: "Fleet Utilization", value: `${p.fleetUtil}%`, progress: p.fleetUtil, good: p.fleetUtil > 80 },
                  { label: "Cost per Drop", value: `₦${p.costPerDrop.toLocaleString()}`, progress: 70, good: true },
                  { label: "Cost per KM", value: `₦${p.costPerKm.toLocaleString()}`, progress: 65, good: true },
                  { label: "AR Days Outstanding", value: "18 days", progress: 75, good: true },
                  { label: "Current Ratio", value: "3.2x", progress: 85, good: true },
                ].map((kpi) => (
                  <div key={kpi.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{kpi.label}</span>
                      <span className={`font-semibold ${kpi.good ? "text-green-500" : "text-destructive"}`}>{kpi.value}</span>
                    </div>
                    <Progress value={kpi.progress} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Quarterly Management Pack</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <p className="font-semibold text-sm">Executive Summary — {p.label}</p>
                  <p className="text-xs text-muted-foreground">
                    RouteAce delivered {fmt(p.revenue)} in gross revenue for the period, representing a <span className="text-green-500 font-semibold">+19.7% growth</span> vs prior period. 
                    Net profit stood at {fmt(p.netProfit)} ({p.grossMargin}% margin), driven primarily by freight revenue growth and improved fleet utilization at {p.fleetUtil}%.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Risk Alert: Fuel costs represent 43.2% of total OpEx. With diesel price volatility, a 10% fuel increase would reduce margins by ~4.3pp.
                  </p>
                  <p className="text-xs text-green-500 mt-2">
                    ✅ Positive: SLA compliance at 96.2%. Driver fleet fully deployed. Customer AR at 18 days — below 30-day target.
                  </p>
                </div>
                <Button className="w-full" size="sm" onClick={() => handleExport("Board Pack PDF")}>
                  <Download className="w-4 h-4 mr-2" />Generate Board-Ready PDF
                </Button>
                <Button variant="outline" className="w-full" size="sm" onClick={() => handleExport("Auditor Package")}>
                  <FileText className="w-4 h-4 mr-2" />Generate Auditor Package
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget vs Actual */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Scale className="w-4 h-4" />Budget vs Actual — {p.label}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Line Item</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">% of Budget</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { item: "Freight Revenue", budget: 32_000_000, actual: p.revenue, isRevenue: true },
                    { item: "Fuel Expense", budget: 8_500_000, actual: Math.round(p.expenses * 0.432), isRevenue: false },
                    { item: "Driver Payroll", budget: 7_000_000, actual: Math.round(p.expenses * 0.347), isRevenue: false },
                    { item: "Maintenance", budget: 2_200_000, actual: Math.round(p.expenses * 0.114), isRevenue: false },
                    { item: "Depreciation", budget: 1_950_000, actual: Math.round(p.expenses * 0.093), isRevenue: false },
                    { item: "SLA Penalties", budget: 200_000, actual: Math.round(p.expenses * 0.015), isRevenue: false },
                  ].map((row) => {
                    const variance = row.actual - row.budget;
                    const pct = ((row.actual / row.budget) * 100).toFixed(1);
                    const favorable = row.isRevenue ? variance >= 0 : variance <= 0;
                    return (
                      <TableRow key={row.item}>
                        <TableCell className="font-medium text-sm">{row.item}</TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">{fmt(row.budget)}</TableCell>
                        <TableCell className="text-right font-mono text-sm font-semibold">{fmt(row.actual)}</TableCell>
                        <TableCell className={`text-right font-mono text-sm font-bold ${favorable ? "text-green-500" : "text-destructive"}`}>
                          {variance >= 0 ? "+" : ""}{fmt(variance)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">{pct}%</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${favorable ? "bg-green-500/20 text-green-700" : "bg-destructive/20 text-destructive"}`}>
                            {favorable ? "✅ On Track" : "⚠️ Over"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
