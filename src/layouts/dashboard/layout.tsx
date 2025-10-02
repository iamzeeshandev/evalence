"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "./app-sidebar";

export type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const {
    authData: { user: loggedUser },
    logout,
    isAuthenticated,
  } = useAuth();

  const handleLogout = () => {
    router.push("/auth/sign-in");
    logout();
  };

  const authenticated = localStorage?.getItem("evalence_user")
    ? JSON.parse(localStorage.getItem("evalence_user")!)?.accessToken
    : false;

  if (!authenticated) {
    handleLogout();
  }

  return (
    <>
      {!isAuthenticated ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src="/avatar.png"
                        alt={`${loggedUser?.firstName} ${loggedUser?.lastName}`}
                      />
                      <AvatarFallback>
                        {`${loggedUser?.firstName} ${loggedUser?.lastName}`
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-medium">{`${loggedUser?.firstName} ${loggedUser?.lastName}`}</span>
                      <span className="text-xs text-muted-foreground">
                        {loggedUser?.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex-1">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
