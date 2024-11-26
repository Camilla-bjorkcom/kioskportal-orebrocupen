import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

function Kioskmanager() {
  const { pathname } = useLocation();

  return (
    <div className="p-1 shadow w-full flex items-center mb-8">
      <SidebarTrigger />
      <h2>{pathname}</h2>
    </div>
  );
}

export default Kioskmanager;
