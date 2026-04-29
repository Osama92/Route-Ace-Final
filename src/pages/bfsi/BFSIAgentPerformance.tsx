import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Target, Award, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const agents = [
  { name: "Chidi Okafor", region: "Lagos West", loans: 45, insurance: 28, collections: "₦12.4M", score: 94, tier: "star" },
  { name: "Amina Bello", region: "Abuja Central", loans: 38, insurance: 42, collections: "₦10.8M", score: 91, tier: "star" },
  { name: "Emeka Nwosu", region: "Enugu", loans: 32, insurance: 15, collections: "₦7.2M", score: 82, tier: "gold" },
  { name: "Fatima Yusuf", region: "Kano", loans: 28, insurance: 35, collections: "₦9.1M", score: 88, tier: "gold" },
  { name: "Ade Oluwa", region: "Ibadan", loans: 22, insurance: 18, collections: "₦5.4M", score: 75, tier: "silver" },
];

const regionPerf = [
  { region: "Lagos", agents: 48, productivity: 92 },
  { region: "Abuja", agents: 32, productivity: 88 },
  { region: "PH", agents: 24, productivity: 84 },
  { region: "Kano", agents: 28, productivity: 79 },
  { region: "Ibadan", agents: 18, productivity: 76 },
];

const BFSIAgentPerformance = () => (
  <IndustryLayout industryCode="bfsi">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Agent Performance</h1>
          <p className="text-muted-foreground">Track field agent productivity, collections, and KPIs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><Users className="w-5 h-5 text-blue-500 mb-2" /><p className="text-2xl font-bold text-foreground">150</p><p className="text-xs text-muted-foreground">Active Agents</p></CardContent></Card>
        <Card><CardContent className="p-4"><Target className="w-5 h-5 text-blue-500 mb-2" /><p className="text-2xl font-bold text-foreground">84%</p><p className="text-xs text-muted-foreground">Target Achievement</p></CardContent></Card>
        <Card><CardContent className="p-4"><TrendingUp className="w-5 h-5 text-blue-500 mb-2" /><p className="text-2xl font-bold text-foreground">₦44.9M</p><p className="text-xs text-muted-foreground">Total Collections</p></CardContent></Card>
        <Card><CardContent className="p-4"><Award className="w-5 h-5 text-blue-500 mb-2" /><p className="text-2xl font-bold text-foreground">86</p><p className="text-xs text-muted-foreground">Avg Score</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top Performing Agents</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agents.map((a) => (
              <div key={a.name} className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div><p className="font-semibold text-foreground">{a.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{a.region}</p></div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{a.loans} loans</span>
                  <span className="text-muted-foreground">{a.insurance} policies</span>
                  <span className="text-foreground font-medium">{a.collections}</span>
                  <Badge variant={a.tier === "star" ? "default" : "secondary"}>{a.score}pts</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Regional Productivity</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={regionPerf}>
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="agents" fill="hsl(var(--primary))" name="Agents" />
              <Bar dataKey="productivity" fill="#6366f1" name="Productivity %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default BFSIAgentPerformance;
