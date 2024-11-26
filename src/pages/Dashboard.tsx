import DashboardLink from "@/components/DashboardLink";
import DashboardStats from "@/components/DashboardStats";
import DaysLeftTourStat from "@/components/DaysLeftTourStat";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const { pathname } = useLocation();

  return (
    <>
      <div className="p-1 shadow w-full flex items-center mb-8">
        <SidebarTrigger />
        <h2>{pathname}</h2>
      </div>
      <div className="container mx-auto">
        <h1 className="font-bold text-5xl mb-24 pl-5">Din översikt</h1>
        <DashboardStats />
        <DashboardLink />
        <DaysLeftTourStat />
      </div>
    </>
  );
}

export default Dashboard;
