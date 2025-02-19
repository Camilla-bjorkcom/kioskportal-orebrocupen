import { DuplicateError, NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const createProductlist = async (
  productlistName: string,
  tournamentId: string
) => {
  const response = await fetchWithAuth(`productlists/${tournamentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productlistName: productlistName
    }),
  });

  if (!response) throw new NoResponseError("No response from server");

  if (response.status === 409)
    throw new DuplicateError("Productlist already exists");

  return response.json();
};
