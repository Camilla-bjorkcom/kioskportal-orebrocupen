import { useAuth } from "react-oidc-context";
import ChangePassword from "@/components/ChangePassword";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";
import { useQuery } from "@tanstack/react-query";

interface Tournament {
  id: number;
  tournamentName: string;
  startDate: Date;
  endDate: Date;
}

const SettingsPage = () => {
  const auth = useAuth();
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(
    location.state?.tournament || null
  ); 

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
      setTournament(data); 
      return data;
    },
  });

  const handleDelete = () => {
    navigate("/createtournament"); 
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <div className="container mx-auto">
        <h2 className="mt-8 text-2xl pb-2">Inställningar</h2>
        <h3 className=" text-lg pb-2 border-b border-b-slate-300">
          Din profil
        </h3>
        <div className="flex mt-4">
          <p className="font-semibold mr-2 mb-2">Email:</p>
          <span>{auth.user?.profile.email}</span>
        </div>
        <div>
          <ChangePassword />
        </div>       
      <h3 className="text-lg pt-5 pb-2 border-b border-b-slate-300">Turneringsdetaljer</h3>
      {tournament ? (
        <div>
          <p className="font-semibold mt-2">{tournament.tournamentName}</p>
          <p>Startdatum: {new Date(tournament.startDate).toLocaleDateString()}</p>
          <p>Slutdatum: {new Date(tournament.endDate).toLocaleDateString()}</p>
        </div>
      ) : (
        <div>Ingen turneringsinformation tillgänglig</div>
      )}
      <div className="mt-6">
        {tournament && (
          <DeleteTournamentButton
            tournamentId={tournament.id}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
