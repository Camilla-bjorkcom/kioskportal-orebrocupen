import { NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const createTournament = async ({
    tournamentName,
    startDate,
    endDate,
  }: {
    tournamentName: string;
    startDate: Date;
    endDate: Date;
  }) => {
      const response = await fetchWithAuth("tournaments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentName, startDate, endDate }),
      });
      
        if (!response) throw new NoResponseError("No response from server");
      
        return response.json();
  };
