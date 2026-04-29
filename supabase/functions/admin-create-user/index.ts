// Admin-create-user — Super Admin / Org Admin provisions a new user with role + org membership.
// Validates caller role server-side; never trusts client claims.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const VALID_ROLES = [
  "super_admin",
  "admin",
  "org_admin",
  "ops_manager",
  "finance_manager",
  "support",
  "viewer",
];

interface CreateUserBody {
  email: string;
  password?: string;
  full_name?: string;
  role: string;
  organization_id?: string;
  send_invite?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ success: false, error: "Missing authorization header" }, 401);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Caller client (verifies JWT)
    const callerClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await callerClient.auth.getUser();
    if (userErr || !userData?.user) {
      return json({ success: false, error: "Invalid auth token" }, 401);
    }
    const callerId = userData.user.id;

    // Admin client (service role) for verification + creation
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Verify caller role
    const { data: callerRoles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId);

    const roles = (callerRoles ?? []).map((r: any) => r.role);
    const isPrivileged = roles.some((r: string) =>
      ["super_admin", "admin", "org_admin"].includes(r)
    );
    if (!isPrivileged) {
      return json({ success: false, error: "Insufficient privileges" }, 403);
    }

    const body = (await req.json()) as CreateUserBody;
    const email = (body.email || "").trim().toLowerCase();
    const role = body.role;

    if (!email || !email.includes("@")) {
      return json({ success: false, error: "Valid email required" }, 400);
    }
    if (!VALID_ROLES.includes(role)) {
      return json({ success: false, error: `Invalid role. Allowed: ${VALID_ROLES.join(", ")}` }, 400);
    }
    // Only super_admin can create another super_admin
    if (role === "super_admin" && !roles.includes("super_admin")) {
      return json({ success: false, error: "Only super_admin can create super_admin" }, 403);
    }

    // Resolve organization_id: use caller's org if not supplied
    let organizationId = body.organization_id;
    if (!organizationId) {
      const { data: callerOrg } = await admin
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", callerId)
        .eq("is_active", true)
        .maybeSingle();
      organizationId = callerOrg?.organization_id;
    }

    // Create the auth user
    const password = body.password ?? crypto.randomUUID() + "!Aa1";
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: body.full_name ?? email },
    });

    if (createErr || !created.user) {
      return json({ success: false, error: createErr?.message ?? "User creation failed" }, 400);
    }
    const newUserId = created.user.id;

    // Assign role
    const { error: roleErr } = await admin
      .from("user_roles")
      .insert({ user_id: newUserId, role });
    if (roleErr && !roleErr.message.includes("duplicate")) {
      return json({ success: false, error: `Role assignment failed: ${roleErr.message}` }, 400);
    }

    // Add to organization
    if (organizationId) {
      await admin.from("organization_members").insert({
        user_id: newUserId,
        organization_id: organizationId,
        is_active: true,
        is_owner: false,
      });
    }

    // Audit log
    await admin.from("audit_logs").insert({
      action: "user_created",
      table_name: "auth.users",
      record_id: newUserId,
      user_id: callerId,
      user_email: userData.user.email,
      new_data: { email, role, organization_id: organizationId },
    });

    return json({
      success: true,
      user_id: newUserId,
      email,
      role,
      organization_id: organizationId,
      temp_password: body.password ? undefined : password,
    });
  } catch (err) {
    console.error("admin-create-user error", err);
    return json({ success: false, error: String(err?.message ?? err) }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
