import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CheckCircle, Route } from "lucide-react";

const visits = [
  { rep: "Tunde Bakare", outlet: "MegaMart Ikeja", time: "9:15 AM", duration: "22 min", order: "₦420K", status: "completed" },
  { rep: "Tunde Bakare", outlet: "Fresh Corner Lekki", time: "10:45 AM", duration: "18 min", order: "₦185K", status: "completed" },
  { rep: "Grace Okonkwo", outlet: "Shoprite Abuja", time: "11:30 AM", duration: "—", order: "—", status: "in_progress" },
  { rep: "Yusuf Ahmed", outlet: "Alhaji Store Kano", time: "9:00 AM", duration: "15 min", order: "₦95K", status: "completed" },
  { rep: "Blessing Eze", outlet: "Mini Mart PH", time: "2:00 PM", duration: "—", order: "—", status: "scheduled" },
];

const ConsumerFieldSales = () => (
  <IndustryLayout industryCode="consumer">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
          <Route className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Field Sales Operations</h1>
          <p className="text-muted-foreground">Track field visits, orders, and merchandising execution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">142</p><p className="text-xs text-muted-foreground">Visits Today</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-500">98</p><p className="text-xs text-muted-foreground">Completed</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₦4.2M</p><p className="text-xs text-muted-foreground">Orders Captured</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">18 min</p><p className="text-xs text-muted-foreground">Avg Visit Time</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-teal-500" />Today's Field Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {visits.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div className="flex items-center gap-3">
                  {v.status === "completed" ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Clock className="w-5 h-5 text-amber-500" />}
                  <div><p className="font-medium text-foreground">{v.outlet}</p><p className="text-xs text-muted-foreground">{v.rep} • {v.time} • {v.duration}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  {v.order !== "—" && <span className="text-sm font-medium text-foreground">{v.order}</span>}
                  <Badge variant={v.status === "completed" ? "default" : "secondary"}>{v.status.replace("_", " ")}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default ConsumerFieldSales;
