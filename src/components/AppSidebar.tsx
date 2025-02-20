import { useAuth } from "react-oidc-context";
import {
  SquareChartGantt,
  ChartSpline,
  LogOut,
  BadgeCheck,
  BookHeart,
  Bell,
  Trophy,
  ChevronsLeftRight,
  ChevronsUpDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useIsMobile } from "@/hooks/use-mobile";

import { useState } from "react";

// Menu items.

export function AppSidebar({ id }: { id?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };
  const items = [
    {
      title: "Turneringsförberedelser",
      url: "#",
      icon: Trophy,
      subitems: [
        { title: "1. Produkthantering", url: `/producthandler/${id}` },

        { title: "2. Anläggningshantering", url: `/facilitiesandkiosks/${id}` },
      ],
    },

    {
      title: "Inventering",
      url: "#",
      icon: SquareChartGantt,
      subitems: [
        { title: "Inventera huvudlager", url: `/inventorystorage/${id}` },

        { title: "QR koder till kiosker", url: `/facilitiesandkiosks/${id}` },
      ],
    },
    {
      title: "Notiser",
      url: "#",
      icon: Bell,
      subitems: [{ title: "Skicka notiser", url: `/inventorystatus/${id}` }],
    },
    {
      title: "Statistik",
      url: "#",
      icon: ChartSpline,
      subitems: [
        {
          title: "Visa kioskernas inventeringar",
          url: `/inventorystatus/${id}`,
        },
        {
          title: "Visa huvudlagrets inventeringar",
          url: `/inventorystatusstorage/${id}`,
        },
        {
          title: "Visa översikt av turneringens produkter",
          url: `/overviewinventories/${id}`,
        },
      ],
    },
  ];

  // { title: "Din översikt", url: `/dashboard/${id}` },
  const auth = useAuth();
  const isMobile = useIsMobile();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="dark:bg-slate-800">
      <SidebarContent>
        <SidebarHeader>
          <div className="flex gap-2">
            {/* Logotypen som döljs när isCollapsed är true */}
            {!isCollapsed && (
              <button
                onClick={() => (window.location.href = `/dashboard/${id}`)}
              >
                <img
                  src="../src/assets/images/sidebarLogo.svg"
                  alt="kiosk portal logo"
                  className="transition-all duration-300"
                />
              </button>
            )}
            <SidebarTrigger onClick={toggleSidebar} />
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Meny</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="font-bold hover:bg-none"
                >
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2 ">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>

                  {/* Subitems */}
                  {item.subitems && (
                    <SidebarMenuSub>
                      {item.subitems.map((subitem) => (
                        <SidebarMenuSubItem
                          key={subitem.title}
                          className="font-medium hover:bg-gray-100 dark:hover:bg-slate-600 w-full"
                        >
                          <a href={subitem.url} className="w-full flex">
                            {subitem.title}
                          </a>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
