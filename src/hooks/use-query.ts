import { useQuery } from "@tanstack/react-query";
import { Facility } from "@/interfaces/facility";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { GroupedStorageInventories } from "@/interfaces/storageInventory";
import { GetAllProductsResponse } from "@/interfaces/getAllProducts";
import { Productlist } from "@/interfaces/productlist";

export const useGetAllFacilities = (tournamentId: string) => {
  return useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await fetchWithAuth(`facilities/${tournamentId}`);

      if (!response || !response.ok) {
        throw new Error("Failed to fetch inventories");
      }
      const dataResponse: Facility[] = await response.json();
      return dataResponse;
    },
  });
};

export const useGetAllStorageInventories = (tournamentId: string) => {
  return useQuery<GroupedStorageInventories>({
    queryKey: ["inventoryStorageList"],
    queryFn: async () => {
      const response = await fetchWithAuth(`
tournaments/${tournamentId}/inventories`);
      if (!response) {
        throw new Error("Failed to fetch products");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const dataResponse = await response.json();
      return dataResponse;
    },
  });
};

export const useGetAllProducts = (tournamentId: string) => {
  return useQuery<GetAllProductsResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetchWithAuth(`products/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch products");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const dataResponse = await response.json();
      return dataResponse;
    },
  });
};

export const useGetAllProductlists = (tournamentId: string) => {
  return useQuery<Productlist[]>({
    queryKey: ["productlists"],
    queryFn: async () => {
      const response = await fetchWithAuth(`productlists/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch productlists");
      }
      const dataResponse = await response.json();

      return dataResponse || [];
    },
  });
}
