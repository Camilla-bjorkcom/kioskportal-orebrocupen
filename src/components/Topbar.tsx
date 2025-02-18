import { UserDropdown } from "@/components/UserDropdown";

const Topbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-14 dark:bg-slate-800 bg-gray-200 text-white flex justify-end items-center px-4 shadow-md z-50">
      <UserDropdown />
    </div>
  );
};

export default Topbar;
