import DashboardLink from "@/components/DashboardLink";
import DashboardStats from "@/components/DashboardStats";
import DaysLeftTourStat from "@/components/DaysLeftTourStat";
import PagesHeader from "@/components/PagesHeader";
import { useLocation } from "react-router-dom";

function Dashboard() {
  const { pathname } = useLocation();

  return (
    <>
      <PagesHeader pathname={pathname} />
      <div className="container mx-auto">
        <h1 className="font-bold text-5xl mb-24 pl-5">Din översikt</h1>
        <DashboardStats />
        <div className="flex justify-between items-center">
        <DashboardLink />
          <DaysLeftTourStat />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
