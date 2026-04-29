import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  ShieldCheck, AlertTriangle, CheckCircle, Clock, User, FileText,
  Calendar, MapPin, Eye, Lock, Brain, Zap,
} from "lucide-react";

const complianceStats = [
  { label: "Compliance Rate", value: "99.2%", icon: ShieldCheck, color: "text-emerald-500" },
  { label: "Verified Licenses", value: "4,218", icon: FileText, color: "text-primary" },
  { label: "Age Checks (Today)", value: "842", icon: User, color: "text-blue-500" },
  { label: "Blocked Transactions", value: "6", icon: AlertTriangle, color: "text-rose-500" },
];

const ageVerifications = [
  { delivery: "DEL-8421", retailer: "Skyline Nightclub", driver: "Adebayo K.", method: "NIN OCR Scan", result: "Passed (Age 34)", timestamp: "14:22 today" },
  { delivery: "DEL-8420", retailer: "Corner Liquors Express", driver: "Chukwu E.", method: "Driver's License OCR", result: "Passed (Age 28)", timestamp: "13:45 today" },
  { delivery: "DEL-8419", retailer: "Walk-In Customer", driver: "Ibrahim M.", method: "NIN OCR Scan", result: "FAILED (Age 17)", timestamp: "12:30 today" },
  { delivery: "DEL-8418", retailer: "The Gold Barrel Lounge", driver: "Oluwaseun A.", method: "Voter's Card OCR", result: "Passed (Age 42)", timestamp: "11:15 today" },
];

const licenseVerifications = [
  { entity: "PrimeBev Distributors", type: "Wholesale License", number: "WHL-2024-0842", expiry: "Dec 31, 2026", status: "Valid", daysRemaining: 298 },
  { entity: "The Gold Barrel Lounge", type: "On-Premise License", number: "OPL-2024-1247", expiry: "Jun 30, 2026", status: "Valid", daysRemaining: 114 },
  { entity: "Metro Wines & Spirits", type: "Off-Premise License", number: "FPL-2024-0568", expiry: "Apr 15, 2026", status: "Renewal Due", daysRemaining: 38 },
  { entity: "Lagos Spirits Co.", type: "Wholesale License", number: "WHL-2024-0291", expiry: "Sep 30, 2026", status: "Valid", daysRemaining: 206 },
  { entity: "Corner Liquors Express", type: "Off-Premise License", number: "FPL-2023-1892", expiry: "Mar 20, 2026", status: "Expiring Soon", daysRemaining: 12 },
];

const deliveryRestrictions = [
  { zone: "Victoria Island", restriction: "No delivery before 8AM", type: "Time", enforcement: "Hard Block" },
  { zone: "Ikoyi Residential", restriction: "No delivery after 10PM", type: "Time", enforcement: "Hard Block" },
  { zone: "Schools Zone (Ikeja)", restriction: "No delivery within 200m of schools", type: "Geo-fence", enforcement: "Hard Block" },
  { zone: "Religious Areas", restriction: "No delivery on Sunday before 12PM", type: "Time", enforcement: "Soft Warning" },
  { zone: "All Zones", restriction: "Mandatory age verification on all deliveries", type: "ID Check", enforcement: "Hard Block" },
];

const blockedTransactions = [
  { txn: "TXN-28942", reason: "Age verification failed — recipient under 18", retailer: "Walk-In Customer", action: "Delivery Refused", severity: "Critical" },
  { txn: "TXN-28938", reason: "Delivery attempted outside permitted hours (11:30 PM)", retailer: "Nite Owl Lounge", action: "Rescheduled", severity: "High" },
  { txn: "TXN-28931", reason: "Retailer license expired — renewal pending", retailer: "Corner Liquors Express", action: "Order Held", severity: "Medium" },
];

const LiquorComplianceEngine = () => {
  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Compliance Verification Engine</h1>
          <p className="text-sm text-muted-foreground">Age verification, license management, delivery restrictions, and audit trail</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {complianceStats.map(k => (
            <Card key={k.label}>
              <CardContent className="p-3 text-center">
                <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="age" className="space-y-4">
          <TabsList>
            <TabsTrigger value="age">Age Verification</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="restrictions">Delivery Rules</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
          </TabsList>

          <TabsContent value="age" className="space-y-2">
            {ageVerifications.map((v, i) => (
              <motion.div key={v.delivery} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className={`border-l-4 ${v.result.includes("FAILED") ? "border-l-rose-500" : "border-l-emerald-500"}`}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {v.result.includes("FAILED") ? (
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{v.delivery} — {v.retailer}</p>
                        <p className="text-xs text-muted-foreground">Driver: {v.driver} · {v.method} · {v.timestamp}</p>
                      </div>
                    </div>
                    <Badge className={v.result.includes("FAILED") ? "bg-rose-500/15 text-rose-600" : "bg-emerald-500/15 text-emerald-600"}>
                      {v.result}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="licenses" className="space-y-2">
            {licenseVerifications.map((l, i) => (
              <motion.div key={l.number} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{l.entity}</p>
                        <Badge variant="outline" className="text-[10px]">{l.type}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{l.number} · Expires: {l.expiry}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{l.daysRemaining}d left</span>
                      <Badge className={
                        l.status === "Valid" ? "bg-emerald-500/15 text-emerald-600" :
                        l.status === "Renewal Due" ? "bg-amber-500/15 text-amber-600" :
                        "bg-rose-500/15 text-rose-600"
                      }>{l.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="restrictions" className="space-y-2">
            {deliveryRestrictions.map((r, i) => (
              <motion.div key={`${r.zone}-${r.restriction}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className={`w-4 h-4 ${r.enforcement === "Hard Block" ? "text-rose-500" : "text-amber-500"}`} />
                      <div>
                        <p className="font-medium text-sm">{r.zone}</p>
                        <p className="text-xs text-muted-foreground">{r.restriction}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{r.type}</Badge>
                      <Badge className={r.enforcement === "Hard Block" ? "bg-rose-500/15 text-rose-600" : "bg-amber-500/15 text-amber-600"}>
                        {r.enforcement}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="blocked" className="space-y-3">
            {blockedTransactions.map((b, i) => (
              <motion.div key={b.txn} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="border-l-4 border-l-rose-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <span className="font-semibold text-sm">{b.txn}</span>
                        <Badge className={
                          b.severity === "Critical" ? "bg-rose-500/15 text-rose-600" :
                          b.severity === "High" ? "bg-amber-500/15 text-amber-600" :
                          "bg-blue-500/15 text-blue-600"
                        }>{b.severity}</Badge>
                      </div>
                      <Badge variant="outline">{b.action}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{b.reason}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Retailer: {b.retailer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Compliance Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                Corner Liquors Express license expires in 12 days — all orders will be auto-blocked after Mar 20. 
                Send renewal reminder immediately. 1 age verification failure today — incident logged and delivery 
                refused per regulatory protocol.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorComplianceEngine;
