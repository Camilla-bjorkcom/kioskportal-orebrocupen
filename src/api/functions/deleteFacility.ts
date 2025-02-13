import { NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const deleteFacility = async (FId: string, tournamentId: string) => {
  const response = await fetchWithAuth(`facilities/${tournamentId}/${FId}`, {
    method: "DELETE",
  });
  if (!response) throw new NoResponseError("No response from server");

  return response.json();
};
