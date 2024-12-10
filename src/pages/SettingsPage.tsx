import { useAuth } from "react-oidc-context";
import ChangePassword from "@/components/ChangePassword";
import ContactPerson from "@/components/ContactPerson";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";

interface Tournament {
  id: number;
  tournamentName: string;
  startDate: Date;
  endDate: Date;
}

const SettingsPage = () => {
  const auth = useAuth();
  const location = useLocation();
  const { id } = useParams<{ id: string }>(); // Hämta turnerings-ID från URL
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(
    location.state?.tournament || null
  ); // Försök att använda `state` först

  useEffect(() => {
    if (!tournament && id) {
      // Om `tournament` saknas, hämta från backend
      const fetchTournament = async () => {
        try {
          const response = await fetch(`http://localhost:3000/tournaments/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch tournament");
          }
          const data = await response.json();
          setTournament(data);
        } catch (error) {
          console.error(error);
          navigate("/"); // Gå tillbaka till startsidan om något går fel
        }
      };

      fetchTournament();
    }
  }, [tournament, id, navigate]);

  const handleDelete = () => {
    navigate("/createtournament"); // Navigera tillbaka till startsidan efter borttagning
  };

  if (!tournament) {
    return <div>Loading tournament details...</div>;
  }

  return (
    <div className="container mx-auto">
        <h2 className="font-bold text-4xl mb-24 pl-5">Inställningar</h2>
        <h3 className=" text-2xl pb-2 border-b border-b-slate-300">
          Din profil
        </h3>
        <div className="flex mt-4">
          <p className="font-semibold mr-2 mb-2">Email:</p>
          <span>{auth.user?.profile.email}</span>
        </div>
        <div>
          <ChangePassword />
        </div>
        <h3 className=" mt-8 text-2xl pb-2 border-b border-b-slate-300">
          Kontaktpersoner
        </h3>
        <div>
          <ContactPerson />
        </div>
      <h3 className="text-2xl pt-5 pb-2 border-b border-b-slate-300">Turneringsdetaljer</h3>
      <div>
        <p className="font-semibold mt-2">{tournament.tournamentName}</p>
        <p>Startdatum: {new Date(tournament.startDate).toLocaleDateString()}</p>
        <p>Slutdatum: {new Date(tournament.endDate).toLocaleDateString()}</p>
      </div>
      <div className="mt-6">
        <DeleteTournamentButton
          tournamentId={tournament.id}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
