import { useAuth } from "react-oidc-context";
import ChangePassword from "@/components/ChangePassword";
import { useParams, useNavigate } from "react-router-dom";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tournament, UpdateTournament } from "@/interfaces/tournament";
import UpdateTournamentButton from "@/components/UpdateTournamentButton";

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
      const response = await fetch(
        `https://zxilxqtzdb.execute-api.eu-north-1.amazonaws.com/prod/tournaments/${id}`
      );
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
      const response = await fetch(
        `https://zxilxqtzdb.execute-api.eu-north-1.amazonaws.com/prod/tournaments/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTournament),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      queryClient.invalidateQueries({queryKey: ["tournament", id]})

      const updatedTournamentFromApi = await response.json();

      console.log("Uppdaterad turnering:", updatedTournamentFromApi);
    } catch (error) {
      console.error("Failed to update torunament:", error);
      alert("Kunde inte uppdatera turneringen. Försök igen.");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="mt-8 text-2xl pb-2">Inställningar</h2>
      <h3 className=" text-lg pb-2 border-b border-b-slate-300">Din profil</h3>
      <div className="flex mt-4">
        <p className="font-semibold mr-2 mb-2">Email:</p>
        <span>{auth.user?.profile.email}</span>
      </div>
      <div>
        <ChangePassword />
      </div>
      <h3 className="text-lg pt-5 pb-2 border-b border-b-slate-300">
        Turneringsdetaljer
      </h3>
      {data ? (
        <div>
          <p className="font-semibold mt-2">{data.tournamentName}</p>
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
  );
};

export default SettingsPage;
