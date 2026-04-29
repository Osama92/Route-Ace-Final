import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Wine, MapPin, Star, CreditCard, TrendingUp, AlertTriangle, Brain,
  Search, Phone, Clock, DollarSign, Package, ShieldCheck, Eye, Plus,
} from "lucide-react";

const accounts = [
  { name: "Sky Lounge Bar", type: "Nightclub", location: "Victoria Island", tier: "Platinum", creditScore: 92, monthlyVolume: "₦2.4M", lastOrder: "Today", compliance: 100, topBrand: "Hennessy VS", payDays: 7 },
  { name: "The Grill House", type: "Restaurant", location: "Lekki Phase 1", tier: "Gold", creditScore: 85, monthlyVolume: "₦1.8M", lastOrder: "Yesterday", compliance: 96, topBrand: "Johnnie Walker", payDays: 12 },
  { name: "Club Mirage", type: "Nightclub", location: "Ikoyi", tier: "Platinum", creditScore: 78, monthlyVolume: "₦3.1M", lastOrder: "2 days ago", compliance: 88, topBrand: "Moët", payDays: 18 },
  { name: "Mama's Kitchen", type: "Restaurant", location: "Surulere", tier: "Silver", creditScore: 65, monthlyVolume: "₦420K", lastOrder: "5 days ago", compliance: 94, topBrand: "Smirnoff", payDays: 22 },
  { name: "Beerhugz Café", type: "Bar & Café", location: "Ikeja GRA", tier: "Gold", creditScore: 82, monthlyVolume: "₦1.2M", lastOrder: "Today", compliance: 98, topBrand: "Guinness", payDays: 10 },
];

const LiquorBarManagement = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
            <Wine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">Bar & Restaurant Management</h1>
            <p className="text-sm text-muted-foreground">On-premise account intelligence & relationship management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search accounts..." className="pl-10" />
          </div>
          <Button size="sm" style={{ background: "linear-gradient(135deg, hsl(0 72% 51%), hsl(348 83% 47%))" }}>
            <Plus className="w-4 h-4 mr-1" /> Add Account
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="pt-5 text-center">
          <Wine className="w-5 h-5 mx-auto mb-1 text-rose-400" />
          <p className="text-xl font-bold">892</p>
          <p className="text-xs text-muted-foreground">Total On-Premise</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <Star className="w-5 h-5 mx-auto mb-1 text-amber-400" />
          <p className="text-xl font-bold">124</p>
          <p className="text-xs text-muted-foreground">Platinum Accounts</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-bold">₦18.3M</p>
          <p className="text-xs text-muted-foreground">Monthly Revenue</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <ShieldCheck className="w-5 h-5 mx-auto mb-1 text-blue-400" />
          <p className="text-xl font-bold">94%</p>
          <p className="text-xs text-muted-foreground">Compliance Rate</p>
        </CardContent></Card>
        <Card><CardContent className="pt-5 text-center">
          <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-destructive" />
          <p className="text-xl font-bold">18</p>
          <p className="text-xs text-muted-foreground">At-Risk Accounts</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">All Accounts</TabsTrigger>
          <TabsTrigger value="nightclubs">Nightclubs & Bars</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants & Hotels</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-3">
          {accounts.map((acc) => (
            <Card key={acc.name} className="hover:border-rose-500/30 transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                      <Wine className="w-6 h-6 text-rose-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{acc.name}</p>
                        <Badge variant="outline" className="text-xs">{acc.type}</Badge>
                        <Badge className={`text-xs ${acc.tier === "Platinum" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : acc.tier === "Gold" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-muted text-muted-foreground"}`}>
                          {acc.tier}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 inline mr-1" />{acc.location} · Top: {acc.topBrand} · Pay: {acc.payDays}d avg
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-bold">{acc.monthlyVolume}</p>
                      <p className="text-xs text-muted-foreground">Last: {acc.lastOrder}</p>
                    </div>
                    <div className="w-20">
                      <Progress value={acc.creditScore} className="h-1.5" />
                      <p className="text-xs text-center mt-1">{acc.creditScore} credit</p>
                    </div>
                    <Badge className={acc.compliance === 100 ? "bg-emerald-500/15 text-emerald-400" : acc.compliance >= 90 ? "bg-amber-500/15 text-amber-400" : "bg-destructive/15 text-destructive"}>
                      {acc.compliance}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="nightclubs" className="space-y-3">
          {[
            { name: "Sky Lounge Bar", location: "Victoria Island", tier: "Platinum", weeklyVolume: "₦1.2M", topSpirit: "Hennessy VS", peakNights: "Fri–Sat", avgSpend: "₦82K/night", footfall: 420, pouring: "Exclusive", license: "Valid", creditScore: 92 },
            { name: "Club Mirage", location: "Ikoyi", tier: "Platinum", weeklyVolume: "₦1.8M", topSpirit: "Moët Brut", peakNights: "Thu–Sat", avgSpend: "₦124K/night", footfall: 680, pouring: "Shared", license: "Valid", creditScore: 78 },
            { name: "Beerhugz Café", location: "Ikeja GRA", tier: "Gold", weeklyVolume: "₦640K", topSpirit: "Guinness FES", peakNights: "Fri–Sun", avgSpend: "₦48K/night", footfall: 290, pouring: "Open", license: "Valid", creditScore: 82 },
            { name: "Neon Lounge", location: "Lekki Phase 1", tier: "Gold", weeklyVolume: "₦920K", topSpirit: "Johnnie Walker", peakNights: "Wed–Sat", avgSpend: "₦68K/night", footfall: 510, pouring: "Exclusive", license: "Renewal Due", creditScore: 74 },
            { name: "Pulse Nightclub", location: "Surulere", tier: "Silver", weeklyVolume: "₦380K", topSpirit: "Smirnoff", peakNights: "Fri–Sat", avgSpend: "₦32K/night", footfall: 350, pouring: "Open", license: "Valid", creditScore: 68 },
          ].map((bar) => (
            <Card key={bar.name} className="hover:border-rose-500/30 transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                      <Wine className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{bar.name}</p>
                        <Badge className={`text-xs ${bar.tier === "Platinum" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : bar.tier === "Gold" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-muted text-muted-foreground"}`}>{bar.tier}</Badge>
                        <Badge variant="outline" className="text-xs">{bar.pouring} Pouring</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 inline mr-1" />{bar.location} · Peak: {bar.peakNights} · Top: {bar.topSpirit}
                      </p>
                    </div>
                  </div>
                  <Badge className={bar.license === "Valid" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30"}>
                    {bar.license}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm font-bold">{bar.weeklyVolume}</p>
                    <p className="text-xs text-muted-foreground">Weekly Volume</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{bar.avgSpend}</p>
                    <p className="text-xs text-muted-foreground">Avg Night Spend</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold">{bar.footfall.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Weekly Footfall</p>
                  </div>
                  <div>
                    <Progress value={bar.creditScore} className="h-1.5 mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Credit: {bar.creditScore}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="restaurants" className="space-y-3">
          {[
            { name: "The Grill House", location: "Lekki Phase 1", cuisine: "Continental", tier: "Gold", weeklyVolume: "₦860K", topWine: "Cabernet Sauvignon", topSpirit: "Johnnie Walker", covers: 180, winePct: 45, spiritPct: 35, beerPct: 20, creditScore: 85 },
            { name: "Mama's Kitchen", location: "Surulere", cuisine: "Nigerian", tier: "Silver", weeklyVolume: "₦210K", topWine: "—", topSpirit: "Smirnoff", covers: 120, winePct: 5, spiritPct: 55, beerPct: 40, creditScore: 65 },
            { name: "Azure Restaurant", location: "Victoria Island", cuisine: "Fine Dining", tier: "Platinum", weeklyVolume: "₦1.4M", topWine: "Moët Rosé", topSpirit: "Rémy Martin VSOP", covers: 80, winePct: 60, spiritPct: 30, beerPct: 10, creditScore: 96 },
            { name: "Spice Route", location: "Ikoyi", cuisine: "Asian Fusion", tier: "Gold", weeklyVolume: "₦720K", topWine: "Pinot Grigio", topSpirit: "Tanqueray", covers: 140, winePct: 35, spiritPct: 40, beerPct: 25, creditScore: 88 },
            { name: "Hilton Lagos Restaurant", location: "Ikeja", cuisine: "International", tier: "Platinum", weeklyVolume: "₦1.1M", topWine: "Dom Pérignon", topSpirit: "Hennessy XO", covers: 200, winePct: 50, spiritPct: 35, beerPct: 15, creditScore: 98 },
          ].map((rest) => (
            <Card key={rest.name} className="hover:border-rose-500/30 transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{rest.name}</p>
                        <Badge variant="outline" className="text-xs">{rest.cuisine}</Badge>
                        <Badge className={`text-xs ${rest.tier === "Platinum" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : rest.tier === "Gold" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-muted text-muted-foreground"}`}>{rest.tier}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3 inline mr-1" />{rest.location} · {rest.covers} covers/day · Wine: {rest.topWine}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold">{rest.weeklyVolume}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span>Wine</span><span>{rest.winePct}%</span></div>
                    <Progress value={rest.winePct} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span>Spirits</span><span>{rest.spiritPct}%</span></div>
                    <Progress value={rest.spiritPct} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span>Beer</span><span>{rest.beerPct}%</span></div>
                    <Progress value={rest.beerPct} className="h-1.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-emerald-500/20">
              <CardContent className="pt-5 text-center">
                <p className="text-3xl font-bold text-emerald-400">674</p>
                <p className="text-sm text-muted-foreground">Fully Compliant</p>
                <p className="text-xs text-muted-foreground">Valid license + age verification</p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/20">
              <CardContent className="pt-5 text-center">
                <p className="text-3xl font-bold text-amber-400">186</p>
                <p className="text-sm text-muted-foreground">Partial Compliance</p>
                <p className="text-xs text-muted-foreground">License renewal pending</p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20">
              <CardContent className="pt-5 text-center">
                <p className="text-3xl font-bold text-destructive">32</p>
                <p className="text-sm text-muted-foreground">Non-Compliant</p>
                <p className="text-xs text-muted-foreground">Orders blocked until resolved</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorBarManagement;
