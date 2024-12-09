import CreateTournamentBtn from "@/components/CreateTournamentBtn";
import Header from "@/components/header";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Tournament {
  id: number;
  tournamentName: string;
  startDate: Date;
  endDate: Date;
}



function CreateTournament() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  

  const datetime = new Date().toLocaleDateString();

  const { isLoading, error } = useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/tournaments");
      if (!response.ok) {
        throw new Error("Failed to fetch tournaments");
      }
      const data = await response.json();
      setTournaments(data || []);
      return data || [];
    },
  });

  const SaveTournament = async ({
    tournamentName,
    startDate,
    endDate,
  }: {
    tournamentName: string;
    startDate: Date;
    endDate: Date;
  }) => {
    try {
      const response = await fetch("http://localhost:3000/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentName, startDate, endDate }),
      });
      if (!response.ok) {
        throw new Error("Failed to save tournament");
      }
      const newTournament = await response.json();
      setTournaments((prev) => [...prev, newTournament]);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to save tournament");
    }
  };

  const DeleteTournament = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/tournaments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete tournament");
      }
      setTournaments((prev) => prev.filter((list) => list.id !== id));
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete tournament");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <>
      <Header />

      <div className="container mx-auto ">
        <h2 className="font-bold text-4xl mb-24">Dina turneringar</h2>
        <CreateTournamentBtn onSave={SaveTournament} />
        <div className="mt-8">
          <h3 className="font-bold">Skapade turneringar</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {tournaments.length > 0 ? (
              tournaments.map((tournament, index) => (
                <button
                  // onClick={() => navigate(`/dashboard/${tournament.id}`)} // Navigera till dashboard
                  key={index}
                  className="flex flex-col p-2 justify-between rounded-xl border bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32 relative"
                >
                  <div>
                    <p className="font-bold">{tournament.tournamentName}</p>
                    <button onClick={(e) => {
                      e.stopPropagation(); // Förhindra att navigering sker vid radering
                      DeleteTournament(tournament.id);
                    }}>
                      <TrashIcon className="w-8 h-6 hover:text-red-500"></TrashIcon>
                    </button>
                    <p className="text-xs font-bold absolute bottom-2 right-2">
                      Skapad: {datetime}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-500">
                Inga turneringar hittades. Skapa en ny turnering!
              </p>
            )}
          </div>
        </div>

        <p className="pt-64 font-bold">Avslutade turneringar</p>
      </div>
    </>
  );
}

export default CreateTournament;
