import fetchWithAuth from "./fetchWithAuth";
import { NoResponseError } from "./apiErrors";

export const deleteKiosk = async (
  id: string,
  facilityId: string,
  tournamentId: string
) => {
  const response = await fetchWithAuth(
    `facilities/${tournamentId}/${facilityId}/kiosks/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!response) throw new NoResponseError("No response from server");

  return response.json();
};
