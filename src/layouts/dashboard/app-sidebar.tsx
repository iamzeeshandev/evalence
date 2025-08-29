import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { VersionSwitcher } from "./version-switcher";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  user: {
    name: "Abu Bakar",
    email: "abubakar@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      title: "Test",
      url: "/test",
    },
    {
      title: "Test Assignments",
      url: "/test-assignment",
    },
    {
      title: "Users",
      url: "/user",
    },
    {
      title: "Company",
      url: "/company",
    },
    {
      title: "Nested",
      url: "/nested",
      items: [
        {
          title: "Sub Item 1",
          url: "/nested/sub-item-1",
        },
        {
          title: "Sub Item 2",
          url: "/nested/sub-item-2",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
