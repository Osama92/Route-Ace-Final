import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  History,
  Target,
  Zap,
  Clock,
  MapPin,
  DollarSign,
  Truck,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Info,
  Shield
} from "lucide-react";

interface LearningInsight {
  id: string;
  category: "eta" | "grouping" | "confidence" | "margin" | "pattern";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number;
  dataPoints: number;
  suggestedAction?: string;
  approved?: boolean;
  appliedAt?: string;
  metrics?: {
    before: number;
    after: number;
    improvement: number;
  };
}

interface RoutePattern {
  patternId: string;
  region: string;
  avgDelayHours: number;
  confidenceScore: number;
  frequency: number;
  trend: "improving" | "stable" | "degrading";
  riskFactors: string[];
}

interface SelfLearningInsightsProps {
  routeId?: string;
  region?: string;
  compact?: boolean;
}

const MOCK_INSIGHTS: LearningInsight[] = [
  {
    id: "insight-1",
    category: "eta",
    title: "ETA Adjustment for Lagos-Ibadan Corridor",
    description: "Routes with >8 drops in Lagos-Ibadan corridor underperform ETA by 12%. Recommended buffer adjustment applied.",
    impact: "high",
    confidence: 89,
    dataPoints: 156,
    suggestedAction: "Add 1.5hr buffer to ETA for routes with >8 drops",
    metrics: { before: 72, after: 84, improvement: 12 }
  },
  {
    id: "insight-2",
    category: "grouping",
    title: "Optimal Drop Density Detected",
    description: "15T trucks perform 18% better when limited to 4 drops vs 5 drops in heavy traffic zones.",
    impact: "medium",
    confidence: 82,
    dataPoints: 89,
    suggestedAction: "Reduce max drops to 4 for 15T in congested areas",
    metrics: { before: 68, after: 80, improvement: 18 }
  },
  {
    id: "insight-3",
    category: "confidence",
    title: "Confidence Score Calibration",
    description: "Routes rated 70-80% confidence are delivering on-time 85% of the time - scores are conservative.",
    impact: "low",
    confidence: 76,
    dataPoints: 234,
    suggestedAction: "Adjust confidence bands by +5% for medium tier"
  },
  {
    id: "insight-4",
    category: "pattern",
    title: "Underperforming Route Pattern",
    description: "Apapa port routes consistently exceed ETA by 2+ hours during 7-10am. Consider alternative staging.",
    impact: "high",
    confidence: 94,
    dataPoints: 67,
    suggestedAction: "Reschedule Apapa port pickups to avoid 7-10am window",
  },
  {
    id: "insight-5",
    category: "margin",
    title: "High-Value Customer Optimization",
    description: "Priority orders from top 10 customers have 22% higher margins - recommend dedicated routing.",
    impact: "medium",
    confidence: 85,
    dataPoints: 112,
    suggestedAction: "Create priority lanes for high-value customers",
    metrics: { before: 18, after: 22, improvement: 22 }
  }
];

const MOCK_PATTERNS: RoutePattern[] = [
  {
    patternId: "pattern-1",
    region: "Lagos Island",
    avgDelayHours: 1.2,
    confidenceScore: 72,
    frequency: 45,
    trend: "improving",
    riskFactors: ["Traffic congestion", "Narrow streets"]
  },
  {
    patternId: "pattern-2",
    region: "Apapa Port",
    avgDelayHours: 2.8,
    confidenceScore: 58,
    frequency: 23,
    trend: "degrading",
    riskFactors: ["Port delays", "Truck queues", "Documentation"]
  },
  {
    patternId: "pattern-3",
    region: "Victoria Island",
    avgDelayHours: 0.5,
    confidenceScore: 88,
    frequency: 67,
    trend: "stable",
    riskFactors: []
  }
];

const SelfLearningInsights = ({ routeId, region, compact = false }: SelfLearningInsightsProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [insights, setInsights] = useState<LearningInsight[]>(MOCK_INSIGHTS);
  const [patterns, setPatterns] = useState<RoutePattern[]>(MOCK_PATTERNS);
  const [autoApply, setAutoApply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate learning from historical data
  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        // In production, this would fetch real learning insights from the backend
        // For now, we use mock data
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Failed to fetch learning insights:", error);
      }
    };

    fetchLearningData();
  }, [routeId, region]);

  const handleApproveInsight = async (insightId: string) => {
    setInsights(prev => prev.map(i => 
      i.id === insightId ? { ...i, approved: true, appliedAt: new Date().toISOString() } : i
    ));
    
    toast({
      title: "Insight Approved",
      description: "Learning adjustment will be applied to future routes"
    });

    // Log approval for governance
    try {
      await supabase.from("audit_logs").insert({
        action: "learning_insight_approved",
        table_name: "route_learning",
        record_id: insightId,
        new_data: { approved: true, appliedAt: new Date().toISOString() }
      });
    } catch (error) {
      console.error("Failed to log approval:", error);
    }
  };

  const handleRejectInsight = async (insightId: string) => {
    setInsights(prev => prev.filter(i => i.id !== insightId));
    
    toast({
      title: "Insight Rejected",
      description: "This learning will not be applied"
    });
  };

  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setLoading(false);
    toast({
      title: "Insights Refreshed",
      description: "Latest learning data loaded"
    });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-destructive text-destructive-foreground";
      case "medium": return "bg-warning text-warning-foreground";
      case "low": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "eta": return Clock;
      case "grouping": return MapPin;
      case "confidence": return Shield;
      case "margin": return DollarSign;
      case "pattern": return TrendingUp;
      default: return Brain;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="w-4 h-4 text-success" />;
      case "degrading": return <TrendingDown className="w-4 h-4 text-destructive" />;
      default: return <Target className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (compact) {
    return (
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">AI Learning Insights</span>
          </div>
          <Badge variant="secondary">{insights.filter(i => !i.approved).length} pending</Badge>
        </div>
        {insights.slice(0, 2).map(insight => (
          <div key={insight.id} className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Zap className="w-3 h-3 text-primary" />
            <span className="truncate">{insight.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Card className="border-primary/20">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Self-Learning Intelligence
                <Badge variant="outline" className="text-xs">Beta</Badge>
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {insights.filter(i => !i.approved).length} pending insights
                </Badge>
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-apply"
                    checked={autoApply}
                    onCheckedChange={setAutoApply}
                  />
                  <Label htmlFor="auto-apply" className="text-sm">Auto-apply low-impact suggestions</Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
                <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Learning Insights */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <h4 className="font-medium">Active Learning Insights</h4>
              </div>

              <div className="space-y-3">
                {insights.map(insight => {
                  const Icon = getCategoryIcon(insight.category);
                  return (
                    <div 
                      key={insight.id} 
                      className={`p-4 rounded-lg border ${insight.approved ? "bg-success/5 border-success/20" : "bg-muted/30"}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="p-2 rounded bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{insight.title}</h5>
                              <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                                {insight.impact} impact
                              </Badge>
                              {insight.approved && (
                                <Badge variant="default" className="text-xs gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Applied
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {insight.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {insight.confidence}% confidence
                              </span>
                              <span className="flex items-center gap-1">
                                <History className="w-3 h-3" />
                                {insight.dataPoints} data points
                              </span>
                              {insight.metrics && (
                                <span className="flex items-center gap-1 text-success">
                                  <TrendingUp className="w-3 h-3" />
                                  +{insight.metrics.improvement}% improvement
                                </span>
                              )}
                            </div>
                            {insight.suggestedAction && (
                              <div className="mt-2 p-2 bg-primary/5 rounded text-xs">
                                <span className="font-medium">Suggested:</span> {insight.suggestedAction}
                              </div>
                            )}
                          </div>
                        </div>
                        {!insight.approved && (
                          <div className="flex flex-col gap-1">
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleApproveInsight(insight.id)}
                            >
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleRejectInsight(insight.id)}
                            >
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Route Patterns */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h4 className="font-medium">Regional Performance Patterns</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {patterns.map(pattern => (
                  <div 
                    key={pattern.patternId}
                    className={`p-4 rounded-lg border ${
                      pattern.confidenceScore >= 80 ? "bg-success/5 border-success/20" :
                      pattern.confidenceScore >= 60 ? "bg-warning/5 border-warning/20" :
                      "bg-destructive/5 border-destructive/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{pattern.region}</h5>
                      {getTrendIcon(pattern.trend)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium">{pattern.confidenceScore}%</span>
                      </div>
                      <Progress value={pattern.confidenceScore} className="h-1.5" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Avg Delay: {pattern.avgDelayHours}h</span>
                        <span>{pattern.frequency} routes</span>
                      </div>
                      {pattern.riskFactors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {pattern.riskFactors.map((risk, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance Notice */}
            <div className="p-3 bg-muted/30 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Governance Notice</p>
                <p>All learning adjustments are logged and auditable. Major logic changes require admin approval. Model updates are applied weekly after human review.</p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SelfLearningInsights;
