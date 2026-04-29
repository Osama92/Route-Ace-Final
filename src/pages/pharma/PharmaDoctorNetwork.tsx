import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Stethoscope, Users, TrendingUp, Calendar, MapPin, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const doctorsBySpecialty = [
  { specialty: "General Practice", count: 1240, share: 35 },
  { specialty: "Internal Medicine", count: 680, share: 19 },
  { specialty: "Cardiology", count: 420, share: 12 },
  { specialty: "Endocrinology", count: 350, share: 10 },
  { specialty: "Pediatrics", count: 310, share: 9 },
  { specialty: "Other", count: 530, share: 15 },
];
const COLORS = ["hsl(var(--primary))", "hsl(142 76% 36%)", "hsl(45 93% 47%)", "hsl(25 95% 53%)", "hsl(262 83% 58%)", "hsl(var(--muted-foreground))"];

const visitSchedule = [
  { doctor: "Dr. Abiola Ogundimu", specialty: "Cardiology", hospital: "LUTH", lastVisit: "2026-03-04", nextVisit: "2026-03-11", rep: "Funke Adeyemi", prescriptionUplift: "+22%" },
  { doctor: "Dr. Chinwe Eze", specialty: "Endocrinology", hospital: "UNTH", lastVisit: "2026-03-02", nextVisit: "2026-03-09", rep: "Chidi Okeke", prescriptionUplift: "+18%" },
  { doctor: "Dr. Musa Ibrahim", specialty: "General Practice", hospital: "Aminu Kano TH", lastVisit: "2026-03-05", nextVisit: "2026-03-12", rep: "Halima Bello", prescriptionUplift: "+14%" },
  { doctor: "Dr. Folake Williams", specialty: "Internal Medicine", hospital: "UCH Ibadan", lastVisit: "2026-03-01", nextVisit: "2026-03-08", rep: "Segun Bankole", prescriptionUplift: "+31%" },
];

const PharmaDoctorNetwork = () => (
  <IndustryLayout industryCode="pharma">
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Doctor Network Intelligence</h1>
        <p className="text-muted-foreground mt-1">Manage prescriber relationships, visit schedules, and prescription impact analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Registered Doctors", value: "3,530", icon: Stethoscope, color: "text-primary" },
          { label: "Active Prescribers", value: "2,840", icon: Users, color: "text-emerald-500" },
          { label: "Avg. Prescription Uplift", value: "+18.4%", icon: TrendingUp, color: "text-primary" },
          { label: "Visits This Week", value: "142", icon: Calendar, color: "text-primary" },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Doctors by Specialty</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={doctorsBySpecialty} dataKey="count" nameKey="specialty" cx="50%" cy="50%" outerRadius={100} label={({ specialty, share }) => `${specialty} (${share}%)`}>
                  {doctorsBySpecialty.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Prescription Uplift by Rep</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={visitSchedule}>
                <XAxis dataKey="rep" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="prescriptionUplift" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Upcoming Doctor Visits</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Visit</TableHead>
                <TableHead>Med Rep</TableHead>
                <TableHead>Rx Uplift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitSchedule.map((v) => (
                <TableRow key={v.doctor}>
                  <TableCell className="font-medium">{v.doctor}</TableCell>
                  <TableCell>{v.specialty}</TableCell>
                  <TableCell className="text-muted-foreground">{v.hospital}</TableCell>
                  <TableCell className="text-muted-foreground">{v.lastVisit}</TableCell>
                  <TableCell>{v.nextVisit}</TableCell>
                  <TableCell>{v.rep}</TableCell>
                  <TableCell><Badge variant="default" className="text-xs">{v.prescriptionUplift}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default PharmaDoctorNetwork;
