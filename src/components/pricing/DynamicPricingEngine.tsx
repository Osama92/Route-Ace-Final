import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { safeDivide } from "@/lib/apiValidator";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Fuel,
  Truck,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Settings,
  DollarSign,
  BarChart3,
  Gauge,
} from "lucide-react";
import { format, subDays } from "date-fns";

interface PricingConfig {
  id: string;
  min_price_multiplier: number;
  max_price_multiplier: number;
  demand_weight: number;
  availability_weight: number;
  risk_weight: number;
  fuel_weight: number;
  updated_at: string;
  updated_by: string | null;
}

interface PriceCalculation {
  basePrice: number;
  demandMultiplier: number;
  availabilityMultiplier: number;
  riskPremium: number;
  fuelAdjustment: number;
  suggestedPrice: number;
  marginPercent: number;
  confidence: "high" | "medium" | "low";
}

/**
 * Dynamic Pricing Engine - Section A
 * Adjusts pricing based on demand, availability, fuel, and risk
 */
const DynamicPricingEngine = () => {
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const queryClient = useQueryClient();
  
  const [routeDistance, setRouteDistance] = useState<number>(100);
  const [baseRate, setBaseRate] = useState<number>(500);
  
  const isAdmin = userRole === "admin" || userRole === "super_admin";
  const canSetBounds = isAdmin;
  const isOpsManager = userRole === "ops_manager";

  // Mock pricing configuration (would come from database in production)
  const config: PricingConfig = {
    id: "1",
    min_price_multiplier: 0.9,
    max_price_multiplier: 1.5,
    demand_weight: 0.3,
    availability_weight: 0.25,
    risk_weight: 0.2,
    fuel_weight: 0.25,
    updated_at: new Date().toISOString(),
    updated_by: null,
  };

  // Fetch historical demand data
  const { data: demandData } = useQuery({
    queryKey: ["pricing-demand"],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      
      const { data, error } = await supabase
        .from("dispatches")
        .select("created_at, route_id, status")
        .gte("created_at", thirtyDaysAgo);

      if (error) throw error;
      
      // Calculate demand score (dispatches per day)
      const avgPerDay = safeDivide(data?.length || 0, 30);
      const demandScore = Math.min(avgPerDay / 10, 2); // Cap at 2x
      
      return { dispatches: data?.length || 0, avgPerDay, demandScore };
    },
  });

  // Fetch fleet availability
  const { data: fleetData } = useQuery({
    queryKey: ["pricing-fleet"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, status");

      if (error) throw error;
      
      const total = data?.length || 1;
      const available = data?.filter(v => v.status === "active").length || 0;
      const availabilityRate = safeDivide(available, total);
      
      // Lower availability = higher price multiplier
      const availabilityMultiplier = availabilityRate < 0.3 ? 1.3 : availabilityRate < 0.5 ? 1.15 : 1.0;
      
      return { total, available, availabilityRate, availabilityMultiplier };
    },
  });

  // Fetch fuel cost trends
  const { data: fuelData } = useQuery({
    queryKey: ["pricing-fuel"],
    queryFn: async () => {
      // Use diesel rate config for current fuel prices
      const { data, error } = await supabase
        .from("diesel_rate_config")
        .select("diesel_cost_per_liter")
        .eq("is_active", true)
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      
      const currentPrice = data?.diesel_cost_per_liter || 700;
      const baselinePrice = 600; // Reference baseline
      const fuelAdjustment = safeDivide(currentPrice, baselinePrice, 1);
      
      return { currentPrice, baselinePrice, fuelAdjustment };
    },
  });

  // Mock risk data (would come from route_risk_register in production)
  const riskData = { highRisks: 2, mediumRisks: 5, riskPremium: 1.15 };

  // Calculate suggested price
  const calculatePrice = (): PriceCalculation => {
    const demandMultiplier = demandData?.demandScore || 1;
    const availabilityMultiplier = fleetData?.availabilityMultiplier || 1;
    const riskPremium = riskData.riskPremium;
    const fuelAdjustment = fuelData?.fuelAdjustment || 1;
    
    // Base price = rate per km × distance
    const basePrice = baseRate * routeDistance;
    
    // Apply multipliers with weights from config
    const demandWeight = config?.demand_weight || 0.3;
    const availabilityWeight = config?.availability_weight || 0.25;
    const riskWeight = config?.risk_weight || 0.2;
    const fuelWeight = config?.fuel_weight || 0.25;
    
    const weightedMultiplier = 
      1 + 
      ((demandMultiplier - 1) * demandWeight) +
      ((availabilityMultiplier - 1) * availabilityWeight) +
      ((riskPremium - 1) * riskWeight) +
      ((fuelAdjustment - 1) * fuelWeight);
    
    // Apply bounds
    const minMult = config?.min_price_multiplier || 0.9;
    const maxMult = config?.max_price_multiplier || 1.5;
    const boundedMultiplier = Math.max(minMult, Math.min(maxMult, weightedMultiplier));
    
    const suggestedPrice = basePrice * boundedMultiplier;
    
    // Estimate margin (assuming ~60% of price is cost)
    const estimatedCost = basePrice * 0.6;
    const marginPercent = safeDivide(suggestedPrice - estimatedCost, suggestedPrice) * 100;
    
    // Confidence based on data availability
    const hasAllData = demandData && fleetData && fuelData && riskData;
    const confidence: "high" | "medium" | "low" = hasAllData ? "high" : demandData && fleetData ? "medium" : "low";
    
    return {
      basePrice,
      demandMultiplier,
      availabilityMultiplier,
      riskPremium,
      fuelAdjustment,
      suggestedPrice,
      marginPercent,
      confidence,
    };
  };

  const pricing = calculatePrice();

  // Update pricing bounds (mock - would use database in production)
  const updateBoundsMutation = useMutation({
    mutationFn: async (bounds: { min: number; max: number }) => {
      // In production, this would update the database
      console.log("Updating bounds:", bounds);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Pricing bounds updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Dynamic Pricing Engine
          </h3>
          <p className="text-sm text-muted-foreground">
            Intelligent price suggestions based on market factors
          </p>
        </div>
        <Badge variant={pricing.confidence === "high" ? "default" : pricing.confidence === "medium" ? "secondary" : "outline"}>
          {pricing.confidence} confidence
        </Badge>
      </div>

      {/* Input Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Route Distance (km)</Label>
              <Input
                type="number"
                value={routeDistance}
                onChange={(e) => setRouteDistance(Number(e.target.value) || 0)}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Base Rate (₦/km)</Label>
              <Input
                type="number"
                value={baseRate}
                onChange={(e) => setBaseRate(Number(e.target.value) || 0)}
                min={1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Factors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Demand</span>
            </div>
            <p className="text-2xl font-bold">{pricing.demandMultiplier.toFixed(2)}x</p>
            <p className="text-xs text-muted-foreground">
              {demandData?.avgPerDay.toFixed(1)} trips/day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Availability</span>
            </div>
            <p className="text-2xl font-bold">{pricing.availabilityMultiplier.toFixed(2)}x</p>
            <p className="text-xs text-muted-foreground">
              {fleetData?.available}/{fleetData?.total} trucks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Risk Premium</span>
            </div>
            <p className="text-2xl font-bold">{pricing.riskPremium.toFixed(2)}x</p>
            <p className="text-xs text-muted-foreground">
              {riskData?.highRisks} high-risk routes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Fuel className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Fuel Index</span>
            </div>
            <p className="text-2xl font-bold">{pricing.fuelAdjustment.toFixed(2)}x</p>
            <p className="text-xs text-muted-foreground">
              ₦{fuelData?.currentPrice}/L
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Price */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Suggested Price</p>
              <p className="text-4xl font-bold text-primary">
                ₦{pricing.suggestedPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">
                  Base: ₦{pricing.basePrice.toLocaleString()}
                </span>
                <Badge variant={pricing.marginPercent > 30 ? "default" : pricing.marginPercent > 15 ? "secondary" : "destructive"}>
                  {pricing.marginPercent.toFixed(1)}% margin
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {isOpsManager && (
                <Button variant="outline">Override Price</Button>
              )}
              <Button>
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept Price
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Margin Impact Preview */}
      <Alert>
        <BarChart3 className="w-4 h-4" />
        <AlertTitle>Margin Impact Analysis</AlertTitle>
        <AlertDescription>
          At this price point, expected profit margin is {pricing.marginPercent.toFixed(1)}%. 
          {pricing.marginPercent < 15 && " Consider reviewing cost structure or increasing base rate."}
          {pricing.marginPercent > 40 && " Strong margin - may have room for competitive pricing."}
        </AlertDescription>
      </Alert>

      {/* Admin Controls */}
      {canSetBounds && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Pricing Bounds (Admin Only)
            </CardTitle>
            <CardDescription>
              Set minimum and maximum price multipliers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Multiplier: {config?.min_price_multiplier || 0.9}x</Label>
                <Slider
                  value={[config?.min_price_multiplier || 0.9]}
                  min={0.5}
                  max={1.0}
                  step={0.05}
                  onValueChange={(v) => updateBoundsMutation.mutate({ min: v[0], max: config?.max_price_multiplier || 1.5 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Multiplier: {config?.max_price_multiplier || 1.5}x</Label>
                <Slider
                  value={[config?.max_price_multiplier || 1.5]}
                  min={1.0}
                  max={2.0}
                  step={0.05}
                  onValueChange={(v) => updateBoundsMutation.mutate({ min: config?.min_price_multiplier || 0.9, max: v[0] })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DynamicPricingEngine;
