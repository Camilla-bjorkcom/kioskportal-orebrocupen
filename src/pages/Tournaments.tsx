import { useNavigate } from "react-router-dom";
import { useGetAllTournaments } from "@/hooks/use-query";
import CreateTournamentButton from "@/components/CreateTournamentButton";
import { UserDropdown } from "@/components/UserDropdown";
import Topbar from "@/components/Topbar";

function Tournaments() {
  const navigate = useNavigate();

  const { isLoading, error, data, isSuccess } = useGetAllTournaments();

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

  const today = new Date();

  const activeTournaments = data.filter((tournament) => {
    const endDateWithOneDay = new Date(tournament.endDate);
    endDateWithOneDay.setDate(endDateWithOneDay.getDate() + 1);
    return endDateWithOneDay >= today;
  });

  const finishedTournaments = data.filter((tournament) => {
    const endDateWithOneDay = new Date(tournament.endDate);
    endDateWithOneDay.setDate(endDateWithOneDay.getDate() + 1);
    return endDateWithOneDay < today;
  });

  return (
    <>
      <Topbar tournamentName={""} />

      <div className="container mx-auto mt-20 px-5">
        <h2 className="mt-8 text-2xl pb-2">Dina turneringar</h2>
        <CreateTournamentButton />

        <div className="mt-8">
          <h3 className="text-lg font-semibold dark:text-gray-200">
            Aktiva turneringar
          </h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {activeTournaments.length > 0 ? (
              activeTournaments.map((tournament, index) => (
                <button
                  onClick={() =>
                    navigate(`/dashboard/${tournament.id}`, {
                      state: { tournament },
                    })
                  }
                  key={index}
                  className="flex flex-col p-2 justify-between rounded-xl border bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32 relative dark:bg-slate-800 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-500"
                >
                  <div className="flex w-full justify-between">
                    <p className="text-left">{tournament.tournamentName}</p>
                    <p className="text-xs absolute bottom-1 left-2">Spelas:</p>
                    <p className="text-xs absolute bottom-1 right-2">
                      {new Date(tournament.startDate).toLocaleDateString()} /{" "}
                      {new Date(tournament.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-200">
                Inga aktiva turneringar. Skapa en ny turnering!
              </p>
            )}
          </div>
        </div>

        {/* Avslutade turneringar */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-200">
            Avslutade turneringar
          </h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {finishedTournaments.length > 0 ? (
              finishedTournaments.map((tournament, index) => (
                <button
                  onClick={() =>
                    navigate(`/dashboard/${tournament.id}`, {
                      state: { tournament },
                    })
                  }
                  key={index}
                  className="flex flex-col p-2 justify-between rounded-xl border bg-gray-200 text-black shadow hover:bg-gray-400 hover:text-white aspect-video h-32 relative dark:bg-zinc-900 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-zinc-500"
                >
                  <div className="flex w-full justify-between">
                    <p className="text-left">{tournament.tournamentName}</p>
                    <p className="text-xs absolute bottom-1 left-2">
                      Spelades:
                    </p>
                    <p className="text-xs absolute bottom-1 right-2">
                      {new Date(tournament.startDate).toLocaleDateString()} /{" "}
                      {new Date(tournament.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-200">
                Inga avslutade turneringar ännu.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Tournaments;
