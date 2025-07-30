"use client";

// next
import Link from "next/link";

// icons
import {
  ChevronLeft,
  CircleUserRound,
  CreditCard,
  LoaderCircle,
} from "lucide-react";

// components
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SettingsSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="default" variant="default" asChild>
              <Link href="/">
                <ChevronLeft />
                Back to app
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="default" variant="default">
                <Link href="/settings/profile">
                  <CircleUserRound />
                  Profile
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="default" variant="default">
                <Link href="/settings/subscription">
                  <CreditCard />
                  Subscription
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="default" variant="default">
                <Link href="/settings/usage">
                  <LoaderCircle />
                  Usage
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
