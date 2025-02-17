import { NoResponseError, DuplicateError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const createFacility = async (
  tournamentId: string,
  facilityName: string
) => {
  const response = await fetchWithAuth(`facilities/${tournamentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ facilityName }),
  });

  if (!response) throw new NoResponseError("No response from server");

  if (response.status === 409)
    throw new DuplicateError("Facility already exists");

  return response.json();
};
