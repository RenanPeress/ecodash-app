import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { getStoredSidebarCollapsed, setStoredSidebarCollapsed } from "@/lib/sidebar-storage";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
  mainClassName?: string;
}

export function DashboardLayout({ children, mainClassName }: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getStoredSidebarCollapsed);

  function handleSidebarCollapsedChange(collapsed: boolean) {
    setSidebarCollapsed(collapsed);
    setStoredSidebarCollapsed(collapsed);
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={handleSidebarCollapsedChange}
        mobileNavOpen={mobileNavOpen}
        onMobileNavOpenChange={setMobileNavOpen}
      />
      <div
        className={cn(
          "min-w-0 transition-[margin] duration-300 ease-in-out",
          sidebarCollapsed ? "md:ml-[4.5rem]" : "md:ml-64",
        )}
      >
        <Topbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className={mainClassName ?? "space-y-4 p-4 sm:space-y-6 sm:p-6 lg:p-8"}>{children}</main>
      </div>
    </div>
  );
}
