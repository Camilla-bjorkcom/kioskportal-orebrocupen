import {
  CircleUserRound,
  Hammer,
  SquareChartGantt,
  Settings,
  ChevronDown,
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
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Menu items.
const items = [
  {
    title: "Profil",
    url: "#",
    icon: CircleUserRound,
    subitems: [{ icon: Settings, title: "Inställningar", url: "#" }],
  },
  {
    title: "Verktyg",
    url: "#",
    icon: Hammer,
    subitems: [
      { title: "Din översikt", url: "/dashboard" },
      { title: "Produktlista", url: "#" },
      { title: "Planstruktur", url: "#" },
      { title: "Produkthanterare", url: "#" },
    ],
  },
  {
    title: "Inventering",
    url: "#",
    icon: SquareChartGantt,
    subitems: [
        { title: "Visa saldo för kiosk", url: "#" },
        { title: "Visa saldo för anläggning", url: "#" }
    ],
    
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
            <img src="src/assets/images/tempLogo.svg" alt="kiosk porta logo" />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Meny</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen
                  className="group/collapsible"
                >
                  <SidebarMenuItem className="font-bold">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </a>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {/* Subitems */}
                    {item.subitems && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subitems.map((subitem) => (
                            <SidebarMenuSubItem
                              className="font-medium hover:bg-neutral-100"
                              key={subitem.title}
                            >
                              <a href={subitem.url}>{subitem.title}</a>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
