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


export function AppSidebar({ id }: { id?: number }) {

  const items = [
  
    {
      title: "Produkter",
      url: "#",
      icon: ShoppingBasket,
      subitems: [
        { title: "Produkthanterare", url:  `/producthandler/${id}` },
        { title: "Produktlista", url: `/productlisthandler/${id}` },
        
      ],
    },
    
    {
      title: "Anläggningar",
      url: "#",
      icon: House,
      subitems: [      
        { title: "Planstruktur", url: `/kioskmanager/${id}` },
        { title: "Kontaktpersoner", url: `/contactperson/${id}` },
        { title: "QR koder till kiosker", url: "#" },
        
      ],
    },
  
    {
      title: "Inventering",
      url: "#",
      icon: SquareChartGantt,
      subitems: [
        { title: "Inventera lager", url: `/inventorystorage/${id}` },
        { title: "Visa gjorda inventeringar", url: `/inventorystatus/${id}` },
      ],
    },
    {
      title: "Statistik",
      url: "#",
      icon: ChartSpline,
      subitems: [
        { title: "Din översikt", url: `/dashboard/${id}` },
        
      ],
    },
  ];
  const auth = useAuth();
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <img src="../src/assets/images/sidebarLogo.svg" alt="kiosk portal logo" />
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={"user.avatar"} alt={"username"} />
                    <AvatarFallback className="rounded-lg bg-amber-500 font-bold">KP</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate text-xs">{auth.user?.profile.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
                side={useIsMobile() ? "top" : "right"}           
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={"user.avatar"} alt={"username"} />
                      <AvatarFallback className="rounded-lg bg-amber-500 font-bold">KP</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-xs">
                        {auth.user?.profile.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>    
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem>
                    <BookHeart />
                    <a href="/createtournament">Mina turneringar</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    <a href={`/settings/${id}`}>Inställningar</a>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button  onClick={() => auth.removeUser()} className="w-full">                    
                    <LogOut />
                    <a href="/">
                    Logga ut
                    </a>
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
