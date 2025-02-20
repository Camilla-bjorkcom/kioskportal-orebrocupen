import { useAuth } from "react-oidc-context";
import { LogOut, BadgeCheck, BookHeart, ChevronsUpDown } from "lucide-react";
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

export function UserDropdown({}: {}) {
  const auth = useAuth();

  return (
    <div className="">
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-2 rounded-lg bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-600">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={"user.avatar"} alt={"username"} />
              <AvatarFallback className="rounded-lg bg-amber-500 font-bold text-slate-900">
                KP
              </AvatarFallback>
            </Avatar>
            <span className="text-sm hidden md:block text-slate-900 dark:text-gray-200">
              {auth.user?.profile["cognito:username"] as string}
            </span>

            <ChevronsUpDown className="ml-auto size-4 text-black dark:text-gray-200" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-fit min-w-56 rounded-lg dark:bg-slate-800"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-sm">
              <div className="grid flex-1 text-sm leading-tigh ">
                <span className="truncate text-xs">
                  {auth.user?.profile["cognito:username"] as string}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="dark:hover:bg-slate-600 text-xs text-center w-full">
              <BookHeart />
              <a href="/tournaments" className="w-full flex">
                Mina turneringar
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="dark:hover:bg-slate-600 text-xs text-center ">
              <BadgeCheck />
              <a href="/settings" className="w-full flex">
                Inställningar
              </a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <button
              onClick={() => auth.removeUser()}
              className=" dark:hover:bg-slate-600 text-xs w-full"
            >
              <LogOut />
              <a href="/" className="w-full flex">Logga ut</a>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
