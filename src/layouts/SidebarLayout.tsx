import { SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";


interface Tournament {
  id: number;
  tournamentName: string;
  startDate: Date;
  endDate: Date;
}

function TournamentDetails() {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);

  const { isLoading, error } = useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("No tournament ID provided");
      }
      const response = await fetch(`http://localhost:3000/tournaments/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tournament");
      }
      const data = await response.json();
      setTournament(data); // Uppdatera state när data hämtas
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {String(error)}</div>;
  }
  if (tournament) {
    console.log({ id: tournament.id });
  }
  return (
    <SidebarProvider>
      <AppSidebar id={tournament?.id ?? 0} />
      <main className="w-full">
      <div className="p-1 shadow w-full flex items-center mb-8">
      <SidebarTrigger />      
      <p className="mx-auto font-bold text-4xl">{tournament?.tournamentName}</p>
    </div>
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default TournamentDetails;