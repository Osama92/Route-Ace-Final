import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  UserCheck, Camera, ShieldCheck, AlertTriangle, CheckCircle, XCircle,
  Fingerprint, CreditCard, Globe, ScanLine, Clock, Eye,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const idTypes: Record<string, string> = {
  passport: "Passport",
  driver_license: "Driver's License",
  national_id: "National ID (NIN)",
  voter_id: "Voter's Card",
};

const captureMethodLabels: Record<string, string> = {
  manual: "Manual Entry",
  camera_ocr: "Camera OCR",
  pos_scan: "POS Scan",
};

// Sample data for demo
const recentVerifications = [
  { id: "VRF-001", customer: "Adeyemi Okafor", dob: "1990-06-15", idType: "national_id", idNumber: "NIN-****8421", status: "verified", age: 35, method: "camera_ocr", time: "14:32" },
  { id: "VRF-002", customer: "Chidinma Eze", dob: "1995-03-22", idType: "driver_license", idNumber: "DL-****2910", status: "verified", age: 30, method: "pos_scan", time: "13:48" },
  { id: "VRF-003", customer: "Ibrahim Musa", dob: "2009-11-08", idType: "national_id", idNumber: "NIN-****7722", status: "failed", age: 16, method: "camera_ocr", time: "12:15" },
  { id: "VRF-004", customer: "Grace Adebayo", dob: "1988-01-30", idType: "passport", idNumber: "PP-****1938", status: "verified", age: 38, method: "manual", time: "11:40" },
  { id: "VRF-005", customer: "Tunde Bakare", dob: "2007-07-14", idType: "voter_id", idNumber: "VC-****6645", status: "failed", age: 18, method: "camera_ocr", time: "10:22" },
];

const kpis = [
  { label: "Verified Today", value: "284", icon: CheckCircle, color: "text-emerald-500" },
  { label: "Failed Checks", value: "6", icon: XCircle, color: "text-destructive" },
  { label: "Camera OCR Rate", value: "72%", icon: Camera, color: "text-blue-500" },
  { label: "Avg Scan Time", value: "4.2s", icon: Clock, color: "text-amber-500" },
];

const LiquorIDVerification = () => {
  const { data: ageRules } = useQuery({
    queryKey: ["liquor-age-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("liquor_age_rules")
        .select("*")
        .eq("is_active", true)
        .order("country_code");
      if (error) throw error;
      return data;
    },
  });

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-600">
            <Fingerprint className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">ID Verification Workflow</h1>
            <p className="text-sm text-muted-foreground">Age verification, ID capture & compliance gating</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map((k) => (
            <Card key={k.label}>
              <CardContent className="p-4 text-center">
                <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="verifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="verifications">Recent Verifications</TabsTrigger>
            <TabsTrigger value="workflow">POS Workflow</TabsTrigger>
            <TabsTrigger value="rules">Age Rules</TabsTrigger>
          </TabsList>

          {/* Recent Verifications */}
          <TabsContent value="verifications" className="space-y-2">
            {recentVerifications.map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className={`border-l-4 ${v.status === "failed" ? "border-l-destructive" : "border-l-emerald-500"}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {v.status === "failed" ? (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{v.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {v.id} · {idTypes[v.idType]} · {v.idNumber} · Age {v.age} · {captureMethodLabels[v.method]} · {v.time}
                        </p>
                      </div>
                    </div>
                    <Badge className={v.status === "failed" ? "bg-destructive/15 text-destructive" : "bg-emerald-500/15 text-emerald-600"}>
                      {v.status === "failed" ? `BLOCKED (Age ${v.age})` : `Verified (Age ${v.age})`}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          {/* POS Integration Workflow */}
          <TabsContent value="workflow" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ScanLine className="w-5 h-5" />POS & Mobile Capture Flow</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {[
                  { step: 1, title: "ID Capture", desc: "Cashier scans ID via camera OCR, POS barcode reader, or manual entry", icon: Camera },
                  { step: 2, title: "Data Extraction", desc: "OCR extracts: Name, Date of Birth, ID Number, ID Type, Expiry", icon: ScanLine },
                  { step: 3, title: "Age Calculation", desc: "System calculates age from DOB against country/state minimum age rule", icon: UserCheck },
                  { step: 4, title: "Compliance Gate", desc: "If age < minimum → Sale BLOCKED. If age ≥ minimum → Sale APPROVED", icon: ShieldCheck },
                  { step: 5, title: "Audit Log", desc: "Verification result, cashier ID, timestamp, and ID image stored permanently", icon: Eye },
                ].map((s, i) => (
                  <motion.div key={s.step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {s.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <s.icon className="w-4 h-4 text-muted-foreground" />
                        <p className="font-semibold text-sm">{s.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}

                <div className="mt-4 p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Supported ID Types</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(idTypes).map(([key, label]) => (
                      <Badge key={key} variant="outline" className="gap-1">
                        <CreditCard className="w-3 h-3" /> {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Country Age Rules */}
          <TabsContent value="rules" className="space-y-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Minimum Age Rules by Country</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {(ageRules ?? []).map((rule: any, i: number) => (
                  <motion.div key={rule.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">{rule.country_code}</span>
                      <span className="text-sm text-muted-foreground">{rule.state_code ? `State: ${rule.state_code}` : "National"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">{rule.minimum_age}+</span>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600">Active</Badge>
                    </div>
                  </motion.div>
                ))}
                {(!ageRules || ageRules.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-6">Loading age rules...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </IndustryLayout>
  );
};

export default LiquorIDVerification;
