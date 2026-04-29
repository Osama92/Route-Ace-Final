import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (d: unknown, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return json({ error: "Unauthorized" }, 401);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const url = new URL(req.url);
    const route = url.searchParams.get("route") || "/list";

    if (route === "/list") {
      const { data } = await supabase.from("monopoly_strategies").select("*").order("dominance_score", { ascending: false }).limit(20);
      return json({ strategies: data || [] });
    }

    if (route === "/generate" && req.method === "POST") {
      const { region } = await req.json().catch(() => ({ region: "Lagos" }));
      const [{ count: customerCount }, { count: vehicleCount }] = await Promise.all([
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("vehicles").select("id", { count: "exact", head: true }),
      ]);

      const dominance = Math.min(100, Math.round((customerCount || 0) * 2 + (vehicleCount || 0) * 0.5));

      const { data: ins } = await supabase.from("monopoly_strategies").insert({
        user_id: user.id,
        market_region: region,
        total_market_value: 420_000_000_000,
        market_players_count: 18400,
        priority_targets: [
          { tier: 1, segment: "FMCG Top 10", reason: "High dispatch volume, recurring demand", est_revenue: 50_000_000 },
          { tier: 2, segment: "3PL Mid-tier (20-50 trucks)", reason: "Operational pain, fast adoption", est_revenue: 18_000_000 },
          { tier: 3, segment: "Distributor networks", reason: "Network effect via downstream forcing", est_revenue: 12_000_000 },
        ],
        lock_in_strategies: [
          { tactic: "Workflow embedding", description: "Integrate dispatch + finance + insurance — high switching cost" },
          { tactic: "Data dependency", description: "Historical trip data, fuel baselines locked into Routeace ledger" },
          { tactic: "Vendor network lock", description: "Customer's vendors transact only via Routeace marketplace" },
        ],
        network_expansion: [
          { from: "Anchor FMCG", to: "32 distributors", method: "Forced downstream adoption via tracking links" },
          { from: "Top 3PL", to: "120 sub-contracted trucks", method: "Mandatory Routeace dispatch onboarding" },
        ],
        competitor_displacement: [
          { competitor: "FleetTrack", weakness: "No finance / fuel fraud intelligence", attack: "Lead with cost savings pitch, gradual replacement via 14-day pilot" },
          { competitor: "Generic GPS vendors", weakness: "Hardware-only, no AI layer", attack: "Bundle AI + telematics at lower TCO" },
        ],
        dominance_score: dominance,
      }).select("id").single();

      return json({ success: true, id: ins?.id, dominance });
    }

    if (route === "/decide" && req.method === "POST") {
      const { id, decision } = await req.json();
      const status = decision === "approve" ? "active" : "rejected";
      await supabase.from("monopoly_strategies").update({ status, approved_by: user.id }).eq("id", id);
      return json({ success: true });
    }

    return json({ error: "Unknown route" }, 404);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
