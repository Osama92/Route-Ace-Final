import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Wine, DollarSign, Target, Zap, Calendar,
  Plus, BarChart3, Users, Package, Star,
} from "lucide-react";

const campaigns = [
  { name: "Hennessy Night Out", brand: "Hennessy", channel: "On-Premise", budget: "₦5.0M", spent: 3200000, roi: 3.4, accountsActive: 82, uplift: 28, status: "active", start: "Feb 15", end: "Mar 31" },
  { name: "Smirnoff Summer Mix", brand: "Smirnoff", channel: "Off-Premise", budget: "₦2.5M", spent: 2500000, roi: 2.1, accountsActive: 156, uplift: 15, status: "completed", start: "Jan 1", end: "Feb 28" },
  { name: "Johnnie Walker Tasting", brand: "Johnnie Walker", channel: "On-Premise", budget: "₦3.0M", spent: 800000, roi: 0, accountsActive: 24, uplift: 0, status: "active", start: "Mar 1", end: "Apr 15" },
  { name: "Easter Beer Festival", brand: "Guinness", channel: "Both", budget: "₦8.0M", spent: 0, roi: 0, accountsActive: 0, uplift: 0, status: "planned", start: "Apr 1", end: "Apr 21" },
];

const statusColors = {
  active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  completed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  planned: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const LiquorTradePromotions = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Trade Promotions</h1>
            <p className="text-sm text-muted-foreground">Campaign management, ROI tracking & activation intelligence</p>
          </div>
        </div>
        <Button size="sm" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
          <Plus className="w-4 h-4 mr-1" /> New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-bold">₦18.5M</p>
          <p className="text-xs text-muted-foreground">Total Budget</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-rose-400" />
          <p className="text-xl font-bold">2.8x</p>
          <p className="text-xs text-muted-foreground">Avg Campaign ROI</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <p className="text-xl font-bold">262</p>
          <p className="text-xs text-muted-foreground">Accounts Activated</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <BarChart3 className="w-5 h-5 mx-auto mb-1 text-amber-400" />
          <p className="text-xl font-bold">+21.5%</p>
          <p className="text-xs text-muted-foreground">Avg Volume Uplift</p>
        </CardContent></Card>
      </div>

      <div className="space-y-4">
        {campaigns.map((c) => (
          <Card key={c.name} className="hover:border-rose-500/30 transition-colors">
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Wine className="w-6 h-6 text-rose-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{c.name}</p>
                      <Badge className={`text-xs ${statusColors[c.status as keyof typeof statusColors]}`}>{c.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.brand} · {c.channel} · {c.start} → {c.end}</p>
                  </div>
                </div>
                {c.roi > 0 && (
                  <Badge className="text-sm bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                    {c.roi}x ROI
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-sm font-bold">{c.budget}</p>
                  <p className="text-xs text-muted-foreground">Budget</p>
                </div>
                <div>
                  <p className="text-sm font-bold">₦{(c.spent / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">Spent</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{c.accountsActive}</p>
                  <p className="text-xs text-muted-foreground">Accounts</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{c.uplift > 0 ? `+${c.uplift}%` : "—"}</p>
                  <p className="text-xs text-muted-foreground">Uplift</p>
                </div>
              </div>
              {c.spent > 0 && (
                <div className="mt-3">
                  <Progress value={(c.spent / parseInt(c.budget.replace(/[₦,M]/g, "")) / 1000000) * 100} className="h-1.5" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </IndustryLayout>
);

export default LiquorTradePromotions;
