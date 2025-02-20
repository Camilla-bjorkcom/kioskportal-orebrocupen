import { TournamentProduct } from "@/interfaces/product";
import fetchWithAuth from "./fetchWithAuth";
import { DuplicateError, NoResponseError } from "./apiErrors";

export const updateProduct = async (updatedProduct: TournamentProduct, tournamentId: string) => {
      const response = await fetchWithAuth(
        `products/${tournamentId}/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response) throw new NoResponseError("No response from server");
    
      if (response.status === 409) throw new DuplicateError("Product already exists");
    
      return response.json();

  };