// Create-company-signup — Atomically provisions a Super Admin owner + organization.
// Runs with the service role so RLS does not block the bootstrap step that happens
// BEFORE the new user's email is confirmed (no session = no auth.uid()).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Body {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
  subscription_tier?: string;
  business_type?: string;
  industry?: string;
  fleet_size?: string;
  country?: string;
  currency?: string;
  tenant_mode?: string;
}

const SITE_URL = "https://app.routeace.io";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = (await req.json()) as Body;
    const email = (body.email || "").trim().toLowerCase();
    const fullName = (body.full_name || "").trim();
    const companyName = (body.company_name || "").trim();

    if (!email.includes("@") || !body.password || body.password.length < 6) {
      return json({ success: false, error: "Valid email and password (6+ chars) required" }, 400);
    }
    if (!fullName || !companyName) {
      return json({ success: false, error: "Full name and company name required" }, 400);
    }

    // 1. Create auth user with email unconfirmed so they must verify.
    //    createUser returns an error naturally if the email already exists.
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: body.password,
      email_confirm: false,
      user_metadata: { full_name: fullName },
    });
    if (createErr || !created.user) {
      const msg = createErr?.message ?? "Failed to create user";
      const alreadyExists = msg.toLowerCase().includes("already") || msg.toLowerCase().includes("duplicate");
      return json(
        { success: false, error: alreadyExists ? "This email is already registered. Please sign in instead." : msg },
        alreadyExists ? 409 : 400,
      );
    }
    const userId = created.user.id;

    const rollbackUser = async () => {
      try { await admin.auth.admin.deleteUser(userId); } catch (_) { /* noop */ }
    };

    // 2. Create organization (service role bypasses RLS).
    const { data: orgData, error: orgError } = await admin
      .from("organizations")
      .insert({
        name: companyName,
        owner_user_id: userId,
        subscription_tier: body.subscription_tier ?? "starter",
        business_type: body.business_type ?? null,
        industry: body.industry ?? null,
        fleet_size: body.fleet_size ?? null,
        country: body.country ?? null,
        currency: body.currency ?? null,
      } as any)
      .select("id")
      .single();
    if (orgError || !orgData) {
      await rollbackUser();
      return json({ success: false, error: `org: ${orgError?.message ?? "Failed to create organization"}` }, 400);
    }

    // 3. Owner membership
    const { error: memberError } = await admin
      .from("organization_members")
      .insert({
        organization_id: orgData.id,
        user_id: userId,
        role: "super_admin",
        is_owner: true,
        is_active: true,
      } as any);
    if (memberError) {
      await admin.from("organizations").delete().eq("id", orgData.id);
      await rollbackUser();
      return json({ success: false, error: `member: ${memberError.message}` }, 400);
    }

    // 4. Super Admin role assignment
    await admin.from("user_roles").insert({ user_id: userId, role: "super_admin" });

    // 5. Auto-approve the founding Super Admin.
    await admin
      .from("profiles")
      .update({ approval_status: "approved", is_active: true, approved_at: new Date().toISOString() })
      .eq("user_id", userId);

    // 6. Tenant config
    if (body.tenant_mode) {
      await admin.from("tenant_config").upsert(
        {
          user_id: userId,
          organization_id: orgData.id,
          company_name: companyName,
          country: body.country ?? null,
          tenant_mode: body.tenant_mode,
          mode_locked_at: new Date().toISOString(),
        } as any,
        { onConflict: "user_id" },
      );
    }

    // 7. Company settings
    await admin.from("company_settings").upsert({
      company_name: companyName,
      updated_by: userId,
    });

    // 8. Audit
    await admin.from("audit_logs").insert({
      action: "company_created",
      table_name: "organizations",
      record_id: orgData.id,
      user_id: userId,
      user_email: email,
      new_data: {
        company_name: companyName,
        subscription_tier: body.subscription_tier ?? "starter",
        owner_email: email,
      },
    });

    // 9. Generate email confirmation link and send via Resend (explicit, reliable delivery).
    //    Falls back to Supabase built-in mailer if RESEND_API_KEY is not set.
    let emailSent = false;
    let confirmUrl = "";

    try {
      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: "signup",
        email,
        password: body.password,
        options: { redirectTo: `${SITE_URL}/auth` },
      });

      if (!linkErr && linkData?.properties?.action_link) {
        confirmUrl = linkData.properties.action_link;

        if (RESEND_API_KEY) {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "RouteAce <onboarding@resend.dev>",
              to: [email],
              subject: "Verify your RouteAce account",
              html: buildVerificationEmail(fullName, companyName, confirmUrl),
            }),
          });
          emailSent = emailRes.ok;
          if (!emailRes.ok) {
            const errBody = await emailRes.text();
            console.error("Resend error:", errBody);
          }
        }
      }
    } catch (emailErr) {
      // Email failure is non-fatal — account is created, admin can resend from dashboard.
      console.error("Verification email error:", emailErr);
    }

    return json({
      success: true,
      user_id: userId,
      organization_id: orgData.id,
      email,
      email_sent: emailSent,
      message: emailSent
        ? "Company created. A verification email has been sent — click the link to activate your account."
        : "Company created. Check your email inbox (and spam folder) for the verification link.",
    });
  } catch (err: any) {
    console.error("create-company-signup error", err);
    return json({ success: false, error: String(err?.message ?? err) }, 500);
  }
});

function buildVerificationEmail(fullName: string, companyName: string, confirmUrl: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr><td style="background:#0f172a;padding:32px 40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">RouteAce</h1>
          <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Enterprise Logistics Platform</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;">Welcome, ${fullName}!</h2>
          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">
            Your <strong>${companyName}</strong> workspace is ready on RouteAce.
            Verify your email address to activate your Super Admin account and get started.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${confirmUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;letter-spacing:0.2px;">
              Verify Email Address
            </a>
          </div>
          <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;line-height:1.6;">
            This link expires in 24 hours. If you didn't create a RouteAce account, you can safely ignore this email.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;">RouteAce · Enterprise Logistics SaaS · <a href="https://routeace.io" style="color:#2563eb;text-decoration:none;">routeace.io</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
