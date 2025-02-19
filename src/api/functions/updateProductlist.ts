import { Productlist } from "@/interfaces/productlist";
import fetchWithAuth from "./fetchWithAuth";
import { NoResponseError, DuplicateError } from "./apiErrors";

export const updateProductlist = async (
  updatedProductList: Productlist,
  tournamentId: string
) => {
  const response = await fetchWithAuth(
    `productlists/${tournamentId}/${updatedProductList.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProductList),
    }
  );
  if (!response) throw new NoResponseError("No response from server");

  if (response.status === 409)
    throw new DuplicateError("Product already exists");

  return response.json();
};
