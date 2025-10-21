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
      title: "Take Test",
      url: "/take-test",
    },
    {
      title: "User Tests",
      url: "/user-tests",
    },
    {
      title: "Assessment center",
      url: "/",
      items: [
        {
          title: "Instrument Creation",
          url: "/test",
          disabled: false,
        },
        {
          title: "Battery Calibration",
          url: "/",
          disabled: true,
        },
      ],
    },
    {
      title: "Evaluation Result",
      url: "/result",
    },
    {
      title: "Battery",
      url: "/battery",
    },
    {
      title: "Company Management",
      url: "/company-management",
      items: [
        {
          title: "Companies",
          url: "/company-management/companies",
          disabled: false,
        },
        {
          title: "Users",
          url: "/company-management/users",
          disabled: false,
        },
        {
          title: "Groups",
          url: "/company-management/groups",
          disabled: false,
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
