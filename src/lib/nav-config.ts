import { UserRole } from "@/types/common/enum";

export interface NavItem {
  title: string;
  url: string;
  icon?: any;
  isActive?: boolean;
  disabled?: boolean;
  children?: NavItem[];
  items?: NavItem[];
  roles: UserRole[];
}

export const getRoleBasedNavItems = (userRole: UserRole): NavItem[] => {
  // Define all navigation items with role permissions
  const allNavItems: NavItem[] = [
    {
      title: "Take Test",
      url: "/take-test",
      roles: [UserRole.EMPLOYEE],
    },
    {
      title: "User Tests",
      url: "/user-tests",
      roles: [UserRole.EMPLOYEE],
    },
    {
      title: "Assessment center",
      url: "/",
      roles: [UserRole.SUPER_ADMIN],
      items: [
        {
          title: "Instrument Creation",
          url: "/test",
          disabled: false,
          roles: [UserRole.SUPER_ADMIN],
        },
        {
          title: "Battery Calibration",
          url: "/",
          disabled: true,
          roles: [UserRole.SUPER_ADMIN],
        },
      ],
    },
    {
      title: "Evaluation Result",
      url: "/result",
      roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN],
    },
    {
      title: "Battery",
      url: "/battery",
      roles: [UserRole.SUPER_ADMIN],
    },
    {
      title: "Company Management",
      url: "/company-management",
      roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN],
      items: [
        {
          title: "Companies",
          url: "/company-management/companies",
          disabled: false,
          roles: [UserRole.SUPER_ADMIN],
        },
        {
          title: "Users",
          url: "/company-management/users",
          disabled: false,
          roles: [UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN],
        },
        {
          title: "Groups",
          url: "/company-management/groups",
          disabled: false,
          roles: [UserRole.SUPER_ADMIN],
        },
      ],
    },
  ];

  // Filter items based on user role
  const filterItems = (items: NavItem[]): NavItem[] => {
    return items
      .filter(item => item.roles.includes(userRole))
      .map(item => {
        if (item.items) {
          return {
            ...item,
            items: filterItems(item.items)
          };
        }
        if (item.children) {
          return {
            ...item,
            children: filterItems(item.children)
          };
        }
        return item;
      });
  };

  return filterItems(allNavItems);
};