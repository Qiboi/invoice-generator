"use client"

import * as React from "react"
import {
  IconFileInvoice,
  IconReceipt,
  IconLayoutDashboard,
  IconBuildingStore,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "Admin",
    email: "admin@gmail.com",
    avatar: "/avatars/user.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
    },
    {
      title: "Invoice",
      url: "/dashboard/invoices",
      icon: IconFileInvoice,
    },
    {
      title: "Receipt",
      url: "/dashboard/receipts",
      icon: IconReceipt,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>

      {/* HEADER / LOGO */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <IconBuildingStore className="size-5" />
                <span className="text-base font-semibold">
                  Invoice System
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* MENU */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* USER */}
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}