import fetchWithAuth from "./fetchWithAuth";
import { NoResponseError } from "./apiErrors";

export const updateTournament = async (
  tournamentId: string,
  data: {
    tournamentName: string;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
  }
) => {
  const response = await fetchWithAuth(`tournaments/${tournamentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response) throw new NoResponseError("No response from server");

  return response.json();
};
