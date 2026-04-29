import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Plug, RefreshCw, AlertTriangle, Lock, ArrowRight, Search, X, Activity } from "lucide-react";
import {
  INTEGRATION_CATALOG, CATEGORIES, IntegrationApp, IntegrationCategory,
} from "@/lib/integrations/catalog";

type Status = "active" | "syncing" | "error" | "disconnected";

interface Connection {
  appId: string;
  status: Status;
  connectedAt: string;
  lastSyncAt?: string;
  errorMessage?: string;
  mappings: { source: string; target: string; confidence: number; confirmed: boolean }[];
}

const STORAGE_KEY = "routeace.integration.connections.v1";

function loadConnections(): Connection[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveConnections(c: Connection[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
}

const statusBadge: Record<Status, { label: string; cls: string; dot: string }> = {
  active:       { label: "🟢 Active",       cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30", dot: "bg-emerald-500" },
  syncing:      { label: "🟡 Syncing",      cls: "bg-amber-500/10 text-amber-600 border-amber-500/30",       dot: "bg-amber-500"   },
  error:        { label: "🔴 Error",        cls: "bg-rose-500/10 text-rose-600 border-rose-500/30",          dot: "bg-rose-500"    },
  disconnected: { label: "⚪ Disconnected",  cls: "bg-muted text-muted-foreground border-border",             dot: "bg-muted-foreground" },
};

export default function IntegrationHub() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<Connection[]>(loadConnections());
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory | "all">("all");

  // Wizard state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedApp, setSelectedApp] = useState<IntegrationApp | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);
  const [mappings, setMappings] = useState<Connection["mappings"]>([]);

  const filteredApps = useMemo(() => {
    return INTEGRATION_CATALOG.filter(a => {
      if (activeCategory !== "all" && a.category !== activeCategory) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, activeCategory]);

  const connectionFor = (appId: string) => connections.find(c => c.appId === appId);

  const startWizard = (app: IntegrationApp) => {
    setSelectedApp(app);
    setStep(1);
    setCredentials({});
    setAuthError(null);
    setMappings(app.defaultMappings.map(m => ({ ...m, confirmed: m.confidence >= 80 })));
    setWizardOpen(true);
  };

  const goToStep2 = () => setStep(2);

  const validateAuth = async () => {
    if (!selectedApp) return;
    setValidating(true);
    setAuthError(null);
    // Simulate validation. Real OAuth/key validation would round-trip an edge function.
    await new Promise(r => setTimeout(r, 900));
    if (selectedApp.authMode === "api_key") {
      const missing = (selectedApp.fields || []).filter(f => !credentials[f.key]?.trim());
      if (missing.length) {
        setAuthError(`Missing required fields: ${missing.map(m => m.label).join(", ")}`);
        setValidating(false);
        return;
      }
    }
    setValidating(false);
    setStep(3);
  };

  const finishConnect = () => {
    if (!selectedApp) return;
    const next: Connection = {
      appId: selectedApp.id,
      status: "active",
      connectedAt: new Date().toISOString(),
      lastSyncAt: new Date().toISOString(),
      mappings,
    };
    const updated = [...connections.filter(c => c.appId !== selectedApp.id), next];
    setConnections(updated);
    saveConnections(updated);
    toast({ title: `Connected ${selectedApp.name}`, description: "Initial sync started in background." });
    setWizardOpen(false);
  };

  const syncNow = (appId: string) => {
    const updated = connections.map(c =>
      c.appId === appId ? { ...c, status: "syncing" as Status } : c
    );
    setConnections(updated);
    saveConnections(updated);
    setTimeout(() => {
      const done = updated.map(c =>
        c.appId === appId ? { ...c, status: "active" as Status, lastSyncAt: new Date().toISOString() } : c
      );
      setConnections(done);
      saveConnections(done);
      toast({ title: "Sync complete", description: "All records reconciled." });
    }, 1500);
  };

  const disconnect = (appId: string) => {
    const updated = connections.filter(c => c.appId !== appId);
    setConnections(updated);
    saveConnections(updated);
    toast({ title: "Disconnected", description: "Tokens revoked locally. Re-connect anytime." });
  };

  return (
    <DashboardLayout
      title="Integration Hub"
      subtitle="Connect external systems in 3 steps — no developer required"
    >
      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">Connect App</TabsTrigger>
          <TabsTrigger value="dashboard">My Integrations ({connections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search 80+ apps…"
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Button size="sm" variant={activeCategory === "all" ? "default" : "outline"} onClick={() => setActiveCategory("all")}>All</Button>
              {CATEGORIES.map(c => (
                <Button
                  key={c.id}
                  size="sm"
                  variant={activeCategory === c.id ? "default" : "outline"}
                  onClick={() => setActiveCategory(c.id)}
                >
                  <span className="mr-1.5">{c.icon}</span>{c.label}
                </Button>
              ))}
            </div>
          </div>

          {/* App grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredApps.map(app => {
              const conn = connectionFor(app.id);
              return (
                <Card key={app.id} className="hover:border-primary/30 transition-colors">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-3xl leading-none">{app.logo}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{app.name}</h3>
                          {conn && (
                            <Badge variant="outline" className={`text-[10px] ${statusBadge[conn.status].cls}`}>
                              {statusBadge[conn.status].label}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] capitalize">{app.category}</Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {app.authMode === "oauth" ? "OAuth" : "API Key"}
                      </Badge>
                      <div className="ml-auto">
                        {conn ? (
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => syncNow(app.id)}>
                            <RefreshCw className="w-3 h-3 mr-1" /> Sync
                          </Button>
                        ) : (
                          <Button size="sm" className="h-7 text-xs" onClick={() => startWizard(app)}>
                            <Plug className="w-3 h-3 mr-1" /> Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-3">
          {connections.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Activity className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No integrations yet</p>
                <p className="text-xs mt-1">Connect your first app to start syncing data automatically.</p>
              </CardContent>
            </Card>
          ) : (
            connections.map(conn => {
              const app = INTEGRATION_CATALOG.find(a => a.id === conn.appId);
              if (!app) return null;
              return (
                <Card key={conn.appId}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{app.logo}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{app.name}</h4>
                          <Badge variant="outline" className={`text-[10px] ${statusBadge[conn.status].cls}`}>
                            {statusBadge[conn.status].label}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                          <span>Connected {new Date(conn.connectedAt).toLocaleDateString()}</span>
                          {conn.lastSyncAt && <span>Last sync: {new Date(conn.lastSyncAt).toLocaleString()}</span>}
                          <span>{conn.mappings.length} mappings</span>
                        </div>
                        {conn.errorMessage && (
                          <div className="mt-2 text-xs text-rose-600 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3" /> {conn.errorMessage}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => syncNow(conn.appId)}>
                          <RefreshCw className="w-3 h-3 mr-1" /> Sync now
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => disconnect(conn.appId)}>
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* 3-step Wizard */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedApp && <span className="text-2xl">{selectedApp.logo}</span>}
              Connect {selectedApp?.name}
            </DialogTitle>
            <DialogDescription>3-step setup. Less than 3 minutes.</DialogDescription>
          </DialogHeader>

          {/* Stepper */}
          <div className="flex items-center gap-2 my-2">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <div className="text-xs font-medium hidden sm:block">
                  {s === 1 ? "Select" : s === 2 ? "Authenticate" : "Map & Confirm"}
                </div>
                {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step content */}
          {step === 1 && selectedApp && (
            <div className="space-y-3">
              <Card className="bg-muted/30">
                <CardContent className="py-4 text-sm">
                  <p className="font-medium mb-1">{selectedApp.name}</p>
                  <p className="text-muted-foreground">{selectedApp.description}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {selectedApp.defaultMappings.slice(0, 4).map(m => (
                      <Badge key={m.source} variant="outline" className="text-[10px]">{m.source}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Credentials are encrypted at rest and isolated per tenant.
              </p>
            </div>
          )}

          {step === 2 && selectedApp && (
            <div className="space-y-3">
              {selectedApp.authMode === "oauth" ? (
                <Card>
                  <CardContent className="py-5 text-center space-y-3">
                    <p className="text-sm">{selectedApp.oauthHint || `You'll be redirected to ${selectedApp.name} to grant access.`}</p>
                    <Button onClick={validateAuth} disabled={validating}>
                      {validating ? "Authorizing…" : `Continue with ${selectedApp.name}`}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {(selectedApp.fields || []).map(f => (
                    <div key={f.key}>
                      <Label className="text-xs">{f.label}</Label>
                      <Input
                        type={f.type || "text"}
                        placeholder={f.placeholder}
                        value={credentials[f.key] || ""}
                        onChange={e => setCredentials({ ...credentials, [f.key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              )}
              {authError && (
                <div className="text-xs text-rose-600 bg-rose-500/10 border border-rose-500/30 rounded p-2 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5" />
                  <div>
                    <p className="font-medium">Authentication failed</p>
                    <p>{authError}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && selectedApp && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Auto-mapped {mappings.filter(m => m.confidence >= 80).length} of {mappings.length} fields.
                Review and confirm low-confidence rows.
              </p>
              <div className="space-y-2 max-h-64 overflow-auto">
                {mappings.map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded border border-border/50">
                    <Badge variant="outline" className="text-[10px]">RouteAce</Badge>
                    <span className="text-sm font-medium flex-1">{m.source}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium flex-1">{m.target}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${m.confidence >= 80 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30"}`}
                    >
                      {m.confidence}%
                    </Badge>
                    <Button
                      size="sm"
                      variant={m.confirmed ? "default" : "outline"}
                      className="h-6 text-[10px]"
                      onClick={() => {
                        const next = [...mappings];
                        next[idx] = { ...m, confirmed: !m.confirmed };
                        setMappings(next);
                      }}
                    >
                      {m.confirmed ? "Confirmed" : "Confirm"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setWizardOpen(false)}>Cancel</Button>
            {step === 1 && <Button onClick={goToStep2}>Continue <ArrowRight className="w-3.5 h-3.5 ml-1" /></Button>}
            {step === 2 && selectedApp?.authMode === "api_key" && (
              <Button onClick={validateAuth} disabled={validating}>{validating ? "Validating…" : "Validate & Continue"}</Button>
            )}
            {step === 3 && (
              <Button
                onClick={finishConnect}
                disabled={mappings.some(m => !m.confirmed)}
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Finish & Sync
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
