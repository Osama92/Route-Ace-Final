import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Users, MapPin, Target, TrendingUp, Calendar, Briefcase } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const repPerformance = [
  { name: "Funke Adeyemi", territory: "Lagos Island", visits: 48, target: 55, prescriptions: 186, revenue: "₦4.2M", achievement: 87 },
  { name: "Chidi Okeke", territory: "Enugu/Anambra", visits: 42, target: 50, prescriptions: 156, revenue: "₦3.8M", achievement: 84 },
  { name: "Halima Bello", territory: "Kano/Kaduna", visits: 38, target: 45, prescriptions: 142, revenue: "₦3.2M", achievement: 84 },
  { name: "Segun Bankole", territory: "Ibadan/Oyo", visits: 51, target: 50, prescriptions: 198, revenue: "₦4.8M", achievement: 102 },
  { name: "Ada Obi", territory: "Abuja FCT", visits: 44, target: 48, prescriptions: 168, revenue: "₦3.9M", achievement: 92 },
];

const territoryData = [
  { territory: "Lagos", visits: 142, prescriptions: 580, revenue: 12.4 },
  { territory: "Abuja", visits: 86, prescriptions: 340, revenue: 7.8 },
  { territory: "Kano", visits: 64, prescriptions: 240, revenue: 5.2 },
  { territory: "PH", visits: 52, prescriptions: 198, revenue: 4.6 },
  { territory: "Ibadan", visits: 48, prescriptions: 180, revenue: 4.1 },
];

const PharmaMedRepSales = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Medical Sales Operations</h1>
        <p className="text-muted-foreground mt-1">Med rep performance, territory management, and sample distribution tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Med Reps", value: "48", icon: Users, color: "text-primary" },
          { label: "Visits This Month", value: "392", icon: MapPin, color: "text-primary" },
          { label: "Target Achievement", value: "89.2%", icon: Target, color: "text-emerald-500" },
          { label: "Rx Generated", value: "1,486", icon: TrendingUp, color: "text-primary" },
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
        <CardHeader><CardTitle className="text-lg">Territory Performance</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={territoryData}>
              <XAxis dataKey="territory" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="visits" fill="hsl(var(--primary))" name="Visits" radius={[4, 4, 0, 0]} />
              <Bar dataKey="prescriptions" fill="hsl(142 76% 36%)" name="Prescriptions" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Med Rep Scorecard</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rep Name</TableHead>
                <TableHead>Territory</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>Prescriptions</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Achievement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repPerformance.map((r) => (
                <TableRow key={r.name}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.territory}</TableCell>
                  <TableCell>{r.visits}/{r.target}</TableCell>
                  <TableCell>{r.prescriptions}</TableCell>
                  <TableCell>{r.revenue}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={r.achievement} className="h-2 w-16" />
                      <Badge variant={r.achievement >= 100 ? "default" : r.achievement >= 80 ? "secondary" : "destructive"} className="text-xs">
                        {r.achievement}%
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default PharmaMedRepSales;
