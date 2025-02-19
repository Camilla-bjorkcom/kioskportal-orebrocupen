import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";

import ThemeToggle from "@/components/ThemeToggle";
import { useGetTournament } from "@/hooks/use-query";

function TournamentDetails() {
  const { id } = useParams<{ id: string }>();

  const { isLoading, error, data, isSuccess } = useGetTournament(id!);

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 py-10 flex justify-center items-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          ></div>
          <p className="mt-4 text-gray-500">Laddar turneringsdata...</p>
        </div>
      </div>
    );
  }
  
  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar id={data.id} />
      <main className="w-full ">
        <div className="p-1 shadow w-full flex items-center mb-8 dark:bg-slate-900 ">
          <SidebarTrigger />
          <p className="mx-auto font-semibold text-4xl dark:text-gray-200">
            {data?.tournamentName}
          </p>
          <ThemeToggle />
        </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default TournamentDetails;
