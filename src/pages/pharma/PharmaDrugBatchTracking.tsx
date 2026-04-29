import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Package, AlertTriangle, CheckCircle, Clock, QrCode, Shield } from "lucide-react";

const batchData = [
  { batchId: "BTH-2026-0341", drug: "Amoxicillin 500mg", manufacturer: "GSK Nigeria", qty: 50000, manufactured: "2026-01-15", expiry: "2028-01-15", status: "active", location: "Lagos Central WH" },
  { batchId: "BTH-2026-0342", drug: "Metformin 850mg", manufacturer: "Fidson Healthcare", qty: 30000, manufactured: "2026-02-01", expiry: "2028-02-01", status: "active", location: "Abuja Distribution" },
  { batchId: "BTH-2025-0298", drug: "Paracetamol 500mg", manufacturer: "Emzor Pharma", qty: 8000, manufactured: "2025-03-10", expiry: "2026-09-10", status: "expiring_soon", location: "Kano WH" },
  { batchId: "BTH-2025-0215", drug: "Ciprofloxacin 500mg", manufacturer: "May & Baker", qty: 2500, manufactured: "2024-06-20", expiry: "2026-06-20", status: "expiring_soon", location: "PH WH" },
  { batchId: "BTH-2024-0180", drug: "Artemether/Lumef.", manufacturer: "Swiss Pharma", qty: 500, manufactured: "2024-01-05", expiry: "2026-01-05", status: "expired", location: "Lagos Central WH" },
];

const counterfeitAlerts = [
  { product: "Amoxicillin 500mg", source: "Mobile Auth Scan", region: "Lagos Island", confidence: 94, date: "2026-03-07" },
  { product: "Artemether Injection", source: "NAFDAC Report", region: "Onitsha Market", confidence: 87, date: "2026-03-05" },
];

const PharmaDrugBatchTracking = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Drug Batch Tracking</h1>
        <p className="text-muted-foreground mt-1">End-to-end batch traceability, expiry monitoring, and counterfeit detection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Batches", value: "1,247", icon: Package, color: "text-primary" },
          { label: "Expiring (90 days)", value: "38", icon: Clock, color: "text-amber-500" },
          { label: "Expired (Pending Recall)", value: "4", icon: AlertTriangle, color: "text-destructive" },
          { label: "Counterfeit Alerts", value: "2", icon: Shield, color: "text-destructive" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                </div>
                <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Batch Inventory</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Drug</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchData.map((b) => (
                <TableRow key={b.batchId}>
                  <TableCell className="font-mono text-sm">{b.batchId}</TableCell>
                  <TableCell className="font-medium">{b.drug}</TableCell>
                  <TableCell className="text-muted-foreground">{b.manufacturer}</TableCell>
                  <TableCell>{b.qty.toLocaleString()}</TableCell>
                  <TableCell>{b.expiry}</TableCell>
                  <TableCell className="text-muted-foreground">{b.location}</TableCell>
                  <TableCell>
                    <Badge variant={b.status === "active" ? "default" : b.status === "expired" ? "destructive" : "secondary"} className="text-xs capitalize">
                      {b.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-destructive" /> Counterfeit Detection Alerts</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {counterfeitAlerts.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                <div>
                  <p className="font-medium text-foreground">{a.product}</p>
                  <p className="text-sm text-muted-foreground">{a.source} — {a.region}</p>
                  <p className="text-xs text-muted-foreground">{a.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-destructive">{a.confidence}% confidence</p>
                  <Badge variant="destructive" className="text-xs mt-1">Investigate</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default PharmaDrugBatchTracking;
