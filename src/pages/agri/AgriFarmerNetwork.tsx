import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, MapPin, Wheat, TrendingUp, UserPlus, Phone, Sprout, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const farmers = [
  { name: "Ibrahim Musa", zone: "Kaduna North", crops: "Maize, Sorghum", farmSize: "12 ha", adopted: true, lastVisit: "2 days ago" },
  { name: "Aisha Bello", zone: "Kano Central", crops: "Rice, Cowpea", farmSize: "8 ha", adopted: true, lastVisit: "5 days ago" },
  { name: "Chukwu Emmanuel", zone: "Benue Valley", crops: "Cassava, Yam", farmSize: "15 ha", adopted: false, lastVisit: "12 days ago" },
  { name: "Funke Adeyemi", zone: "Oyo West", crops: "Maize, Soybean", farmSize: "6 ha", adopted: true, lastVisit: "1 day ago" },
  { name: "Garba Abdullahi", zone: "Sokoto Plains", crops: "Millet, Groundnut", farmSize: "20 ha", adopted: false, lastVisit: "8 days ago" },
];

const adoptionByZone = [
  { zone: "Kaduna", adoption: 78, farmers: 1240 },
  { zone: "Kano", adoption: 72, farmers: 980 },
  { zone: "Benue", adoption: 65, farmers: 850 },
  { zone: "Oyo", adoption: 58, farmers: 620 },
  { zone: "Sokoto", adoption: 45, farmers: 540 },
  { zone: "Niger", adoption: 42, farmers: 480 },
];

const AgriFarmerNetwork = () => (
  <IndustryLayout industryCode="agri">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Farmer Network Management</h1>
          <p className="text-muted-foreground">Track farmer profiles, farm data, and input adoption</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Registered Farmers", value: "4,710", icon: Users, color: "text-emerald-500" },
          { label: "Input Adopters", value: "3,128", icon: Sprout, color: "text-green-500" },
          { label: "Avg Farm Size", value: "9.4 ha", icon: MapPin, color: "text-blue-500" },
          { label: "Adoption Rate", value: "66.4%", icon: Target, color: "text-amber-500" },
        ].map((kpi) => (
          <Card key={kpi.label} className="border-border/50">
            <CardContent className="pt-5 pb-4">
              <kpi.icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Adoption Rate by Zone</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={adoptionByZone}>
                <XAxis dataKey="zone" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="adoption" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} name="Adoption %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Farmer Registrations</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Crops</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmers.map((f) => (
                  <TableRow key={f.name}>
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{f.zone}</TableCell>
                    <TableCell className="text-xs">{f.crops}</TableCell>
                    <TableCell>
                      <Badge variant={f.adopted ? "default" : "outline"} className="text-[10px]">
                        {f.adopted ? "Adopted" : "Prospect"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default AgriFarmerNetwork;
