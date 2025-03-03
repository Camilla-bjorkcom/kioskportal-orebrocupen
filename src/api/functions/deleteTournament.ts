import { NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const deleteTournament = async (tournamentId: string) => {
  const response = await fetchWithAuth(`tournaments/${tournamentId}`, {
    method: "DELETE",
  });

  if (!response) throw new NoResponseError("No response from server");

  return response.json();
};
