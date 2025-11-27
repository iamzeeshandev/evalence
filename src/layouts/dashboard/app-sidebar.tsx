import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { VersionSwitcher } from "./version-switcher";
import { useAuth } from "@/lib/auth";
import { getRoleBasedNavItems } from "@/lib/nav-config";
import { UserRole } from "@/types/common/enum";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { authData } = useAuth();
  const userRole = authData.user?.role as UserRole;
  
  // Generate navigation items based on user role
  const navItems = userRole ? getRoleBasedNavItems(userRole) : [];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={["1.0.1", "1.1.0-alpha", "2.0.0-beta1"]}
          defaultVersion="1.0.1"
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}