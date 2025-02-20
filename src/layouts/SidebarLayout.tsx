import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Tournament } from "@/interfaces";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import Topbar from "@/components/Topbar";

function TournamentDetails() {
  const { id } = useParams<{ id: string }>();

  const { isLoading, error, data, isSuccess } = useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("No tournament ID provided");
      }
      const response = await fetchWithAuth(`tournaments/${id}`);
      if (!response) {
        throw new Error("Failed to fetch tournament");
      }
      const tournament = await response.json();

      return tournament || [];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar id={data.id} />
      <main className="w-full ">
        <Topbar tournamentName={data?.tournamentName} />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default TournamentDetails;
