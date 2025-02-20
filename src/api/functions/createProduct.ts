import { DuplicateError, NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const createProduct = async (
  productName: string,
  amountPerPackage: number,
  tournamentId: string
) => {
  const response = await fetchWithAuth(`products/${tournamentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productName, amountPerPackage }),
  });

  if (!response) throw new NoResponseError("No response from server");

  if (response.status === 409) throw new DuplicateError("Product already exists");

  return response.json();
};
