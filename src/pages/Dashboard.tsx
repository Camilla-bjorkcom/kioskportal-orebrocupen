import { useLocation } from "react-router-dom";
import { Tournament } from "@/interfaces";

function Dashboard() {
  const location = useLocation();
  const tournament: Tournament | undefined = location.state?.tournament;

  if (!tournament) {
    return (
      <div className="container mx-auto px-5 py-10">
        <h2 className="text-2xl font-bold">Ingen turnering vald</h2>
        <p>Återvänd till turneringssidan och välj en turnering.</p>
      </div>
    );
  }


  const startDateString = new Date(tournament.startDate).toLocaleDateString(
    "sv-SE",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const endDateString = new Date(tournament.endDate).toLocaleDateString(
    "sv-SE",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const today = new Date();
  const startDate = new Date(tournament.startDate);
  const timeDiff = startDate.getTime() - today.getTime();
  const daysUntilStart = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto px-5">
      <div className="flex justify-between items-center">
        <h2 className="mt-8 text-2xl pb-2">Din översikt</h2>
        <div>
        <p className="text-s mt-2">
          Turneringen spelas från <strong>{startDateString}</strong> till{" "}
          <strong>{endDateString}</strong>.
        </p>
        {daysUntilStart > 0 ? (
          <p className="text-s mt-2">
            Det är <strong>{daysUntilStart} dagar</strong> kvar tills
            turneringen börjar.
          </p>
        ) : daysUntilStart === 0 ? (
          <p className="text-s mt-2">Turneringen börjar idag!</p>
        ) : (
          <p className="text-s mt-2">
            Turneringen har redan börjat eller är avslutad.
          </p>
        )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
