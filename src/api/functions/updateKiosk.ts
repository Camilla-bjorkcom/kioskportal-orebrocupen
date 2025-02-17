import { Kiosk } from "@/interfaces";
import fetchWithAuth from "./fetchWithAuth";
import { NoResponseError } from "./apiErrors";

export const updateKiosk = async (kiosk: Kiosk, tournamentId: string) => {
  const response = await fetchWithAuth(
    `facilities/${tournamentId}/${kiosk.facilityId}/kiosks/${kiosk.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: kiosk.id,
        kioskName: kiosk.kioskName,
        products: kiosk.products,
      }),
    }
  );
  if (!response) throw new NoResponseError("No response from server");

  return response.json();
};
