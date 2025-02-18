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
  SidebarFooter,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

// Menu items.

export function AppSidebar({ id }: { id?: string }) {
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
        {
          title: "Visa kioskernas inventeringar",
          url: `/inventorystatus/${id}`,
        },
        {
          title: "Visa huvudlagrets inventeringar",
          url: `/inventorystatusstorage/${id}`,
        },
        { title: "QR koder till kiosker", url: `/facilitiesandkiosks/${id}` },
        {
          title: "Översikt av turneringens lager",
          url: `/overViewinventories/${id}`,
        },
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
      subitems: [{ title: "Din översikt", url: `/dashboard/${id}` }],
    },
  ];
  const auth = useAuth();
  const isMobile = useIsMobile();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="dark:bg-slate-800">
      <SidebarContent>
        <SidebarHeader>
          <button onClick={() => (window.location.href = `/dashboard/${id}`)}>
            <img
              src="../src/assets/images/sidebarLogo.svg"
              alt="kiosk portal logo"
            />
          </button>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-slate-600 dark:data-[state=open]:bg-slate-600"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={"user.avatar"} alt={"username"} />
                    <AvatarFallback className="rounded-lg bg-amber-500 font-bold">
                      KP
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs">
                      {" "}
                      {auth.user?.profile["cognito:username"] as string}
                    </span>
                  </div>
                  {isMobile ? (
                    <ChevronsUpDown className="ml-auto size-4" />
                  ) : (
                    <ChevronsLeftRight className="ml-auto size-4" />
                  )}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-slate-800  "
                align="end"
                sideOffset={4}
                side={useIsMobile() ? "top" : "right"}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={"user.avatar"} alt={"username"} />
                      <AvatarFallback className="rounded-lg bg-amber-500 font-bold">
                        KP
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-xs">
                        {auth.user?.profile["cognito:username"] as string}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup></DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="dark:hover:bg-slate-600">
                    <BookHeart />
                    <a href="/tournaments" className="w-full flex ">
                      Mina turneringar
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:hover:bg-slate-600">
                    <BadgeCheck />
                    <a href={`/settings/${id}`} className="w-full flex">
                      Inställningar
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => auth.removeUser()}
                    className="w-full dark:hover:bg-slate-600"
                  >
                    <LogOut />
                    <a href="/">Logga ut</a>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
