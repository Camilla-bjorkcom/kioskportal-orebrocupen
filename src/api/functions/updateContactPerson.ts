import { ContactPerson } from "@/interfaces";
import fetchWithAuth from "./fetchWithAuth";
import { NoResponseError } from "./apiErrors";

export const updateContactPerson = async (
  contactPerson: ContactPerson,
  tournamentId: string
) => {
  const response = await fetchWithAuth(
    `facilities/${tournamentId}/${contactPerson.facilityId}/contactpersons`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: contactPerson.id,
        name: contactPerson.name,
        phone: contactPerson.phone,
        role: contactPerson.role,
        facilityId: contactPerson.facilityId,
        operation: "updateContactPerson",
      }),
    }
  );
  if (!response) throw new NoResponseError("No response from server");

  return response.json();
};
