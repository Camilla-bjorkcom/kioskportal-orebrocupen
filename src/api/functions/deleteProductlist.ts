import { NoResponseError } from "./apiErrors";
import fetchWithAuth from "./fetchWithAuth";

export const deleteProductList = async (id: string, tournamentId: string) => {
      const response = await fetchWithAuth(
        `productlists/${tournamentId}/${id}`,
        {
          method: "DELETE",
        }
      );
     
       if (!response) throw new NoResponseError("No response from server");
     
       return response.json();
  };