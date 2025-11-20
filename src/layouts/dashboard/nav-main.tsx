"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types/common/enum";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  disabled?: boolean;
  children?: NavItem[];
  items?: NavItem[];
  roles?: UserRole[]; 
};

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            const hasChildren = item.items && item.items.length > 0;
            const baseClasses =
              "flex items-center gap-2 w-full rounded-md px-3 py-2 h-10 text-sm font-medium transition-colors";
            const hoverClasses = "hover:bg-[#f66c84] hover:text-white";
            const activeClasses = "bg-[#f66c84] text-white";
            const isAnyChildActive = item.items?.some(
              (child) => pathname === child.url
            );
            const shouldHighlight = isActive || isAnyChildActive;

            if (hasChildren) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(baseClasses, hoverClasses, {
                          [activeClasses]: shouldHighlight,
                        })}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const isSubActive = pathname === subItem.url;

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                aria-disabled={subItem?.disabled}
                                className={cn(
                                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                                  isSubActive
                                    ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white"
                                    : "hover:bg-gray-200 dark:hover:bg-gray-900"
                                )}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(baseClasses, hoverClasses, {
                    [activeClasses]: shouldHighlight,
                  })}
                >
                  <Link
                    href={item.url}
                    className="flex w-full items-center gap-2"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}