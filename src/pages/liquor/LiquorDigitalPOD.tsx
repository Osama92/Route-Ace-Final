import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck, Truck, ShieldCheck, AlertTriangle, Camera, MapPin,
  Clock, CheckCircle, XCircle, UserCheck, Wine, FileText,
} from "lucide-react";

const deliveries = [
  { id: "DEL-4821", account: "Sky Lounge Bar", driver: "Musa K.", cases: 24, status: "delivered", ageVerified: true, photoProof: true, signature: true, time: "09:42 AM", exciseStamp: true },
  { id: "DEL-4822", account: "The Grill House", driver: "Emeka O.", cases: 18, status: "in_transit", ageVerified: false, photoProof: false, signature: false, time: "10:15 AM", exciseStamp: true },
  { id: "DEL-4823", account: "Club Mirage", driver: "Kunle B.", cases: 48, status: "delivered", ageVerified: true, photoProof: true, signature: true, time: "08:30 AM", exciseStamp: true },
  { id: "DEL-4824", account: "Quick Mart Liquors", driver: "Femi A.", cases: 12, status: "rejected", ageVerified: true, photoProof: true, signature: false, time: "11:00 AM", exciseStamp: false },
  { id: "DEL-4825", account: "Beerhugz Café", driver: "Musa K.", cases: 36, status: "pending", ageVerified: false, photoProof: false, signature: false, time: "—", exciseStamp: true },
];

const statusConfig = {
  delivered: { label: "Delivered", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  in_transit: { label: "In Transit", color: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: Truck },
  rejected: { label: "Rejected", color: "bg-destructive/15 text-destructive border-destructive/30", icon: XCircle },
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: Clock },
};

const LiquorDigitalPOD = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
          <ClipboardCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold">Digital Proof of Delivery</h1>
          <p className="text-sm text-muted-foreground">Age verification, excise compliance & delivery confirmation</p>
        </div>
      </div>

      {/* Compliance KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-emerald-500/20"><CardContent className="pt-5 text-center">
          <CheckCircle className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-bold">142</p>
          <p className="text-xs text-muted-foreground">Delivered Today</p>
        </CardContent></Card>
        <Card className="border-rose-500/20"><CardContent className="pt-5 text-center">
          <UserCheck className="w-5 h-5 mx-auto mb-1 text-rose-400" />
          <p className="text-xl font-bold">98.6%</p>
          <p className="text-xs text-muted-foreground">Age Verified</p>
        </CardContent></Card>
        <Card className="border-violet-500/20"><CardContent className="pt-5 text-center">
          <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-violet-400" />
          <p className="text-xl font-bold">99.1%</p>
          <p className="text-xs text-muted-foreground">Excise Stamped</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <Camera className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <p className="text-xl font-bold">97%</p>
          <p className="text-xs text-muted-foreground">Photo Proof</p>
        </CardContent></Card>
        <Card className="border-destructive/20"><CardContent className="pt-5 text-center">
          <XCircle className="w-5 h-5 mx-auto mb-1 text-destructive" />
          <p className="text-xl font-bold">8</p>
          <p className="text-xs text-muted-foreground">Rejections</p>
        </CardContent></Card>
      </div>

      {/* Age Verification Alert */}
      <Card className="border-rose-500/30 bg-rose-500/5">
        <CardContent className="py-4 flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Age Verification Required</p>
            <p className="text-xs text-muted-foreground">All alcohol deliveries must include age verification (18+). 2 deliveries pending verification today.</p>
          </div>
          <Button size="sm" variant="outline" className="border-rose-500/30 text-rose-400">Review</Button>
        </CardContent>
      </Card>

      {/* Delivery List */}
      <Card>
        <CardHeader><CardTitle>Today's Deliveries</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {deliveries.map((d) => {
            const st = statusConfig[d.status as keyof typeof statusConfig];
            const StIcon = st.icon;
            return (
              <div key={d.id} className="flex items-center justify-between py-3 border-b last:border-0 border-border/30">
                <div className="flex items-center gap-4">
                  <StIcon className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{d.account}</p>
                      <Badge className={`text-xs ${st.color}`}>{st.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.id} · {d.driver} · {d.cases} cases · {d.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span title="Age Verified" className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${d.ageVerified ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      <UserCheck className="w-3.5 h-3.5" />
                    </span>
                    <span title="Photo" className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${d.photoProof ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      <Camera className="w-3.5 h-3.5" />
                    </span>
                    <span title="Signature" className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${d.signature ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                      <FileText className="w-3.5 h-3.5" />
                    </span>
                    <span title="Excise" className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${d.exciseStamp ? "bg-emerald-500/15 text-emerald-400" : "bg-destructive/15 text-destructive"}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorDigitalPOD;
