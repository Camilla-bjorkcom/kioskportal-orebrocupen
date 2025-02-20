import { UpdateTournament } from "@/interfaces";
import fetchWithAuth from "./fetchWithAuth";
import { NoResponseError } from "./apiErrors";

export const updateTournament = async (
  tournamentId: string, 
  formData: UpdateTournament
) => {
    const response = await fetchWithAuth(`tournaments/${tournamentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

   if (!response) throw new NoResponseError("No response from server");

  
  return response.json();
}