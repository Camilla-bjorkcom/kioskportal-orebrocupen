import CreateTournamentBtn from "@/components/CreateTournamentBtn";
import Header from "@/components/header";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {Tournament} from "@/interfaces/tournament"



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

  const CreateTournament = async ({
    tournamentName,
    startDate,
    endDate,
  }: {
    tournamentName: string;
    startDate: Date;
    endDate: Date;
  }) => {
    try {
      const response = await fetch("https://zxilxqtzdb.execute-api.eu-north-1.amazonaws.com/prod/tournaments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentName, startDate, endDate }),
      });
      console.log(response)
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

  const DeleteTournament = async (id: string) => {
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
        <h2 className="mt-8 text-2xl pb-2">Dina turneringar</h2>
        <CreateTournamentBtn onSave={CreateTournament} />
        <div className="mt-8">
          <h3 className="">Skapade turneringar</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {tournaments.length > 0 ? (
              tournaments.map((tournament, index) => (
                <button
                onClick={() =>
                  navigate(`/dashboard/${tournament.id}`, {
                    state: { tournament }, // Skicka turneringsinformationen här
                  })
                }
                key={index}
                className="flex flex-col p-2 justify-between rounded-xl border bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32 relative"
              >
                <div className="flex justify-between w-full">
                  <p className="">{tournament.tournamentName}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Förhindra navigering vid radering
                      DeleteTournament(tournament.id);
                    }}
                  >
                    
                  </button>
                  <p className="text-xs absolute bottom-2 right-2">
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

        <p className="pt-64">Avslutade turneringar</p>
      </div>
    </>
  );
}

export default CreateTournament;
