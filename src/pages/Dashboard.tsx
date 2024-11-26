import DashboardLink from "@/components/DashboardLink";
import DashboardStats from "@/components/DashboardStats";
import DaysLeftTourStat from "@/components/DaysLeftTourStat";


function Dashboard() {
  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-5xl mb-24 pl-5">Din översikt</h1>
      <DashboardStats />
      <DashboardLink />
      <DaysLeftTourStat />
    </div>
  );
}

export default Dashboard;
