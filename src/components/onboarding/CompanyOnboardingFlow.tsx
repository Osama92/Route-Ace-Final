import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Building2, Crown, Shield, Users, CheckCircle2, ArrowRight, ArrowLeft,
  Loader2, MapPin, Truck, Sparkles, Target, Globe, Package,
} from "lucide-react";
import BusinessProfileStep, { type BusinessProfile } from "@/components/strategy/BusinessProfileStep";
import LogisticsTypeStep, { type LogisticsTypeData, type LogisticsModelType } from "./LogisticsTypeStep";
import PricingEstimatorStep from "./PricingEstimatorStep";
import PlatformSelectStep, { type PlatformChoice } from "./PlatformSelectStep";
import ModeSelectionStep, { type TenantModeChoice } from "./ModeSelectionStep";

interface OnboardingFlowProps {
  onComplete?: () => void;
}

interface CompanyData {
  companyName: string;
  industry: string;
  fleetSize: string;
  country: string;
  currency: string;
}

const STEPS = [
  { id: 1, title: "Operating Mode", icon: Building2, description: "Logistics company or department?" },
  { id: 2, title: "Select Platform", icon: Globe, description: "Which operating system do you need?" },
  { id: 3, title: "Company Setup", icon: Building2, description: "Tell us about your business" },
  { id: 4, title: "Operations Type", icon: Truck, description: "Classify your logistics model" },
  { id: 5, title: "Your Pricing", icon: Target, description: "See your estimated cost" },
  { id: 6, title: "Business Profile", icon: Target, description: "Define your strategic direction" },
  { id: 7, title: "Owner Setup", icon: Crown, description: "Establish platform ownership" },
  { id: 8, title: "Access Control", icon: Shield, description: "Understand your powers" },
  { id: 9, title: "Guided Tour", icon: Sparkles, description: "Get started quickly" },
];

const INDUSTRIES = [
  "Logistics & Freight",
  "E-commerce Delivery",
  "Food & Grocery Delivery",
  "Courier Services",
  "Fleet Management",
  "Last-Mile Delivery",
  "Trucking & Haulage",
  "Other",
];

const FLEET_SIZES = [
  "1-5 vehicles",
  "6-20 vehicles",
  "21-50 vehicles",
  "51-100 vehicles",
  "100+ vehicles",
];

const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United States",
  "United Kingdom",
  "Other",
];

const CURRENCIES = [
  { code: "NGN", name: "Nigerian Naira (₦)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "KES", name: "Kenyan Shilling (KSh)" },
  { code: "ZAR", name: "South African Rand (R)" },
];

export function CompanyOnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const navigate = useNavigate();
  const { user, refreshApprovalStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyName: "",
    industry: "",
    fleetSize: "",
    country: "Nigeria",
    currency: "NGN",
  });
  const [tenantMode, setTenantMode] = useState<TenantModeChoice>("");
  const [platformChoice, setPlatformChoice] = useState<PlatformChoice>("");
  const [logisticsType, setLogisticsType] = useState<LogisticsTypeData>({
    operationType: "",
    vehicleCount: "",
    vehicleTypes: "",
    operatingRegions: "",
    monthlyDeliveries: "",
    avgStopsPerRoute: "",
    deliveryFrequency: "",
    avgDeliveryDistance: "",
  });
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    industry: "",
    targetMarkets: "",
    fleetType: "",
    revenueTarget12m: "",
    currentMonthlyRevenue: "",
    profitMarginTarget: "",
    growthAmbition: "",
    visionStatement: "",
  });

  const totalSteps = 9;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Skip logistics-specific steps for Industry OS (after platform select on step 2)
      if (platformChoice === "industry" && currentStep === 3) {
        setCurrentStep(6); // Skip ops type + pricing, go to business profile
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Skip logistics-specific steps backwards for Industry OS
      if (platformChoice === "industry" && currentStep === 6) {
        setCurrentStep(3);
        return;
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("You must be logged in to complete setup");
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine region_mode from selected country
      const nigeriaCodes = ["Nigeria", "Ghana", "Kenya", "South Africa"];
      const regionMode = nigeriaCodes.includes(companyData.country) ? "NG" : "GLOBAL";
      const countryCodeMap: Record<string, string> = {
        "Nigeria": "NG", "Ghana": "GH", "Kenya": "KE", "South Africa": "ZA",
        "United States": "US", "United Kingdom": "GB", "Other": "GB",
      };
      const countryCode = countryCodeMap[companyData.country] || "NG";

      // Update company settings
      const { error: settingsError } = await supabase
        .from("company_settings")
        .upsert({
          company_name: companyData.companyName || "My Company",
          updated_by: user.id,
        });

      if (settingsError) {
        console.error("Error updating company settings:", settingsError);
      }

      // Persist region_mode to profile
      await supabase
        .from("profiles")
        .update({ region_mode: regionMode, country_code: countryCode } as any)
        .eq("user_id", user.id);

      // Determine plan defaults based on operating model
      const planDefaults = {
        haulage: { ai_credits_total: 0 },
        multidrop: { ai_credits_total: 500 },
        hybrid: { ai_credits_total: 500 },
      };
      const modelCredits = planDefaults[logisticsType.operationType as keyof typeof planDefaults] || { ai_credits_total: 0 };

      // Save tenant config for governance
      const currencyMap: Record<string, string> = {
        "NGN": "NGN", "USD": "USD", "GBP": "GBP", "EUR": "EUR", "KES": "KES", "ZAR": "ZAR",
      };
      await supabase
        .from("tenant_config" as any)
        .upsert({
          user_id: user.id,
          company_name: companyData.companyName || "My Company",
          business_email: user.email,
          country: companyData.country,
          company_size: companyData.fleetSize,
          operating_model: logisticsType.operationType || "haulage",
          vehicle_count: parseInt(logisticsType.vehicleCount) || 1,
          vehicle_classes: logisticsType.vehicleTypes ? [logisticsType.vehicleTypes] : [],
          billing_currency: companyData.currency || "NGN",
          plan_tier: "free",
          ai_credits_total: modelCredits.ai_credits_total,
          enabled_modules: JSON.stringify(["dispatching", "fleet", "drivers", "tracking", "reporting"]),
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          onboarding_step: 9,
          // Dual-mode fields
          tenant_mode: tenantMode || "LOGISTICS_COMPANY",
          mode_locked_at: new Date().toISOString(),
          uses_warehouse_dispatch: tenantMode === "LOGISTICS_DEPARTMENT",
          enable_website_builder: tenantMode === "LOGISTICS_COMPANY",
        } as any, { onConflict: "user_id" });

      // Log the onboarding completion
      await supabase.from("audit_logs").insert([{
        action: "onboarding_completed",
        table_name: "company_settings",
        record_id: user.id,
        user_id: user.id,
        user_email: user.email,
        new_data: {
          company_name: companyData.companyName,
          industry: companyData.industry,
          fleet_size: companyData.fleetSize,
          country: companyData.country,
          currency: companyData.currency,
          region_mode: regionMode,
          logistics_model: logisticsType.operationType,
          vehicle_count: logisticsType.vehicleCount,
          monthly_deliveries: logisticsType.monthlyDeliveries,
          business_profile: businessProfile,
          completed_at: new Date().toISOString(),
        } as any,
      }]);

      // Ensure profile is approved (idempotent — RPC respects governance rules)
      try {
        await supabase.rpc("approve_user_profile", { p_user_id: user.id });
      } catch (approvalErr) {
        console.warn("approve_user_profile call skipped:", approvalErr);
      }

      // Refresh AuthContext so governance panel unlocks instantly without manual reload
      try {
        await refreshApprovalStatus();
      } catch (refreshErr) {
        console.warn("refreshApprovalStatus failed:", refreshErr);
      }

      toast.success(
        regionMode === "NG"
          ? "🇳🇬 Welcome to RouteAce Nigeria! Your platform is ready."
          : "🌍 Welcome to RouteAce Global! Your platform is ready.",
        { duration: 5000 }
      );

      onComplete?.();
      navigate("/admin-governance");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete setup. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ModeSelectionStep selected={tenantMode} onChange={setTenantMode} />;
      case 2:
        return (
          <PlatformSelectStep selected={platformChoice} onChange={setPlatformChoice} />
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Let's set up your company</h2>
              <p className="text-muted-foreground mt-2">
                Tell us about your business so we can customize your experience
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter your company name"
                  value={companyData.companyName}
                  onChange={(e) =>
                    setCompanyData({ ...companyData, companyName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={companyData.industry}
                  onValueChange={(value) =>
                    setCompanyData({ ...companyData, industry: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fleetSize">Fleet Size</Label>
                  <Select
                    value={companyData.fleetSize}
                    onValueChange={(value) =>
                      setCompanyData({ ...companyData, fleetSize: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fleet size" />
                    </SelectTrigger>
                    <SelectContent>
                      {FLEET_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={companyData.country}
                    onValueChange={(value) =>
                      setCompanyData({ ...companyData, country: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={companyData.currency}
                  onValueChange={(value) =>
                    setCompanyData({ ...companyData, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <LogisticsTypeStep data={logisticsType} onChange={setLogisticsType} />
        );

      case 5:
        return (
          <PricingEstimatorStep
            operationType={logisticsType.operationType}
            vehicleCount={logisticsType.vehicleCount}
            monthlyDeliveries={logisticsType.monthlyDeliveries}
            currency={companyData.currency}
          />
        );

      case 6:
        return (
          <BusinessProfileStep data={businessProfile} onChange={setBusinessProfile} />
        );

      case 7:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-lg">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">You are the Company Owner</h2>
              <p className="text-muted-foreground mt-2">
                As the first user, you have been assigned as the Super Admin
              </p>
            </div>

            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Super Admin Powers
                </CardTitle>
                <CardDescription>
                  Your role cannot be downgraded by anyone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Full System Access", desc: "View, create, edit, approve, and delete everything" },
                  { title: "User Management", desc: "Only you can add or remove staff members" },
                  { title: "Super Admin Assignment", desc: "Only Super Admins can assign/remove other Super Admins" },
                  { title: "Platform Governance", desc: "White-label configuration, API access, investor dashboards" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Your email{" "}
                <span className="font-mono text-foreground">{user?.email}</span> is now
                registered as the Company Owner. This cannot be changed.
              </p>
            </div>
          </motion.div>
        );

      case 8:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Access Control Overview</h2>
              <p className="text-muted-foreground mt-2">
                You have full system control. Here's how roles work:
              </p>
            </div>

            <div className="grid gap-3">
              {[
                { role: "Super Admin", desc: "Full platform access (You)", icon: Crown },
                { role: "Org Admin", desc: "Company management & team oversight", icon: Shield },
                { role: "Ops Manager", desc: "Fleet, dispatch, and route planning", icon: Truck },
                { role: "Finance Manager", desc: "Invoicing, payroll, and funding", icon: Building2 },
                { role: "Dispatcher", desc: "Job creation and driver assignment", icon: MapPin },
              ].map((item) => (
                <div
                  key={item.role}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.role}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  {item.role === "Super Admin" && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>

            <Card>
              <CardContent className="pt-4">
                <h4 className="font-medium mb-2">Quick Actions Available to You:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Invite users and assign roles from Settings → Users</li>
                  <li>• Configure approval workflows from Settings</li>
                  <li>• Set up white-label branding for your clients</li>
                  <li>• Access all dashboards and analytics</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 9:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">You're All Set!</h2>
              <p className="text-muted-foreground mt-2">
                Here's how to get started with RouteAce
              </p>
            </div>

            <div className="space-y-4">
              {[
                { step: 1, title: "Add Your Fleet", desc: "Register your vehicles with their capacity and type", link: "/fleet" },
                { step: 2, title: "Add Drivers", desc: "Onboard your drivers and assign them to vehicles", link: "/drivers" },
                { step: 3, title: "Create Your First Dispatch", desc: "Start planning routes and managing deliveries", link: "/dispatch" },
                { step: 4, title: "Invite Your Team", desc: "Add team members with appropriate roles", link: "/users" },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(item.link)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
              <p className="text-sm">
                Need help? Look for the{" "}
                <span className="font-medium text-primary">guidance prompts</span> throughout
                the platform, or contact support.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 w-16 sm:w-24 mx-2 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-semibold">{STEPS[currentStep - 1].title}</h3>
            <p className="text-sm text-muted-foreground">
              {STEPS[currentStep - 1].description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto px-6 py-8 w-full">
        <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t bg-card">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={(currentStep === 1 && !tenantMode) || (currentStep === 2 && !platformChoice)}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Get Started
                  <Sparkles className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanyOnboardingFlow;
