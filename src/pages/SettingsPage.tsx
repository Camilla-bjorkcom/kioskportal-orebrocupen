import { useAuth } from "react-oidc-context";
import ChangePassword from "@/components/ChangePassword";
import { useParams, useNavigate } from "react-router-dom";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tournament, UpdateTournament } from "@/interfaces/tournament";
import UpdateTournamentButton from "@/components/UpdateTournamentButton";
import { toast } from "@/hooks/use-toast";
import fetchWithAuth from "@/api/functions/fetchWithAuth";

const SettingsPage = () => {
  const auth = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { isLoading, error, data, isSuccess } = useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("No tournament ID provided");
      }
      const response = await fetchWithAuth(
        `tournaments/${id}`
      );
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch tournament");
      }
      const dataloading = await response.json();

      return dataloading;
    },
  });

  const handleDelete = () => {
    navigate("/tournaments");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }

  const formatStringToDate = (dateString: string) => {
    return new Date(dateString);
  };

  const UpdateTournament = async (updatedTournament: UpdateTournament) => {
    try {
      const response = await fetchWithAuth(
        `tournaments/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTournament),
        }
      );
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      queryClient.invalidateQueries({ queryKey: ["tournament", id] });

      const updatedTournamentFromApi = await response.json();
      toast({
        className: "bg-green-200",
        title: "Ändringen sparades",
        description: "Turneringen har uppdaterats",
      });

      console.log("Uppdaterad turnering:", updatedTournamentFromApi);
    } catch (error) {
      console.error("Failed to update torunament:", error);
      toast({
        title: "Fel",
        description: "Misslyckades med att spara ändringar.",
        className: "bg-red-200",
      });
    }
  };

  return (
    <div className="container mx-auto ml-5">
      <h2 className="text-2xl pb-5">Inställningar</h2>
      <div className="grid grid-cols-2 gap-2">
        <div>         
          <h3 className="text-lg pb-2 border-b border-b-slate-300 w-3/4">
            Din profil
          </h3>
          <div className="flex mt-4 flex-col">
            <p className="font-semibold mr-2 mb-2">Email:</p>
            <span>{auth.user?.profile.email}</span>
          </div>
          <div className="mt-3">
            <p className="font-semibold mr-2">Byt lösenord: </p>
            <ChangePassword />
          </div>
        </div>
        <div className="">
          <h3 className="text-lg pb-2 border-b border-b-slate-300 w-3/4">
            Turneringsdetaljer
          </h3>
          {data ? (
            <div className="pl-3">
              <p className="font-semibold mt-2">{data.tournamentName}</p>
              <p>Skapad: {new Date(data.created).toLocaleDateString()}</p>
              <p>Startdatum: {new Date(data.startDate).toLocaleDateString()}</p>
              <p>Slutdatum: {new Date(data.endDate).toLocaleDateString()}</p>
            </div>
          ) : (
            <div>Ingen turneringsinformation tillgänglig</div>
          )}
          <div className="mt-6">
            {data && (
              <div className="flex gap-3">
                <UpdateTournamentButton
                  onUpdate={UpdateTournament}
                  tournament={{
                    tournamentName: data.tournamentName,
                    startDate: formatStringToDate(data.startDate),
                    endDate: formatStringToDate(data.endDate),
                  }}
                />
                <DeleteTournamentButton
                  tournamentId={data.id}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
