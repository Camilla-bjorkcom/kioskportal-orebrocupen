import { useQuery } from "@tanstack/react-query";
import { Facility } from "@/interfaces/facility";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { GroupedStorageInventories } from "@/interfaces/storageinventory";

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