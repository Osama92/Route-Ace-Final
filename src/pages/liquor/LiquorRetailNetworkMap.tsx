import { useState } from "react";
import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  MapPin, Globe, Users, Wine, Beer, Martini, Store, Activity,
  TrendingUp, Search, Filter, Layers, Eye,
} from "lucide-react";

const retailerNodes = [
  { name: "The Gold Barrel Lounge", type: "Bar", lat: 6.45, lng: 3.42, spend: "₦4.2M", tier: "Platinum", topBrand: "Hennessy VS", visits: 12, district: "Victoria Island" },
  { name: "Sip & Savour Restaurant", type: "Restaurant", lat: 6.44, lng: 3.40, spend: "₦2.8M", tier: "Gold", topBrand: "Moët & Chandon", visits: 8, district: "Ikoyi" },
  { name: "Metro Wines & Spirits", type: "Liquor Store", lat: 6.46, lng: 3.38, spend: "₦6.1M", tier: "Platinum", topBrand: "Johnnie Walker", visits: 15, district: "Lekki Phase 1" },
  { name: "Skyline Nightclub", type: "Nightclub", lat: 6.43, lng: 3.44, spend: "₦8.5M", tier: "Platinum", topBrand: "Ciroc", visits: 6, district: "Victoria Island" },
  { name: "Corner Liquors Express", type: "Liquor Store", lat: 6.47, lng: 3.36, spend: "₦1.4M", tier: "Silver", topBrand: "Smirnoff", visits: 4, district: "Ajah" },
  { name: "La Maison Bistro", type: "Restaurant", lat: 6.45, lng: 3.41, spend: "₦3.6M", tier: "Gold", topBrand: "Merlot Reserve", visits: 10, district: "Victoria Island" },
  { name: "Nite Owl Lounge", type: "Bar", lat: 6.44, lng: 3.43, spend: "₦5.7M", tier: "Platinum", topBrand: "Grey Goose", visits: 9, district: "Lekki Phase 1" },
  { name: "Supreme Beverages", type: "Liquor Store", lat: 6.48, lng: 3.39, spend: "₦3.2M", tier: "Gold", topBrand: "Guinness FES", visits: 11, district: "Ikeja" },
];

const coverageZones = [
  { zone: "Victoria Island", retailers: 342, coverage: 94, dominantCategory: "Premium Spirits", avgSpend: "₦4.8M" },
  { zone: "Lekki Phase 1", retailers: 218, coverage: 87, dominantCategory: "Wine", avgSpend: "₦3.2M" },
  { zone: "Ikeja GRA", retailers: 156, coverage: 72, dominantCategory: "Beer", avgSpend: "₦1.9M" },
  { zone: "Ikoyi", retailers: 89, coverage: 91, dominantCategory: "Champagne", avgSpend: "₦6.1M" },
  { zone: "Yaba", retailers: 312, coverage: 58, dominantCategory: "Beer & RTD", avgSpend: "₦980K" },
  { zone: "Surulere", retailers: 245, coverage: 45, dominantCategory: "Value Spirits", avgSpend: "₦720K" },
];

const typeColors: Record<string, string> = {
  Bar: "bg-amber-500",
  Restaurant: "bg-rose-500",
  "Liquor Store": "bg-emerald-500",
  Nightclub: "bg-purple-500",
};

const LiquorRetailNetworkMap = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const filtered = selectedType === "all" ? retailerNodes : retailerNodes.filter(r => r.type === selectedType);

  return (
    <IndustryLayout industryCode="liquor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Retail Network Map</h1>
            <p className="text-sm text-muted-foreground">Connected commerce graph of the alcohol distribution ecosystem</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outlets</SelectItem>
                <SelectItem value="Bar">Bars</SelectItem>
                <SelectItem value="Restaurant">Restaurants</SelectItem>
                <SelectItem value="Liquor Store">Liquor Stores</SelectItem>
                <SelectItem value="Nightclub">Nightclubs</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1" /> Layers</Button>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Network Nodes", value: "4,847", icon: MapPin, color: "text-primary", sub: "+312 this month" },
            { label: "Active Distributors", value: "128", icon: Users, color: "text-blue-500", sub: "32 territories" },
            { label: "Monthly GMV", value: "₦2.4B", icon: TrendingUp, color: "text-emerald-500", sub: "+18% MoM" },
            { label: "Coverage Score", value: "76%", icon: Globe, color: "text-amber-500", sub: "24% gap identified" },
          ].map(k => (
            <Card key={k.label} className="bg-card/80 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <k.icon className={`w-4 h-4 ${k.color}`} />
                  <span className="text-xs text-muted-foreground">{k.label}</span>
                </div>
                <p className="text-2xl font-bold">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Map */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> Retail Network Visualization</CardTitle>
              <div className="flex items-center gap-3 text-xs">
                {Object.entries(typeColors).map(([type, color]) => (
                  <div key={type} className="flex items-center gap-1">
                    <span className={`w-3 h-3 rounded-full ${color}`} />
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/20 rounded-xl p-4 min-h-[380px] relative overflow-hidden">
              <svg viewBox="0 0 800 380" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* District backgrounds */}
                <rect x="50" y="30" width="220" height="160" rx="12" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--border))" strokeDasharray="4 4" />
                <text x="160" y="55" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="600">Victoria Island</text>
                <rect x="300" y="50" width="200" height="140" rx="12" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--border))" strokeDasharray="4 4" />
                <text x="400" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="600">Lekki Phase 1</text>
                <rect x="530" y="30" width="220" height="150" rx="12" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--border))" strokeDasharray="4 4" />
                <text x="640" y="55" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="600">Ikeja</text>
                <rect x="100" y="210" width="250" height="140" rx="12" fill="hsl(var(--primary) / 0.05)" stroke="hsl(var(--border))" strokeDasharray="4 4" />
                <text x="225" y="235" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="600">Ikoyi</text>

                {/* Retailer nodes */}
                {filtered.map((r, i) => {
                  const positions = [
                    { x: 120, y: 110 }, { x: 200, y: 280 }, { x: 380, y: 130 },
                    { x: 160, y: 150 }, { x: 600, y: 120 }, { x: 100, y: 130 },
                    { x: 420, y: 110 }, { x: 640, y: 100 },
                  ];
                  const p = positions[i % positions.length];
                  const colorMap: Record<string, string> = {
                    Bar: "hsl(45 93% 47%)",
                    Restaurant: "hsl(350 89% 60%)",
                    "Liquor Store": "hsl(142 76% 36%)",
                    Nightclub: "hsl(262 83% 58%)",
                  };
                  const fill = colorMap[r.type] || "hsl(var(--primary))";
                  const radius = r.tier === "Platinum" ? 10 : r.tier === "Gold" ? 7 : 5;

                  return (
                    <g key={r.name}>
                      <circle cx={p.x} cy={p.y} r={radius + 8} fill={fill} opacity="0.15">
                        <animate attributeName="r" from={radius + 4} to={radius + 12} dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.2" to="0" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={p.x} cy={p.y} r={radius} fill={fill} className="cursor-pointer" />
                      <text x={p.x} y={p.y - radius - 5} textAnchor="middle" fill="hsl(var(--foreground))" fontSize="8" fontWeight="600">{r.name.length > 18 ? r.name.substring(0, 18) + "…" : r.name}</text>
                      <text x={p.x} y={p.y + radius + 12} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7">{r.spend}/mo</text>
                    </g>
                  );
                })}

                {/* Connection lines between nodes in same district */}
                <line x1="120" y1="110" x2="160" y2="150" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <line x1="160" y1="150" x2="100" y2="130" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                <line x1="380" y1="130" x2="420" y2="110" stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Coverage Zones */}
        <Tabs defaultValue="zones">
          <TabsList>
            <TabsTrigger value="zones">Coverage Zones</TabsTrigger>
            <TabsTrigger value="outlets">Top Outlets</TabsTrigger>
          </TabsList>

          <TabsContent value="zones" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {coverageZones.map((z, i) => (
                <motion.div key={z.zone} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className={`cursor-pointer transition-all ${selectedZone === z.zone ? "border-primary" : "hover:border-primary/30"}`} onClick={() => setSelectedZone(selectedZone === z.zone ? null : z.zone)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{z.zone}</h3>
                        <Badge className={z.coverage >= 80 ? "bg-emerald-500/15 text-emerald-600" : z.coverage >= 60 ? "bg-amber-500/15 text-amber-600" : "bg-rose-500/15 text-rose-600"}>
                          {z.coverage}% covered
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-muted-foreground">Retailers:</span> <span className="font-medium">{z.retailers}</span></div>
                        <div><span className="text-muted-foreground">Avg Spend:</span> <span className="font-medium">{z.avgSpend}</span></div>
                        <div className="col-span-2"><span className="text-muted-foreground">Top Category:</span> <span className="font-medium">{z.dominantCategory}</span></div>
                      </div>
                      <div className="mt-3 w-full bg-muted/30 rounded-full h-2">
                        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${z.coverage}%` }} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="outlets" className="space-y-2">
            {retailerNodes.sort((a, b) => parseFloat(b.spend.replace(/[₦,M]/g, "")) - parseFloat(a.spend.replace(/[₦,M]/g, ""))).map((r, i) => (
              <motion.div key={r.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="hover:border-primary/30 transition-all">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${typeColors[r.type] || "bg-muted"}`} />
                      <div>
                        <p className="font-medium text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.type} · {r.district}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <p className="font-bold">{r.spend}/mo</p>
                        <p className="text-[10px] text-muted-foreground">Top: {r.topBrand}</p>
                      </div>
                      <Badge variant="outline">{r.tier}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>

        {/* AI Insight */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Activity className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Network Intelligence Insight</p>
              <p className="text-sm text-muted-foreground mt-1">
                Victoria Island nightlife cluster shows 23% month-over-month growth in premium spirits spend. 
                Consider expanding Hennessy and Grey Goose distribution to 48 unserved bars in this corridor. 
                Estimated incremental revenue: ₦12.4M/month.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </IndustryLayout>
  );
};

export default LiquorRetailNetworkMap;
