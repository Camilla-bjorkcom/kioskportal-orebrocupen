import { UserDropdown } from "@/components/UserDropdown";
import ThemeToggle from "@/components/ThemeToggle";

const Topbar = () => {
  return (
    <div className="gap-4  w-full h-14 dark:bg-slate-800 bg-gray-200 text-white flex justify-end items-center px-4 shadow-md z-50">
      <div className="container mx-auto flex justify-end items-center">
        <ThemeToggle />
        <UserDropdown />
      </div>
    </div>
  );
};

export default Topbar;
