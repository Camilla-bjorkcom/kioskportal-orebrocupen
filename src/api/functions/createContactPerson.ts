import { DuplicateError, NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const createContactPerson = async (
  name: string,
  phone: string,
  role: string,
  facilityId: string,
  tournamentId: string
) => {
  const response = await fetchWithAuth(
    `facilities/${tournamentId}/${facilityId}/contactpersons`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        role,
        facilityId,
        operation: "createContactPerson",
      }),
    }
  );

  if (!response) throw new NoResponseError("No response from server");

  if (response.status === 409)
    throw new DuplicateError("Contactperson already exists");

  return response.json();
};
