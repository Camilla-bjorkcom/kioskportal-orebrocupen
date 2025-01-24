import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Tournament } from "@/interfaces";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import WeatherComponent from "@/components/WeatherComponent";
import Countdown from "@/components/Countdown";

function Dashboard() {
  const { id } = useParams<{ id: string }>();

  const {
    isLoading,
    error,
    data: tournament,
  } = useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      if (!id) throw new Error("No tournament ID provided");
      const response = await fetchWithAuth(`tournaments/${id}`);
      if (!response) throw new Error("Failed to fetch tournament");
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

  return (
    <div className="container mx-auto px-5">
      <div className="flex justify-between ">
        <h2 className="mt-8 text-2xl pb-2">Din översikt</h2>
        <div>
          <Countdown startDate={tournament.startDate} />
          <div className="mt-4 border-t border-gray-300 pt-4">
            <WeatherComponent lat={59.2753} lon={15.2134} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
