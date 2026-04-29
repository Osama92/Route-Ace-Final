import { useEffect, useState } from "react";
import { Loader2, RefreshCw, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface UserRow {
  user_id: string;
  role_tag: string;
  organization_id: string | null;
  composite_score: number | null;
  green_count: number;
  yellow_count: number;
  red_count: number;
  kpi_count: number;
}

interface RoleRow {
  organization_id: string | null;
  role_tag: string;
  user_count: number;
  avg_score: number | null;
  green_count: number;
  yellow_count: number;
  red_count: number;
}

function tierFor(score: number | null) {
  if (score == null) return { label: "—", className: "text-muted-foreground" };
  if (score >= 90) return { label: "Top", className: "bg-emerald-500/10 text-emerald-700 border-emerald-200" };
  if (score >= 70) return { label: "Strong", className: "bg-blue-500/10 text-blue-700 border-blue-200" };
  if (score >= 50) return { label: "Developing", className: "bg-amber-500/10 text-amber-700 border-amber-200" };
  return { label: "At risk", className: "bg-red-500/10 text-red-700 border-red-200" };
}

export default function TeamPerformance() {
  const { toast } = useToast();
  const [perUser, setPerUser] = useState<UserRow[]>([]);
  const [perRole, setPerRole] = useState<RoleRow[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoading(true);
    const [teamRes, orgRes] = await Promise.all([
      supabase.rpc("rollup_team_performance"),
      supabase.rpc("rollup_org_performance"),
    ]);
    if (teamRes.error) toast({ title: "Team rollup error", description: teamRes.error.message, variant: "destructive" });
    const team = (teamRes.data ?? []) as UserRow[];
    setPerUser(team.sort((a, b) => (b.composite_score ?? 0) - (a.composite_score ?? 0)));
    setPerRole((orgRes.data ?? []) as RoleRow[]);

    if (team.length) {
      const ids = Array.from(new Set(team.map((r) => r.user_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id,email,full_name")
        .in("user_id", ids);
      const map: Record<string, string> = {};
      (profs ?? []).forEach((p: any) => (map[p.user_id] = p.full_name || p.email || p.user_id.slice(0, 8)));
      setEmails(map);
    }
    setLoading(false);
  }

  async function computeAll() {
    setComputing(true);
    // Compute KPIs for everyone with a role we know about
    const { data: rolesData, error } = await supabase
      .from("user_roles")
      .select("user_id,role")
      .in("role", ["driver", "support", "ops_manager", "finance_manager"]);
    if (error) {
      setComputing(false);
      toast({ title: "Couldn't load users", description: error.message, variant: "destructive" });
      return;
    }
    let ok = 0;
    for (const row of rolesData ?? []) {
      const { error: e } = await supabase.rpc("compute_user_kpis", { p_user_id: row.user_id });
      if (!e) ok++;
    }
    setComputing(false);
    toast({ title: "Computed", description: `${ok} user(s) refreshed.` });
    void load();
  }

  const orgScore = perUser.length
    ? Math.round(
        (perUser.reduce((s, r) => s + (r.composite_score ?? 0), 0) / perUser.length) * 100,
      ) / 100
    : 0;

  return (
    <DashboardLayout title="Team Performance" subtitle="Hierarchical performance roll-up across your organization.">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Aggregated from system-defined KPIs (no manual data).
          </div>
          <Button onClick={computeAll} disabled={computing}>
            {computing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Recompute all
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Overall org performance</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{orgScore || "—"}{orgScore ? "%" : ""}</div>
              <p className="text-xs text-muted-foreground mt-1">Average composite across all tracked users.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Tracked users</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{perUser.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Users with at least one snapshot.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Underperformers</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {perUser.filter((r) => (r.composite_score ?? 0) < 70).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Composite below 70%.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" />By role</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : perRole.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No data yet. Click <strong>Recompute all</strong> to generate snapshots.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Avg score</TableHead>
                    <TableHead>Green</TableHead>
                    <TableHead>Yellow</TableHead>
                    <TableHead>Red</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perRole.map((r) => (
                    <TableRow key={`${r.role_tag}-${r.organization_id ?? "none"}`}>
                      <TableCell className="font-medium capitalize">{r.role_tag.replace(/_/g, " ")}</TableCell>
                      <TableCell>{r.user_count}</TableCell>
                      <TableCell>{r.avg_score ?? "—"}{r.avg_score != null ? "%" : ""}</TableCell>
                      <TableCell><Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-200">{r.green_count}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-200">{r.yellow_count}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-200">{r.red_count}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Per-user leaderboard</CardTitle></CardHeader>
          <CardContent>
            {perUser.length === 0 ? (
              <p className="text-sm text-muted-foreground">No user snapshots yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>KPIs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {perUser.map((r) => {
                    const t = tierFor(r.composite_score);
                    return (
                      <TableRow key={r.user_id}>
                        <TableCell className="font-medium">{emails[r.user_id] ?? r.user_id.slice(0, 8)}</TableCell>
                        <TableCell className="capitalize">{r.role_tag.replace(/_/g, " ")}</TableCell>
                        <TableCell>{r.composite_score ?? "—"}{r.composite_score != null ? "%" : ""}</TableCell>
                        <TableCell><Badge variant="outline" className={t.className}>{t.label}</Badge></TableCell>
                        <TableCell>
                          <span className="text-emerald-700">{r.green_count}</span>{" / "}
                          <span className="text-amber-700">{r.yellow_count}</span>{" / "}
                          <span className="text-red-600">{r.red_count}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
