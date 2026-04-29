// Resell-create-client — Super Admin / Reseller provisions a downstream tenant org + owner user.
// Enforces 6-month reseller lock and super_admin / admin role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CreateResellClientBody {
  organization_name: string;
  admin_email: string;
  admin_full_name?: string;
  subscription_tier?: string;
  country?: string;
  operating_model?: "haulage" | "multidrop" | "hybrid";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ success: false, error: "Missing authorization" }, 401);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !userData?.user) {
      return json({ success: false, error: "Invalid token" }, 401);
    }
    const callerId = userData.user.id;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Caller must be super_admin or admin
    const { data: callerRoles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId);
    const roles = (callerRoles ?? []).map((r: any) => r.role);
    if (!roles.some((r: string) => ["super_admin", "admin"].includes(r))) {
      return json({ success: false, error: "Only super_admin or admin can resell" }, 403);
    }

    // Reseller-lock: caller's parent org must be > 6 months old
    const { data: callerMembership } = await admin
      .from("organization_members")
      .select("organization_id")
      .eq("user_id", callerId)
      .eq("is_active", true)
      .maybeSingle();

    if (callerMembership?.organization_id) {
      const { data: parentOrg } = await admin
        .from("organizations")
        .select("reseller_lock_until, created_at")
        .eq("id", callerMembership.organization_id)
        .single();

      if (parentOrg) {
        const lockDate = parentOrg.reseller_lock_until
          ? new Date(parentOrg.reseller_lock_until)
          : (() => {
              const d = new Date(parentOrg.created_at);
              d.setMonth(d.getMonth() + 6);
              return d;
            })();
        if (new Date() < lockDate && !roles.includes("super_admin")) {
          return json(
            {
              success: false,
              error: "Reseller features locked until 6 months after org creation",
              lock_expires_at: lockDate.toISOString(),
            },
            403
          );
        }
      }
    }

    const body = (await req.json()) as CreateResellClientBody;
    const orgName = (body.organization_name || "").trim();
    const adminEmail = (body.admin_email || "").trim().toLowerCase();
    if (!orgName || !adminEmail.includes("@")) {
      return json({ success: false, error: "organization_name and admin_email required" }, 400);
    }

    // 1. Create downstream organization
    const { data: newOrg, error: orgErr } = await admin
      .from("organizations")
      .insert({
        name: orgName,
        subscription_tier: (body.subscription_tier ?? "starter") as any,
      })
      .select()
      .single();

    if (orgErr || !newOrg) {
      return json({ success: false, error: orgErr?.message ?? "Org creation failed" }, 400);
    }

    // 2. Create owner auth user
    const tempPassword = crypto.randomUUID() + "!Aa1";
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: adminEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: body.admin_full_name ?? adminEmail },
    });

    if (createErr || !created.user) {
      // Rollback org
      await admin.from("organizations").delete().eq("id", newOrg.id);
      return json({ success: false, error: createErr?.message ?? "User creation failed" }, 400);
    }
    const newUserId = created.user.id;

    // 3. Assign org_admin role + ownership
    await admin.from("user_roles").insert({ user_id: newUserId, role: "org_admin" });
    await admin.from("organization_members").insert({
      user_id: newUserId,
      organization_id: newOrg.id,
      is_active: true,
      is_owner: true,
    });

    // 4. Audit
    await admin.from("audit_logs").insert({
      action: "resell_client_created",
      table_name: "organizations",
      record_id: newOrg.id,
      user_id: callerId,
      user_email: userData.user.email,
      new_data: {
        organization_id: newOrg.id,
        organization_name: orgName,
        owner_email: adminEmail,
        owner_user_id: newUserId,
      },
    });

    return json({
      success: true,
      organization_id: newOrg.id,
      organization_name: orgName,
      owner: {
        user_id: newUserId,
        email: adminEmail,
        temp_password: tempPassword,
      },
    });
  } catch (err) {
    console.error("resell-create-client error", err);
    return json({ success: false, error: String(err?.message ?? err) }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
