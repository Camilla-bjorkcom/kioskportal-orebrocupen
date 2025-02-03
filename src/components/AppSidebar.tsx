import { useAuth } from "react-oidc-context";
import {
  SquareChartGantt,
  ChevronDown,
  ChartSpline,
  LogOut,
  ChevronsUpDown,
  BadgeCheck,
  BookHeart,
  House,
  ShoppingBasket,
  ChevronUp,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
      title: "Produkter",
      url: "#",
      icon: ShoppingBasket,
      subitems: [
        {
          title: "Skapa produkter & produktlistor",
          url: `/producthandler/${id}`,
        },
      ],
    },

    {
      title: "Anläggningar & Kiosker",
      url: "#",
      icon: House,
      subitems: [
        {
          title: "Hantera kiosker & produktutbud",
          url: `/facilitiesandkiosks/${id}`,
        },
        { title: "QR koder till kiosker", url: "#" },
      ],
    },

    {
      title: "Inventering",
      url: "#",
      icon: SquareChartGantt,
      subitems: [
        {
          title: "Visa kioskernas inventeringar",
          url: `/inventorystatus/${id}`,
        },
        { title: "Inventera huvudlager", url: `/inventorystorage/${id}` },
        {
          title: "Visa huvudlagrets inventeringar",
          url: `/inventorystatusstorage/${id}`,
        },
      ],
    },
    {
      title: "Statistik",
      url: "#",
      icon: ChartSpline,
      subitems: [{ title: "Din översikt", url: `/dashboard/${id}` }],
    },
  ];
  const auth = useAuth();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="dark:bg-slate-900">
      <SidebarContent>
        <SidebarHeader>
          <img
            src="../src/assets/images/sidebarLogo.svg"
            alt="kiosk portal logo"
          />
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Meny</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="font-bold hover:bg-none">
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
                          className="font-medium hover:bg-gray-100 dark:hover:bg-slate-600 w-full"
                          key={subitem.title}
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
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-slate-900  "
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
