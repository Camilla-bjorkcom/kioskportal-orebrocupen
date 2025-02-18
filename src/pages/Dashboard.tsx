import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Tournament } from "@/interfaces";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import WeatherComponent from "@/components/WeatherComponent";
import Countdown from "@/components/Countdown";
import { InventoryGraph } from "@/components/InventoryGraph";
import { OverviewRecord } from "@/interfaces/overview";
import ChangePassword from "@/components/ChangePassword";
import UpdateTournamentSheet from "@/components/UpdateTournamentSheet";

function Dashboard() {
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    error,
    data: tournament,
  } = useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      const response = await fetchWithAuth(`tournaments/${id}`);
      if (!response) throw new Error("Failed to fetch tournament");
      return response.json();
    },
    enabled: !!id,
  });

  const {
    isLoading: isLoadingOverview,
    data: overview,
    error: errorOverview,
  } = useQuery<OverviewRecord>({
    queryKey: ["overview"],
    queryFn: async () => {
      const response = await fetchWithAuth(`tournaments/${id}/overview`);
      if (!response) throw new Error("Failed to fetch overview stats");
      return response.json();
    },
  });

  if (!id) {
    return (
      <div className="container mx-auto px-5 py-10">
        <h2 className="text-2xl font-bold">Ingen turnerings-ID angiven</h2>
        <p>Återvänd till startsidan och välj en turnering.</p>
      </div>
    );
  }

  if (isLoading || isLoadingOverview) {
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

  if (error || errorOverview) {
    return (
      <div className="container mx-auto px-5 py-10">
        <h2 className="text-2xl font-bold">Ett fel inträffade</h2>
        <p>
          Det gick inte att ladda turneringsdata. Kontrollera din
          internetanslutning och försök igen.
        </p>
        <pre className="bg-gray-100 p-3 rounded">{String(error)}</pre>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5">
      {tournament && (
        <>
          <h2 className="text-2xl mt-8 pb-4">Din översikt</h2>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <InventoryGraph
                tournament={tournament}
                overviewRecord={overview!}
              />
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-1/3">
              <Countdown startDate={tournament.startDate} />
              <div className="bg-white dark:bg-slate-800  p-5 rounded-lg shadow-md">
                <p>
                  <strong>Startdatum:</strong>{" "}
                  {new Date(tournament.startDate).toLocaleDateString("sv-SE")}
                </p>
                <p>
                  <strong>Slutdatum:</strong>{" "}
                  {new Date(tournament.endDate).toLocaleDateString("sv-SE")}
                </p>
              </div>
              <div className="w-full">
                <WeatherComponent lat={59.2753} lon={15.2134} />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-end lg:flex-row gap-8 ">
            <div className="w-full lg:w-2/3"></div>
            <div className="bg-white dark:bg-slate-800  gap-4 p-5 rounded-lg shadow-md w-full lg:w-1/3">
              <p>
                <p className="mb-4 text-lg font-semibold ">
                  Turnerings inställningar
                </p>
              </p>
              <div className="flex gap-4 mb-4">
                <UpdateTournamentSheet
                  tournament={{
                    tournamentName: tournament.tournamentName,
                    startDate: new Date(tournament.startDate),
                    endDate: new Date(tournament.endDate),
                  }}
                  tournamentId={tournament.id}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
