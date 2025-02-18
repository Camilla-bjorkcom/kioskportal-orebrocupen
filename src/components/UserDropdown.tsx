import { useAuth } from "react-oidc-context";
import {
  LogOut,
  BadgeCheck,
  BookHeart,
  ChevronsLeftRight,
  ChevronsUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

export function UserDropdown({ id }: { id?: string }) {
  const auth = useAuth();
  const isMobile = useIsMobile(); // Kollar om det är mobilvy

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-600">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={"user.avatar"} alt={"username"} />
              <AvatarFallback className="rounded-lg bg-amber-500 font-bold">
                KP
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hidden md:block">
              {auth.user?.profile["cognito:username"] as string}
            </span>

            <ChevronsUpDown className="ml-auto size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg dark:bg-slate-800"
          align="end"
          sideOffset={4}
          //   side={isMobile ? "top" : "right"}
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
          <DropdownMenuGroup>
            <DropdownMenuItem className="dark:hover:bg-slate-600">
              <BookHeart />
              <a href="/tournaments" className="w-full flex">
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
    </div>
  );
}
