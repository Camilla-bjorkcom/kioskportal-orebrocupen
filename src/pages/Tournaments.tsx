import CreateTournamentBtn from "@/components/CreateTournamentBtn";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Tournament } from "@/interfaces/tournament";
import fetchWithAuth from "@/api/functions/fetchWithAuth";

function Tournaments() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { isLoading, error, data, isSuccess } = useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const response = await fetchWithAuth("/tournaments");
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch tournaments");
      }
      const dataloading = await response.json();

      return dataloading || [];
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
      const response = await fetchWithAuth("tournaments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentName, startDate, endDate }),
      });
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to save tournament");
      }

      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to save tournament");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <>
      <div className="container mx-auto ">
        <h2 className="mt-8 text-2xl pb-2">Dina turneringar</h2>
        <CreateTournamentBtn onSave={CreateTournament} />
        <div className="mt-8">
          <h3 className="">Skapade turneringar</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {data.length > 0 ? (
              data.map((tournament, index) => (
                <button
                  onClick={() =>
                    navigate(`/dashboard/${tournament.id}`, {
                      state: { tournament },
                    })
                  }
                  key={index}
                  className="flex flex-col p-2 justify-between rounded-xl border bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32 relative dark:bg-slate-900 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-500"
                >
                  <div className="flex w-full justify-between">
                    <p className="text-left">{tournament.tournamentName}</p>
                    <p className="text-xs absolute bottom-1 left-2">Spelas:</p>
                    <p className="text-xs absolute bottom-1 right-2">
                      {new Date(tournament.startDate).toLocaleDateString()} -{" "}
                      {new Date(tournament.endDate).toLocaleDateString()}
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

export default Tournaments;
