import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";
import { OnboardingTeleprompter } from "@/components/guidance/OnboardingTeleprompter";
import AICoach from "@/components/guidance/AICoach";
import UniversalCommandBar from "@/components/command/UniversalCommandBar";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="w-[280px] h-screen bg-sidebar border-r border-sidebar-border p-4 shrink-0 flex flex-col gap-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <div className="space-y-2 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton className="h-16 w-full rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[280px] transition-all duration-300">
        <Header title={title} subtitle={subtitle} />
        <Breadcrumbs />
        <div className="p-8">{children}</div>
      </main>
      <UniversalCommandBar />
      <OnboardingTeleprompter />
      <AICoach />
    </div>
  );
};

export default DashboardLayout;
