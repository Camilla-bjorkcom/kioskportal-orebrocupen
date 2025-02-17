import { NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const deleteContactPerson = async (
  contactPersonId: string,
  facilityId: string,
  tournamentId: string
) => {
  const response = await fetchWithAuth(
    `facilities/${tournamentId}/${facilityId}/contactpersons`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: contactPersonId,
        operation: "deleteContactPerson",
      }),
    }
  );
  if (!response) throw new NoResponseError("No response from server");

  return response.json();
};
