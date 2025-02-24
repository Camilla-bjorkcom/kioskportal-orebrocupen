import { SquareChartGantt, ChartSpline, Bell, Trophy } from "lucide-react";

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
import logo from "@/assets/images/tempLogo.svg";
import { useState } from "react";

// Menu items.

export function AppSidebar({ id }: { id?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };
  const items = [
    {
      title: "Turnering",
      url: "#",
      icon: Trophy,
      subitems: [
        { title: "Din översikt", url: `/dashboard/${id}` },

        { title: "Anläggningshantering", url: `/facilitiesandkiosks/${id}` },

        { title: "Produkthantering", url: `/producthandler/${id}` },
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
      title: "Statistik",
      url: "#",
      icon: ChartSpline,
      subitems: [
        {
          title: "Kioskinventeringar",
          url: `/inventorystatus/${id}`,
        },
        {
          title: "Lagerinventeringar",
          url: `/inventorystatusstorage/${id}`,
        },
        {
          title: "Inventeringsöversikt",
          url: `/overviewinventories/${id}`,
        },
      ],
    },
    {
      title: "Notiser",
      url: "#",
      icon: Bell,
      subitems: [{ title: "Skicka notiser", url: `/inventorystatus/${id}` }],
    },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="dark:bg-slate-800">
      <SidebarContent>
        <SidebarHeader>
          <div className="flex gap-2">
            {!isCollapsed && (
              <button
                onClick={() => (window.location.href = `/dashboard/${id}`)}
              >
                <img src={logo} alt="kiosk portal logo" className=" " />
              </button>
            )}
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Meny</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="font-bold hover:bg-none mb-2 "
                >
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2 ">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>

                  {item.subitems && (
                    <SidebarMenuSub className="border-white/50">
                      {item.subitems.map((subitem) => (
                        <SidebarMenuSubItem key={subitem.title}>
                          <a
                            href={subitem.url}
                            className="w-full flex font-medium hover:bg-gray-100 dark:hover:bg-slate-600 p-2  rounded"
                          >
                            {subitem.title}
                          </a>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                  {/* <div className="w-full h-px bg-white"></div> */}
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
