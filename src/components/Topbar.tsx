import { UserDropdown } from "@/components/UserDropdown";
import ThemeToggle from "@/components/ThemeToggle";

const Topbar = ({ tournamentName }: { tournamentName: string }) => {
  return (
    <div className="gap-4 w-full h-14 dark:bg-slate-800 bg-gray-200 text-white flex items-center px-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {tournamentName === "" ? (
          <img
            src="../src/assets/images/sidebarLogo.svg"
            alt="KioskPortal Logo"
            className="h-10 w-auto"
          />
        ) : (
          <div className="flex-1 flex justify-center">
            <p className="font-semibold text-4xl dark:text-gray-200">
              {tournamentName}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <UserDropdown />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Topbar;
