import {  NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const deleteLogoFile = async (tournamentId: string) => {
  const response = await fetchWithAuth(`tournaments/${tournamentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "deleteLogoFile",
        }),
      }
    );
    if (!response) throw new NoResponseError("No response from server");
  
    return response.json();

}
