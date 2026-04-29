import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAuditLog from "@/hooks/useAuditLog";
import PendingApprovalScreen from "./PendingApprovalScreen";
import SuspendedAccountScreen from "./SuspendedAccountScreen";
import AccessDeniedModal from "./AccessDeniedModal";
import { AlertTriangle } from "lucide-react";

const LOADING_TIMEOUT_MS = 12000; // 12 seconds max before we bail out of spinner

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "operations" | "support" | "dispatcher" | "driver" | "super_admin" | "org_admin" | "ops_manager" | "finance_manager" | "customer" | "internal_team" | "core_founder" | "core_builder" | "core_product" | "core_engineer")[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, userRole, loading, isApproved, approvalStatus, suspensionReason, isSuperAdmin } = useAuth();
  const location = useLocation();
  const { logAccessDenied } = useAuditLog();
  const hasLoggedDenial = useRef(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [loadingTimedOut, setLoadingTimedOut] = useState(false);

  // CRITICAL: Super Admin bypasses ALL role restrictions
  const isSuperAdminBypass = userRole === "super_admin";

  // Check if access should be denied based on role (but NOT for Super Admin)
  const isAccessDenied = !loading && user && isApproved && 
    allowedRoles && allowedRoles.length > 0 && 
    userRole && !allowedRoles.includes(userRole) && !isSuperAdminBypass;

  // Spinner timeout failsafe — never allow infinite loading
  useEffect(() => {
    if (!loading) {
      setLoadingTimedOut(false);
      return;
    }
    const timer = setTimeout(() => {
      console.warn("[ProtectedRoute] Loading timed out — forcing redirect to /auth");
      setLoadingTimedOut(true);
    }, LOADING_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loading]);

  // Log access denial (once per route)
  useEffect(() => {
    if (isAccessDenied && !hasLoggedDenial.current) {
      hasLoggedDenial.current = true;
      logAccessDenied({
        attempted_route: location.pathname,
        user_role: userRole || "unknown",
        allowed_roles: allowedRoles || [],
      });
      // Show modal instead of dead-end page
      setShowAccessDeniedModal(true);
    }
  }, [isAccessDenied, location.pathname, userRole, allowedRoles, logAccessDenied]);

  // Reset logging flag when route changes
  useEffect(() => {
    hasLoggedDenial.current = false;
    setShowAccessDeniedModal(false);
  }, [location.pathname]);

  // Spinner timed out — redirect to auth rather than spinning forever
  if (loadingTimedOut) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check approval status
  if (approvalStatus === "pending") {
    return <PendingApprovalScreen />;
  }

  if (approvalStatus === "suspended") {
    return <SuspendedAccountScreen reason={suspensionReason || undefined} />;
  }

  if (approvalStatus === "rejected") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Registration Rejected</h2>
          <p className="text-muted-foreground mb-4">
            Your registration request was not approved. Please contact an administrator for more information.
          </p>
        </div>
      </div>
    );
  }

  // Only check roles if user is approved
  if (!isApproved) {
    return <PendingApprovalScreen />;
  }

  // SUPER ADMIN BYPASS: Allow access to everything
  if (isSuperAdminBypass) {
    return <>{children}</>;
  }

  // Show AccessDeniedModal instead of dead-end page
  if (isAccessDenied) {
    return (
      <>
        <AccessDeniedModal
          isOpen={showAccessDeniedModal}
          onClose={() => setShowAccessDeniedModal(false)}
          requiredRoles={allowedRoles}
          currentRole={userRole}
          attemptedRoute={location.pathname}
        />
        {/* Show empty state behind modal */}
        <div className="min-h-screen bg-background" />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
