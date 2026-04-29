import FMCGLayout from "@/components/fmcg/FMCGLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, Camera, MapPin, Clock, FileCheck, AlertTriangle, QrCode, Fingerprint, CheckCircle2, XCircle } from "lucide-react";

const podEntries = [
  { id: "POD-1204", order: "ORD-4521", outlet: "ShopRite Ikeja", driver: "Emeka O.", method: "QR + Geofence", time: "14:22", gpsMatch: true, photoVerified: true, signatureCapture: true, tamperScore: 0, status: "verified" },
  { id: "POD-1203", order: "ORD-4520", outlet: "Spar Lekki", driver: "Adamu M.", method: "Digital Signature", time: "13:48", gpsMatch: true, photoVerified: true, signatureCapture: true, tamperScore: 0, status: "verified" },
  { id: "POD-1202", order: "ORD-4519", outlet: "Justrite Surulere", driver: "Chidi N.", method: "Photo + GPS", time: "12:55", gpsMatch: false, photoVerified: true, signatureCapture: false, tamperScore: 34, status: "flagged" },
  { id: "POD-1201", order: "ORD-4518", outlet: "Market Square Ajah", driver: "Bola A.", method: "QR Scan", time: "12:30", gpsMatch: true, photoVerified: false, signatureCapture: true, tamperScore: 12, status: "partial" },
  { id: "POD-1200", order: "ORD-4517", outlet: "Game Store VI", driver: "Ibrahim K.", method: "Geofence Auto", time: "11:45", gpsMatch: true, photoVerified: true, signatureCapture: true, tamperScore: 0, status: "verified" },
  { id: "POD-1199", order: "ORD-4516", outlet: "Hubmart Allen", driver: "Emeka O.", method: "QR + Photo", time: "11:12", gpsMatch: true, photoVerified: true, signatureCapture: false, tamperScore: 5, status: "verified" },
  { id: "POD-1198", order: "ORD-4515", outlet: "Ebeano Supermarket", driver: "Chidi N.", method: "Digital Signature", time: "10:38", gpsMatch: true, photoVerified: true, signatureCapture: true, tamperScore: 0, status: "verified" },
];

const tamperAlerts = [
  { id: "TMP-018", driver: "Chidi N.", issue: "GPS location 2.4km from outlet geofence", severity: "high", order: "ORD-4519", timestamp: "12:55", recommendation: "Verify delivery with outlet manager. Review driver route history." },
  { id: "TMP-017", driver: "Bola A.", issue: "Delivery photo missing — only signature captured", severity: "medium", order: "ORD-4518", timestamp: "12:30", recommendation: "Request retroactive photo upload within 2hr window." },
  { id: "TMP-016", driver: "Unknown", issue: "QR code scanned from unregistered device", severity: "critical", order: "ORD-4510", timestamp: "09:15", recommendation: "Immediate investigation. Potential device sharing or fraud." },
];

const deliveryMethods = [
  { method: "QR + Geofence", count: 342, percentage: 38, reliability: 99.2 },
  { method: "Digital Signature", count: 248, percentage: 28, reliability: 97.8 },
  { method: "Photo + GPS", count: 178, percentage: 20, reliability: 94.1 },
  { method: "Geofence Auto", count: 89, percentage: 10, reliability: 98.5 },
  { method: "QR Only", count: 36, percentage: 4, reliability: 91.4 },
];

const FMCGDigitalPOD = () => {
  const verified = podEntries.filter(p => p.status === "verified").length;
  const flagged = podEntries.filter(p => p.status === "flagged").length;

  return (
    <FMCGLayout title="Digital Proof of Delivery" subtitle="Tamper-proof delivery verification with multi-layer authentication">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "PODs Today", value: "893", icon: FileCheck, color: "text-blue-600" },
          { label: "Verified Rate", value: "96.8%", icon: ShieldCheck, color: "text-green-600" },
          { label: "Tamper Alerts", value: "3", icon: AlertTriangle, color: "text-red-600" },
          { label: "Avg Verification", value: "8s", icon: Clock, color: "text-teal-600" },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <m.icon className={`w-8 h-8 ${m.color}`} />
              <div>
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-2xl font-bold">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="log">
        <TabsList>
          <TabsTrigger value="log">POD Log</TabsTrigger>
          <TabsTrigger value="tamper">Tamper Detection</TabsTrigger>
          <TabsTrigger value="methods">Verification Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <Card>
            <CardHeader><CardTitle>Recent Delivery Verifications</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {podEntries.map((pod) => (
                  <div key={pod.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-muted-foreground">{pod.id}</span>
                        <span className="font-medium">{pod.outlet}</span>
                      </div>
                      <Badge variant={pod.status === "verified" ? "default" : pod.status === "flagged" ? "destructive" : "secondary"}>
                        {pod.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Order</p>
                        <p className="font-mono text-xs">{pod.order}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Driver</p>
                        <p className="font-medium">{pod.driver}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Method</p>
                        <Badge variant="outline" className="text-xs">{pod.method}</Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p>{pod.time}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {pod.gpsMatch ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {pod.photoVerified ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="flex items-center gap-1">
                        <Fingerprint className="w-3 h-3" />
                        {pod.signatureCapture ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tamper">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> AI Tamper Detection Alerts</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tamperAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{alert.id}</span>
                        <span className="font-medium">{alert.driver}</span>
                        <span className="text-xs text-muted-foreground">• {alert.order}</span>
                      </div>
                      <Badge variant={alert.severity === "critical" ? "destructive" : alert.severity === "high" ? "secondary" : "outline"}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.issue}</p>
                    <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                      <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-primary">{alert.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><QrCode className="w-5 h-5" /> Verification Method Analytics</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryMethods.map((m) => (
                  <div key={m.method} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{m.method}</h3>
                      <span className="text-sm text-muted-foreground">{m.count} deliveries ({m.percentage}%)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Usage Share</p>
                        <Progress value={m.percentage} className="h-2" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Reliability Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={m.reliability} className="h-2 flex-1" />
                          <span className={`text-xs font-bold ${m.reliability > 97 ? "text-green-600" : m.reliability > 93 ? "text-orange-600" : "text-red-600"}`}>{m.reliability}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FMCGLayout>
  );
};

export default FMCGDigitalPOD;
