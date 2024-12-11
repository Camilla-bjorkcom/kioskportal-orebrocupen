import DashboardLink from "@/components/DashboardLink";
import DashboardStats from "@/components/DashboardStats";
import DaysLeftTourStat from "@/components/DaysLeftTourStat";



function Dashboard() {


  return (
    <>

      <div className="container mx-auto">
        <h2 className="font-bold text-4xl mb-24 pl-5">Din översikt</h2>
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
