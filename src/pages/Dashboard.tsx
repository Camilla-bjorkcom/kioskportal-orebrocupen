import DashboardLink from "@/components/DashboardButtons";
import DashboardStats from "@/components/DashboardStats";
import DaysLeftTourStat from "@/components/DaysLeftTourStat";

function Dashboard() {
  return (
    <>
      <div className="container mx-auto">
        <h2 className="mt-8 text-2xl pb-2">Din översikt</h2>
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
