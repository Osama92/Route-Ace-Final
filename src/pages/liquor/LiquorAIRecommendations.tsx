import IndustryLayout from "@/components/industry/IndustryLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Users, Truck, Wine, Store, ArrowRight, Zap } from "lucide-react";

const salesRepRecs = [
  { rep: "Adebayo Okonkwo", territory: "Lagos Island", recs: [
    { retailer: "Sky Lounge VI", action: "Upsell Hennessy XO", reason: "Premium spend +40% MoM", priority: "high" },
    { retailer: "Craft Corner Lekki", action: "Introduce Aperol", reason: "Aperitif trending in segment", priority: "medium" },
    { retailer: "Bar Central Lagos", action: "Restock visit — tequila low", reason: "4 days to stockout", priority: "high" },
  ]},
  { rep: "Fatima Bello", territory: "Abuja CBD", recs: [
    { retailer: "Club Vibe Abuja", action: "JW Blue promo presentation", reason: "High-value occasion buyer", priority: "high" },
    { retailer: "The Capital Grill", action: "Wine list expansion", reason: "Restaurant upgrading menu", priority: "medium" },
  ]},
];

const distributorRecs = [
  { action: "Increase Hennessy VS allocation to Lagos", reason: "Demand up 34%, current fill rate 72%", impact: "₦4.2M revenue opportunity", priority: "high" },
  { action: "Open Craft Beer line for PH territory", reason: "48% growth, 18 new bars requesting", impact: "₦1.8M new revenue", priority: "high" },
  { action: "Reduce Baileys stock in Ibadan", reason: "Slow velocity, 45 days inventory", impact: "₦620K capital freed", priority: "medium" },
  { action: "Pre-position tequila for Dec season", reason: "Historical 3x demand spike", impact: "₦2.4M seasonal opportunity", priority: "medium" },
];

const supplierRecs = [
  { action: "Launch Aperol campaign in Lagos nightlife", reason: "52% organic growth in aperitif segment", impact: "₦3.2M GMV potential", priority: "high" },
  { action: "Expand Craft Beer Co to Abuja", reason: "Strong demand signals from 12 bars", impact: "₦1.4M new market", priority: "high" },
  { action: "Run premium whiskey promo in PH", reason: "Underserved premium segment growing 28%", impact: "₦2.1M incremental", priority: "medium" },
];

const retailerRecs = [
  { retailer: "Sky Lounge VI", recs: [
    { product: "Clase Azul Reposado", reason: "Trending in premium nightlife, 28% growth", reorderDate: "Mar 12" },
    { product: "Aperol", reason: "Category growing 52%, matches your customer profile", reorderDate: "Mar 15" },
  ]},
  { retailer: "Club Vibe Abuja", recs: [
    { product: "Grey Goose", reason: "Running low — 5 days stock remaining", reorderDate: "Mar 10" },
    { product: "Hennessy VS", reason: "Best seller velocity increasing, up 18%", reorderDate: "Mar 14" },
  ]},
];

const PriorityDot = ({ p }: { p: string }) => (
  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${p === "high" ? "bg-red-500" : p === "medium" ? "bg-yellow-500" : "bg-emerald-500"}`} />
);

const LiquorAIRecommendations = () => (
  <IndustryLayout industryCode="liquor">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" /> AI Recommendation Engine
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Personalized, role-specific recommendations powered by the Intelligence Brain</p>
      </div>

      <Tabs defaultValue="sales-rep">
        <TabsList>
          <TabsTrigger value="sales-rep"><Users className="w-3.5 h-3.5 mr-1" />Sales Reps</TabsTrigger>
          <TabsTrigger value="distributor"><Truck className="w-3.5 h-3.5 mr-1" />Distributors</TabsTrigger>
          <TabsTrigger value="supplier"><Wine className="w-3.5 h-3.5 mr-1" />Suppliers</TabsTrigger>
          <TabsTrigger value="retailer"><Store className="w-3.5 h-3.5 mr-1" />Retailers</TabsTrigger>
        </TabsList>

        <TabsContent value="sales-rep">
          <div className="space-y-4">
            {salesRepRecs.map((rep, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{rep.rep}</span>
                    <Badge variant="outline">{rep.territory}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rep.recs.map((r, j) => (
                      <div key={j} className="p-3 rounded-lg bg-muted/30 flex items-start gap-3">
                        <Zap className={`w-4 h-4 mt-0.5 ${r.priority === "high" ? "text-red-500" : "text-yellow-500"}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-foreground">{r.retailer}</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-primary font-medium">{r.action}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{r.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="distributor">
          <Card>
            <CardHeader><CardTitle className="text-sm">Strategic Recommendations</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distributorRecs.map((r, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground"><PriorityDot p={r.priority} />{r.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{r.reason}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs ml-4">{r.impact}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplier">
          <Card>
            <CardHeader><CardTitle className="text-sm">Market Opportunity Recommendations</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supplierRecs.map((r, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground"><PriorityDot p={r.priority} />{r.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{r.reason}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs ml-4">{r.impact}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retailer">
          <div className="space-y-4">
            {retailerRecs.map((ret, i) => (
              <Card key={i}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{ret.retailer}</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ret.recs.map((r, j) => (
                      <div key={j} className="p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-foreground">{r.product}</p>
                          <Badge variant="outline" className="text-[10px]">Reorder by {r.reorderDate}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{r.reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </IndustryLayout>
);

export default LiquorAIRecommendations;
