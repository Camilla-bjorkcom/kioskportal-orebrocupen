import { UserDropdown } from "@/components/UserDropdown";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/images/tempLogo.svg";

type Props = {
  tournamentName?: string;
  leftComponent?: React.ReactNode;
};

const Topbar = ({ tournamentName, leftComponent }: Props) => {
  return (
    <div className="gap-4 w-full h-14 dark:bg-slate-800 bg-white text-white flex items-center px-4 shadow-md z-50">
      {leftComponent}

      <div className="container mx-auto flex justify-between items-center">
        {tournamentName === "" ? (
          <img src={logo} alt="KioskPortal Logo" className="h-10 w-auto" />
        ) : (
          <div className="flex-1 flex justify-center">
            <p className="font-semibold sm:text-3xl text-black dark:text-gray-200 text-md">
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
