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
      const { data } = await supabase.from("partnership_opportunities").select("*").order("match_score", { ascending: false }).limit(50);
      return json({ opportunities: data || [] });
    }

    if (route === "/match" && req.method === "POST") {
      // Generate FMCG ↔ 3PL matches from ecosystem nodes
      const { data: nodes } = await supabase.from("ecosystem_nodes").select("*").eq("is_active", true);
      const fmcg = (nodes || []).filter((n) => n.node_type === "fmcg" || n.category === "shipper");
      const fleets = (nodes || []).filter((n) => n.node_type === "3pl" || n.category === "fleet_partner");
      const created: string[] = [];

      for (const shipper of fmcg.slice(0, 5)) {
        for (const fleet of fleets.slice(0, 3)) {
          const score = Math.round((shipper.trust_score + fleet.trust_score) / 2);
          const { data: ins } = await supabase.from("partnership_opportunities").insert({
            user_id: user.id,
            partner_name: `${shipper.name} ↔ ${fleet.name}`,
            partner_type: "shipper_fleet_match",
            match_score: score,
            match_reason: `${shipper.name} (${shipper.region || "Nigeria"}) shipping demand aligns with ${fleet.name}'s ${(fleet.capabilities || []).join(", ")} capacity. Combined trust score ${score}/100.`,
            shipper_id: shipper.id,
            fleet_operator_id: fleet.id,
            route_context: `${shipper.region || "Lagos"} → distribution network`,
            estimated_revenue: Math.round(2000000 + Math.random() * 8000000),
            cost_savings: Math.round(500000 + Math.random() * 2000000),
            proposal_text: `We can connect ${shipper.name}'s distribution demand with ${fleet.name}'s verified fleet on Routeace. Estimated 18% cost reduction and 25% faster delivery cycles.`,
          }).select("id").single();
          if (ins) created.push(ins.id);
        }
      }
      return json({ success: true, created: created.length });
    }

    if (route === "/decide" && req.method === "POST") {
      const { id, decision } = await req.json();
      const status = decision === "approve" ? "accepted" : "rejected";
      await supabase.from("partnership_opportunities").update({ status, approved_by: user.id }).eq("id", id);
      return json({ success: true });
    }

    return json({ error: "Unknown route" }, 404);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
