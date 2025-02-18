import { DuplicateError, NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const createKiosk = async (
  kioskName: string,
  facilityId: string,
  tournamentId: string
) => {
  const response = await fetchWithAuth(
    `facilities/${tournamentId}/${facilityId}/kiosks`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kioskName }),
    }
  );

  if (!response) throw new NoResponseError("No response from server");

  if (response.status === 409) throw new DuplicateError("Kiosk already exists");

  return response.json();
};
