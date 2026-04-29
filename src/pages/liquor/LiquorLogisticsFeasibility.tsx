import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Truck, MapPin, Clock, DollarSign, Fuel, AlertTriangle,
  CheckCircle2, XCircle, Brain, Route, BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const feasibilityAssessments = [
  {
    city: "Port Harcourt GRA",
    overallScore: 88,
    warehouseDistance: "42km from nearest hub",
    deliveryTime: "2.4 hrs avg",
    routeEfficiency: 86,
    trafficScore: 72,
    infraScore: 84,
    costPerDrop: "₦4,200",
    feasible: true,
    notes: "Good road infrastructure. Minor traffic during peak hours on Aba Road. Recommend 6am-11am delivery windows.",
    risks: ["Flooding risk in July–Sept", "Limited cold chain facilities"],
  },
  {
    city: "Abuja Maitama-Wuse",
    overallScore: 94,
    warehouseDistance: "8km from central depot",
    deliveryTime: "1.2 hrs avg",
    routeEfficiency: 96,
    trafficScore: 88,
    infraScore: 95,
    costPerDrop: "₦2,800",
    feasible: true,
    notes: "Excellent infrastructure and road network. Low congestion outside rush hours. FCT regulations well-enforced.",
    risks: ["Security checkpoints can add 15-20min"],
  },
  {
    city: "Ibadan Ring Road",
    overallScore: 76,
    warehouseDistance: "68km from Lagos hub",
    deliveryTime: "3.8 hrs avg",
    routeEfficiency: 72,
    trafficScore: 64,
    infraScore: 68,
    costPerDrop: "₦6,400",
    feasible: true,
    notes: "Lagos-Ibadan expressway is reliable but can have 2hr delays. Recommend establishing local micro-depot.",
    risks: ["Expressway construction delays", "Limited last-mile paved roads in some zones"],
  },
  {
    city: "Kano Municipal",
    overallScore: 52,
    warehouseDistance: "184km from nearest hub",
    deliveryTime: "8.2 hrs avg",
    routeEfficiency: 48,
    trafficScore: 62,
    infraScore: 58,
    costPerDrop: "₦12,800",
    feasible: false,
    notes: "Long haul from nearest distribution center. Alcohol restrictions limit delivery to licensed hotel venues only.",
    risks: ["Strict alcohol regulations", "No local warehouse", "Security concerns on some routes"],
  },
  {
    city: "Benin City",
    overallScore: 82,
    warehouseDistance: "52km from Benin depot",
    deliveryTime: "2.8 hrs avg",
    routeEfficiency: 78,
    trafficScore: 74,
    infraScore: 76,
    costPerDrop: "₦5,100",
    feasible: true,
    notes: "Ore-Benin expressway provides good connectivity. City roads are adequate. Growing demand justifies local depot.",
    risks: ["Seasonal road deterioration in rainy season"],
  },
];

const logisticsRadar = [
  { metric: "Road Quality", ph: 84, abuja: 95, ibadan: 68, kano: 58, benin: 76 },
  { metric: "Delivery Speed", ph: 78, abuja: 92, ibadan: 62, kano: 42, benin: 72 },
  { metric: "Cost Efficiency", ph: 76, abuja: 88, ibadan: 64, kano: 38, benin: 68 },
  { metric: "Cold Chain", ph: 68, abuja: 82, ibadan: 52, kano: 44, benin: 58 },
  { metric: "Security", ph: 72, abuja: 90, ibadan: 76, kano: 56, benin: 78 },
  { metric: "Coverage", ph: 82, abuja: 94, ibadan: 58, kano: 48, benin: 74 },
];

const costComparison = [
  { city: "Abuja", cost: 2800 },
  { city: "PH", cost: 4200 },
  { city: "Benin", cost: 5100 },
  { city: "Ibadan", cost: 6400 },
  { city: "Kano", cost: 12800 },
];

const LiquorLogisticsFeasibility = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="w-6 h-6 text-primary" /> Logistics Feasibility Engine
          </h1>
          <p className="text-sm text-muted-foreground">Evaluate distribution feasibility before expanding into new territories</p>
        </div>
        <Button><Route className="w-4 h-4 mr-1" /> Run Assessment</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Cities Assessed", value: "18", icon: MapPin, color: "text-primary" },
          { label: "Feasible Markets", value: "14", icon: CheckCircle2, color: "text-emerald-500" },
          { label: "Avg Cost/Drop", value: "₦4,860", icon: DollarSign, color: "text-amber-500" },
          { label: "High Risk", value: "4", icon: AlertTriangle, color: "text-destructive" },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-3 text-center">
              <k.icon className={`w-5 h-5 mx-auto mb-1 ${k.color}`} />
              <p className="text-xl font-bold">{k.value}</p>
              <p className="text-[10px] text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cost Comparison */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Delivery Cost per Drop by City (₦)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={costComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" fontSize={10} stroke="hsl(var(--muted-foreground))" />
              <YAxis type="category" dataKey="city" fontSize={11} stroke="hsl(var(--muted-foreground))" width={80} />
              <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`} />
              <Bar dataKey="cost" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Feasibility Cards */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">City Feasibility Assessments</h3>
        {feasibilityAssessments.map((city, i) => (
          <motion.div key={city.city} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className={`transition-all ${!city.feasible ? "border-destructive/30" : "hover:border-primary/30"}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${city.feasible ? "bg-emerald-500/10" : "bg-destructive/10"}`}>
                      <span className={`text-lg font-bold ${city.feasible ? "text-emerald-600" : "text-destructive"}`}>{city.overallScore}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{city.city}</p>
                        {city.feasible
                          ? <Badge className="bg-emerald-500/15 text-emerald-600"><CheckCircle2 className="w-3 h-3 mr-1" />Feasible</Badge>
                          : <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Not Feasible</Badge>
                        }
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{city.notes}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {[
                    { label: "Distance", value: city.warehouseDistance.split(" ")[0], icon: MapPin },
                    { label: "Delivery Time", value: city.deliveryTime, icon: Clock },
                    { label: "Route Score", value: `${city.routeEfficiency}%`, icon: Route },
                    { label: "Traffic", value: `${city.trafficScore}/100`, icon: Truck },
                    { label: "Infra", value: `${city.infraScore}/100`, icon: BarChart3 },
                    { label: "Cost/Drop", value: city.costPerDrop, icon: DollarSign },
                  ].map(m => (
                    <div key={m.label} className="text-center p-2 bg-muted/30 rounded-lg">
                      <m.icon className="w-3 h-3 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs font-bold truncate">{m.value}</p>
                      <p className="text-[10px] text-muted-foreground">{m.label}</p>
                    </div>
                  ))}
                </div>
                {city.risks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {city.risks.map((r, j) => (
                      <Badge key={j} variant="outline" className="text-[10px] text-amber-600 border-amber-300">
                        <AlertTriangle className="w-2.5 h-2.5 mr-1" />{r}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Insight */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Brain className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Logistics Intelligence</p>
            <p className="text-sm text-muted-foreground mt-1">
              Abuja Maitama-Wuse has the best logistics profile (94/100) with ₦2,800/drop cost. 
              Kano Municipal is flagged as not feasible — recommend hotel-only licensed delivery via 
              third-party logistics partner. For Ibadan, establishing a micro-depot would reduce 
              cost/drop from ₦6,400 to an estimated ₦3,800.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </IndustryLayout>
);

export default LiquorLogisticsFeasibility;
