import { Facility } from "@/interfaces";
import fetchWithAuth from "./fetchWithAuth";
import { DuplicateError, NoResponseError } from "./apiErrors";

export const updateFacility = async (
  facility: Facility,
  newFacilityName: string,
  tournamentId: string
) => {
  const response = await fetchWithAuth(
    `facilities/${tournamentId}/${facility.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        facilityName: newFacilityName,
        operation: "updateFacility",
      }),
    }
  );
  if (!response) throw new NoResponseError("No response from server");

  if (response.status === 409)
    throw new DuplicateError("Facility already exists");

  return response.json();
};
