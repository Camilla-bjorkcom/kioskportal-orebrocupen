import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Tournament, Kiosk } from "@/interfaces";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import WeatherComponent from "@/components/WeatherComponent";
import Countdown from "@/components/Countdown";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  const { id } = useParams<{ id: string }>();

  const {
    isLoading: isLoadingTournament,
    error: errorTournament,
    data: tournament,
  } = useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      if (!id) throw new Error("No tournament ID provided");
      const response = await fetchWithAuth(`tournaments/${id}`);
      if (!response.ok) throw new Error("Failed to fetch tournament");
      return response.json();
    },
  });

  const {
    isLoading: isLoadingKiosks,
    error: errorKiosks,
    data: kiosks,
  } = useQuery<Kiosk[]>({
    queryKey: ["kiosks", id],
    queryFn: async () => {
      const response = await fetchWithAuth(`/kiosks`);
      if (!response.ok) throw new Error("Failed to fetch kiosks");
      return response.json();
    },
  });

  if (isLoadingTournament || isLoadingKiosks) {
    return <div>Laddar...</div>;
  }

  if (errorTournament || errorKiosks) {
    return (
      <div className="container mx-auto px-5 py-10">
        <h2 className="text-2xl font-bold">Ett fel inträffade</h2>
        <p>Kontrollera nätverksanslutningen eller försök igen senare.</p>
      </div>
    );
  }

  if (!tournament || !kiosks) {
    return (
      <div className="container mx-auto px-5 py-10">
        <h2 className="text-2xl font-bold">Ingen data tillgänglig</h2>
        <p>Kontrollera om data är korrekt konfigurerad.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5">
      <div className="flex justify-between">
        <h2 className="mt-8 text-2xl pb-2">Din översikt</h2>
        <div>
          <Countdown startDate={tournament.startDate} />
          <div className="mt-4 border-t border-gray-300 pt-4">
            <WeatherComponent lat={59.2753} lon={15.2134} />
          </div>
        </div>
      </div>

      {/* Lista över kiosker med QR-koder */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Kiosker och QR-koder</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {kiosks.map((kiosk) => (
            <div
              key={kiosk.id}
              className="p-4 border border-gray-200 rounded-md shadow-md bg-white"
            >
              <h4 className="text-lg font-semibold mb-3">{kiosk.kioskName}</h4>
              <p className="text-sm text-gray-600 mb-4">
                Anläggning: {kiosk.facilityId}
              </p>
              <QRCodeCanvas
                value={`${window.location.origin}/kiosks/${kiosk.id}`}
                size={150}
                bgColor="#ffffff"
                fgColor="#000000"
                className="mx-auto"
              />
              <p className="text-sm text-gray-500 mt-3 text-center">
                Skanna QR-koden för att öppna inventeringsappen
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
