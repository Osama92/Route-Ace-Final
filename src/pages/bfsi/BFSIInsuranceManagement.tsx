import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, TrendingUp, Users } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const policies = [
  { id: "POL-891", holder: "Dangote Group", type: "Commercial", premium: "₦45M", status: "active", claims: 2 },
  { id: "POL-892", holder: "First Bank", type: "Professional Indemnity", premium: "₦28M", status: "active", claims: 0 },
  { id: "POL-893", holder: "MTN Nigeria", type: "Group Life", premium: "₦120M", status: "renewal", claims: 8 },
  { id: "POL-894", holder: "Shoprite", type: "Property", premium: "₦15M", status: "active", claims: 1 },
];

const policyMix = [
  { name: "Life", value: 35, color: "#3b82f6" },
  { name: "Health", value: 25, color: "#10b981" },
  { name: "Motor", value: 20, color: "#f59e0b" },
  { name: "Property", value: 12, color: "#8b5cf6" },
  { name: "Other", value: 8, color: "#ef4444" },
];

const BFSIInsuranceManagement = () => (
  <IndustryLayout industryCode="bfsi">
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
          <Shield className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Insurance Policy Management</h1>
          <p className="text-muted-foreground">Manage insurance policies, premiums, and claims</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Policies</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {policies.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                  <div><p className="font-medium text-foreground text-sm">{p.holder}</p><p className="text-xs text-muted-foreground">{p.type} • {p.premium}</p></div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{p.claims} claims</span>
                    <Badge variant={p.status === "active" ? "default" : "secondary"}>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Policy Mix</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={policyMix} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {policyMix.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  </IndustryLayout>
);

export default BFSIInsuranceManagement;
