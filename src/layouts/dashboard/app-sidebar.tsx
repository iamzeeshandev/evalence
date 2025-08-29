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
      title: "Evaluation Form",
      url: "/test",
    },
    {
      title: "Assessment Result",
      url: "/result",
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
