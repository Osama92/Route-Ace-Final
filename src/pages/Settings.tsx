import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Settings as SettingsIcon,
  Mail,
  Map,
  FileText,
  Bell,
  Shield,
  Users,
  MessageSquare,
  Zap,
  ExternalLink,
  Check,
  AlertCircle,
  Loader2,
  Building2,
  Upload,
  Image,
  Pen,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import SubscriptionManager from "@/components/subscription/SubscriptionManager";

interface Integration {
  id: string;
  name: string;
  type: string;
  is_enabled: boolean | null;
  config: Record<string, any> | null;
  last_sync_at: string | null;
}

const SettingsPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();
  const { hasAnyRole, user } = useAuth();
  const { settings: companySettings, updateSettings: updateCompanySettings, uploadAndSaveSignature, uploadAndSaveLogo, loading: companyLoading, forceRefresh } = useCompanySettings();

  const signatureInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [signaturePreview, setSignaturePreview] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploadingSignature, setUploadingSignature] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const isAdmin = hasAnyRole(["admin", "super_admin", "org_admin"]);

  const [formData, setFormData] = useState({
    resend_api_key: "",
    erp_client_id: "",
    erp_client_secret: "",
    erp_organization_id: "",
    mapbox_token: "",
    google_maps_key: "",
    leadership_email: "",
    support_email: "",
    sla_sms_recipients: "",
  });

  const [companyFormData, setCompanyFormData] = useState({
    company_name: "",
    tagline: "",
    email: "",
    phone: "",
    address: "",
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
  });

  // Update company form when settings load
  useEffect(() => {
    if (companySettings) {
      setCompanyFormData({
        company_name: companySettings.company_name || "",
        tagline: companySettings.tagline || "",
        email: companySettings.email || "",
        phone: companySettings.phone || "",
        address: companySettings.address || "",
        bank_name: companySettings.bank_name || "",
        bank_account_name: companySettings.bank_account_name || "",
        bank_account_number: companySettings.bank_account_number || "",
      });
      if (companySettings.signature_url) {
        setSignaturePreview(companySettings.signature_url);
      }
      if (companySettings.logo_url) {
        setLogoPreview(companySettings.logo_url);
      }
    }
  }, [companySettings]);

  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .order("name");

      if (error) throw error;
      
      if (data) {
        const typedData = data.map(item => ({
          ...item,
          config: (item.config as Record<string, any>) || {},
          is_enabled: item.is_enabled ?? false,
        }));
        setIntegrations(typedData);
        // Pre-fill form with existing config
        typedData.forEach((integration) => {
          if (integration.name === "resend") {
            setFormData(prev => ({
              ...prev,
              resend_api_key: integration.config?.api_key || "",
            }));
          }
          if (integration.name === "zoho" || integration.name === "erp") {
            setFormData(prev => ({
              ...prev,
              erp_client_id: integration.config?.client_id || "",
              erp_client_secret: integration.config?.client_secret || "",
              erp_organization_id: integration.config?.organization_id || "",
            }));
          }
          if (integration.name === "notifications") {
            setFormData(prev => ({
              ...prev,
              leadership_email: integration.config?.leadership_email || "",
              support_email: integration.config?.support_email || "",
            }));
          }
          if (integration.name === "sms_notifications") {
            setFormData(prev => ({
              ...prev,
              sla_sms_recipients: integration.config?.sla_sms_recipients || "",
            }));
          }
        });
      }
    } catch (error: any) {
      console.error("Error fetching integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchIntegrations();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleSaveIntegration = async (type: string) => {
    setSaving(type);
    try {
      let config: Record<string, any> = {};
      let name = type;

      switch (type) {
        case "resend":
          config = { api_key: formData.resend_api_key };
          break;
        case "zoho":
          config = {
            client_id: formData.erp_client_id,
            client_secret: formData.erp_client_secret,
            organization_id: formData.erp_organization_id,
          };
          break;
        case "notifications":
          config = {
            leadership_email: formData.leadership_email,
            support_email: formData.support_email,
          };
          break;
        case "sms_notifications":
          config = {
            sla_sms_recipients: formData.sla_sms_recipients,
          };
          name = "sms_notifications";
          break;
        default:
          break;
      }

      const existingIntegration = integrations.find(i => i.name === name);

      if (existingIntegration) {
        const { error } = await supabase
          .from("integrations")
          .update({ config, is_enabled: true, updated_at: new Date().toISOString() })
          .eq("id", existingIntegration.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("integrations")
          .insert({ name, type, config, is_enabled: true });

        if (error) throw error;
      }

      toast({
        title: "Settings Saved",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} settings have been updated.`,
      });

      fetchIntegrations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const handleToggleIntegration = async (integration: Integration) => {
    try {
      const { error } = await supabase
        .from("integrations")
        .update({ is_enabled: !integration.is_enabled })
        .eq("id", integration.id);

      if (error) throw error;

      toast({
        title: integration.is_enabled ? "Integration Disabled" : "Integration Enabled",
        description: `${integration.name} has been ${integration.is_enabled ? "disabled" : "enabled"}.`,
      });

      fetchIntegrations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to toggle integration",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return (
      <DashboardLayout title="Settings" subtitle="Manage platform settings and integrations">
        <div className="flex flex-col items-center justify-center py-16">
          <Shield className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Access Restricted</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You don't have permission to access settings. Please contact an administrator.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage platform settings and integrations"
    >
      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="integrations">
            <Zap className="w-4 h-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="billing">
            <Building2 className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="general">
            <SettingsIcon className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
        </TabsList>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <SubscriptionManager />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zoho Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">ERP Integration</CardTitle>
                        <CardDescription>Sync invoices with your ERP (Zoho, SAP, Oracle, QuickBooks)</CardDescription>
                      </div>
                    </div>
                    {integrations.find(i => i.name === "zoho" || i.name === "erp")?.is_enabled && (
                      <Check className="w-5 h-5 text-success" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="erp_client_id">Client ID</Label>
                    <Input
                      id="erp_client_id"
                      value={formData.erp_client_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, erp_client_id: e.target.value }))}
                      placeholder="Enter ERP Client ID"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="erp_client_secret">Client Secret</Label>
                    <Input
                      id="erp_client_secret"
                      type="password"
                      value={formData.erp_client_secret}
                      onChange={(e) => setFormData(prev => ({ ...prev, erp_client_secret: e.target.value }))}
                      placeholder="Enter ERP Client Secret"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="erp_organization_id">Organization ID</Label>
                    <Input
                      id="erp_organization_id"
                      value={formData.erp_organization_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, erp_organization_id: e.target.value }))}
                      placeholder="Enter ERP Organization ID"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <a
                      href="https://accounts.zoho.com/developerconsole"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary flex items-center gap-1 hover:underline"
                    >
                      Get API Keys <ExternalLink className="w-3 h-3" />
                    </a>
                    <Button
                      onClick={() => handleSaveIntegration("zoho")}
                      disabled={saving === "zoho"}
                    >
                      {saving === "zoho" ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Save & Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resend Email Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-info/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-info" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Resend Email</CardTitle>
                        <CardDescription>Send delivery notifications</CardDescription>
                      </div>
                    </div>
                    {integrations.find(i => i.name === "resend")?.is_enabled && (
                      <Check className="w-5 h-5 text-success" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resend_api_key">API Key</Label>
                    <Input
                      id="resend_api_key"
                      type="password"
                      value={formData.resend_api_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, resend_api_key: e.target.value }))}
                      placeholder="re_xxxxxxxxxx"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary flex items-center gap-1 hover:underline"
                    >
                      Get API Key <ExternalLink className="w-3 h-3" />
                    </a>
                    <Button
                      onClick={() => handleSaveIntegration("resend")}
                      disabled={saving === "resend"}
                    >
                      {saving === "resend" ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Save & Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Maps placeholder - for future use */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                      <Map className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Google Maps / Routes</CardTitle>
                      <CardDescription>Route optimization & tracking</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="google_maps_key">Google Maps API Key</Label>
                    <Input
                      id="google_maps_key"
                      type="password"
                      value={formData.google_maps_key}
                      onChange={(e) => setFormData(prev => ({ ...prev, google_maps_key: e.target.value }))}
                      placeholder="AIza..."
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary flex items-center gap-1 hover:underline"
                    >
                      Get API Key <ExternalLink className="w-3 h-3" />
                    </a>
                    <Button
                      onClick={() => handleSaveIntegration("google_maps")}
                      disabled={saving === "google_maps"}
                    >
                      {saving === "google_maps" ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Save & Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Email Notification Settings</CardTitle>
                <CardDescription>
                  Configure where delivery status updates are sent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="leadership_email">Leadership Email</Label>
                    <Input
                      id="leadership_email"
                      type="email"
                      value={formData.leadership_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, leadership_email: e.target.value }))}
                      placeholder="leadership@company.com"
                      className="bg-secondary/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Receives all delivery status updates
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support_email">Support Team Email</Label>
                    <Input
                      id="support_email"
                      type="email"
                      value={formData.support_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, support_email: e.target.value }))}
                      placeholder="support@company.com"
                      className="bg-secondary/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Receives customer support-related updates
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSaveIntegration("notifications")}
                  disabled={saving === "notifications"}
                >
                  {saving === "notifications" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Notification Events</CardTitle>
                <CardDescription>
                  Choose which events trigger email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: "dispatch_created", label: "New Dispatch Created", description: "When a new delivery is dispatched" },
                  { id: "pickup_started", label: "Pickup Started", description: "When driver starts pickup" },
                  { id: "in_transit", label: "In Transit", description: "When package is in transit" },
                  { id: "delivered", label: "Delivered", description: "When package is delivered" },
                  { id: "document_expiry", label: "Document Expiry Alerts", description: "7 days before document expires" },
                ].map((event) => (
                  <div key={event.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{event.label}</p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* SMS Notifications Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">SMS Notifications</CardTitle>
                    <CardDescription>Configure SMS alerts for critical events</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sla_sms_recipients">SLA Breach SMS Recipients</Label>
                  <Input
                    id="sla_sms_recipients"
                    value={formData.sla_sms_recipients}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      sla_sms_recipients: e.target.value 
                    }))}
                    placeholder="+2348012345678, +2349012345678"
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated phone numbers in international format (+234...)
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    SMS notifications will be sent via Africa's Talking when SLA breaches are detected.
                    Standard SMS rates apply.
                  </p>
                </div>
                <Button 
                  onClick={() => handleSaveIntegration("sms_notifications")}
                  disabled={saving === "sms_notifications"}
                >
                  {saving === "sms_notifications" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Save SMS Settings
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          {/* Company Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Company Profile</CardTitle>
                    <CardDescription>Configure your company details for invoices and payslips</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Company Name *</Label>
                    <Input
                      id="company_name"
                      value={companyFormData.company_name}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, company_name: e.target.value }))}
                      placeholder="Enter company name"
                      className="bg-secondary/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will appear on all invoices and payslips
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={companyFormData.tagline}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="e.g. Professional Logistics Solutions"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Email</Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={companyFormData.email}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="accounts@company.com"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_phone">Phone</Label>
                    <Input
                      id="company_phone"
                      value={companyFormData.phone}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+234 XXX XXX XXXX"
                      className="bg-secondary/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_address">Address</Label>
                  <Textarea
                    id="company_address"
                    value={companyFormData.address}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Enter full company address"
                    className="bg-secondary/50"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bank Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
                <CardDescription>Payment information displayed on invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      value={companyFormData.bank_name}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                      placeholder="e.g. First Bank of Nigeria"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank_account_name">Account Name</Label>
                    <Input
                      id="bank_account_name"
                      value={companyFormData.bank_account_name}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, bank_account_name: e.target.value }))}
                      placeholder="Company Name Ltd"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank_account_number">Account Number</Label>
                    <Input
                      id="bank_account_number"
                      value={companyFormData.bank_account_number}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, bank_account_number: e.target.value }))}
                      placeholder="0123456789"
                      className="bg-secondary/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Signature & Logo Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Signature & Logo</CardTitle>
                <CardDescription>Upload signature and logo for invoices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Signature Upload */}
                  <div className="space-y-3">
                    <Label>Authorized Signature</Label>
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => signatureInputRef.current?.click()}
                    >
                      {signaturePreview ? (
                        <div className="space-y-2">
                          <img 
                            src={signaturePreview} 
                            alt="Signature" 
                            className="max-h-20 mx-auto object-contain"
                          />
                          <p className="text-xs text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Pen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Upload signature image</p>
                          <p className="text-xs text-muted-foreground">PNG or JPG, max 2MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={signatureInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            toast({
                              title: "File too large",
                              description: "Please upload an image under 2MB",
                              variant: "destructive",
                            });
                            return;
                          }
                          setUploadingSignature(true);
                          const url = await uploadAndSaveSignature(file);
                          if (url) {
                            setSignaturePreview(url);
                          }
                          setUploadingSignature(false);
                        }
                      }}
                    />
                    {uploadingSignature && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-3">
                    <Label>Company Logo</Label>
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {logoPreview ? (
                        <div className="space-y-2">
                          <img 
                            src={logoPreview} 
                            alt="Logo" 
                            className="max-h-20 mx-auto object-contain"
                          />
                          <p className="text-xs text-muted-foreground">Click to change</p>
                        </div>
                      ) : (
                        <div className="py-4">
                          <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Upload company logo</p>
                          <p className="text-xs text-muted-foreground">PNG or JPG, max 2MB</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            toast({
                              title: "File too large",
                              description: "Please upload an image under 2MB",
                              variant: "destructive",
                            });
                            return;
                          }
                          setUploadingLogo(true);
                          const url = await uploadAndSaveLogo(file);
                          if (url) {
                            setLogoPreview(url);
                          }
                          setUploadingLogo(false);
                        }
                      }}
                    />
                    {uploadingLogo && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={async () => {
                setSaving("company");
                const result = await updateCompanySettings(companyFormData);
                // Only update local state if save succeeded - result contains saved record
                if (result) {
                  setCompanyFormData({
                    company_name: result.company_name || "",
                    tagline: result.tagline || "",
                    email: result.email || "",
                    phone: result.phone || "",
                    address: result.address || "",
                    bank_name: result.bank_name || "",
                    bank_account_name: result.bank_account_name || "",
                    bank_account_number: result.bank_account_number || "",
                  });
                  if (result.signature_url) setSignaturePreview(result.signature_url);
                  if (result.logo_url) setLogoPreview(result.logo_url);
                }
                setSaving(null);
              }}
              disabled={saving === "company"}
              size="lg"
            >
              {saving === "company" ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Save Company Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SettingsPage;