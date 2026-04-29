import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  FileText, CheckCircle, XCircle, AlertTriangle, Download, Filter,
  Clock, ShieldCheck, Eye, BarChart3,
} from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const auditEntries = [
  { id: "AUD-001", retailer: "Sky Lounge Bar", cashier: "Cashier-01", order: "ORD-4821", result: "pass", ageVerified: true, licenseValid: true, timestamp: "Mar 8, 2026 14:32", region: "Lagos - VI" },
  { id: "AUD-002", retailer: "The Grill House", cashier: "Cashier-03", order: "ORD-4822", result: "pass", ageVerified: true, licenseValid: true, timestamp: "Mar 8, 2026 13:48", region: "Lagos - Ikeja" },
  { id: "AUD-003", retailer: "Walk-In Customer", cashier: "Cashier-02", order: "ORD-4823", result: "fail", ageVerified: false, licenseValid: true, timestamp: "Mar 8, 2026 12:15", region: "Lagos - Lekki" },
  { id: "AUD-004", retailer: "Corner Liquors Express", cashier: "Cashier-05", order: "ORD-4824", result: "fail", ageVerified: true, licenseValid: false, timestamp: "Mar 8, 2026 11:00", region: "Abuja" },
  { id: "AUD-005", retailer: "Club Mirage", cashier: "Cashier-01", order: "ORD-4825", result: "pass", ageVerified: true, licenseValid: true, timestamp: "Mar 8, 2026 09:42", region: "Lagos - VI" },
  { id: "AUD-006", retailer: "Beerhugz Café", cashier: "Cashier-04", order: "ORD-4826", result: "pass", ageVerified: true, licenseValid: true, timestamp: "Mar 7, 2026 16:20", region: "Lagos - Ikoyi" },
];

const reportsByRegion = [
  { region: "Lagos", total: 4200, pass: 4180, fail: 20 },
  { region: "Abuja", total: 1800, pass: 1790, fail: 10 },
  { region: "PH", total: 980, pass: 972, fail: 8 },
  { region: "Kano", total: 640, pass: 636, fail: 4 },
  { region: "Ibadan", total: 520, pass: 518, fail: 2 },
];

const licenseComplianceByRegion = [
  { region: "Lagos", licensed: 1240, unlicensed: 12, expired: 8 },
  { region: "Abuja", licensed: 680, unlicensed: 4, expired: 3 },
  { region: "PH", licensed: 410, unlicensed: 6, expired: 2 },
  { region: "Kano", licensed: 280, unlicensed: 2, expired: 1 },
  { region: "Ibadan", licensed: 320, unlicensed: 3, expired: 2 },
];

const LiquorComplianceAudit = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Compliance Audit Trail</h1>
            <p className="text-sm text-muted-foreground">Permanent audit logs, regulatory reports & compliance analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Audited", value: "8,140", icon: Eye, color: "text-primary" },
          { label: "Passed", value: "8,096", icon: CheckCircle, color: "text-emerald-500" },
          { label: "Failed", value: "44", icon: XCircle, color: "text-destructive" },
          { label: "Pass Rate", value: "99.5%", icon: ShieldCheck, color: "text-emerald-500" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4 text-center">
              <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trail" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trail">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Regional Reports</TabsTrigger>
          <TabsTrigger value="license">License Compliance</TabsTrigger>
        </TabsList>

        {/* Audit Trail */}
        <TabsContent value="trail" className="space-y-2">
          {auditEntries.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`border-l-4 ${a.result === "fail" ? "border-l-destructive" : "border-l-emerald-500"}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {a.result === "fail" ? <XCircle className="w-5 h-5 text-destructive" /> : <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{a.retailer}</p>
                        <Badge variant="outline" className="text-[10px]">{a.order}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{a.id} · {a.cashier} · {a.timestamp} · {a.region}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span title="Age Verified" className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${a.ageVerified ? "bg-emerald-500/15 text-emerald-500" : "bg-destructive/15 text-destructive"}`}>
                      {a.ageVerified ? "✓" : "✗"}
                    </span>
                    <span title="License Valid" className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${a.licenseValid ? "bg-emerald-500/15 text-emerald-500" : "bg-destructive/15 text-destructive"}`}>
                      {a.licenseValid ? "✓" : "✗"}
                    </span>
                    <Badge className={a.result === "fail" ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-600"}>
                      {a.result === "fail" ? "FAILED" : "PASSED"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Regional Reports */}
        <TabsContent value="reports">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5" />Alcohol Sales by Region — Compliance Report</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportsByRegion}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="pass" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Passed" stackId="a" />
                  <Bar dataKey="fail" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Failed" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* License Compliance */}
        <TabsContent value="license">
          <Card>
            <CardHeader><CardTitle>Retailer License Compliance by Region</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {licenseComplianceByRegion.map((r, i) => (
                <motion.div key={r.region} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{r.region}</p>
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-500/15 text-emerald-600">{r.licensed} Licensed</Badge>
                      {r.unlicensed > 0 && <Badge className="bg-amber-500/15 text-amber-600">{r.unlicensed} Unlicensed</Badge>}
                      {r.expired > 0 && <Badge className="bg-destructive/15 text-destructive">{r.expired} Expired</Badge>}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(r.licensed / (r.licensed + r.unlicensed + r.expired)) * 100}%` }} />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorComplianceAudit;
