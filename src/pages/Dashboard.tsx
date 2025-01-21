import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Tournament } from "@/interfaces";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import WeatherComponent from "@/components/WeatherComponent";

function Dashboard() {
  const { id } = useParams<{ id: string }>();

  const { isLoading, error, data: tournament } = useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      if (!id) throw new Error("No tournament ID provided");
      const response = await fetchWithAuth(`tournaments/${id}`);
      if (!response.ok) throw new Error("Failed to fetch tournament");
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Laddar...</div>;
  }

  if (error || !tournament) {
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
      <div className="flex justify-between">
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
          <div className="mt-4 border-t border-gray-300 pt-4">
            <WeatherComponent lat={59.2753} lon={15.2134} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
