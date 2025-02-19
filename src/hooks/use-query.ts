import { useQuery } from "@tanstack/react-query";
import { Facility } from "@/interfaces/facility";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { GroupedStorageInventories } from "@/interfaces/storageInventory";
import { GetAllProductsResponse } from "@/interfaces/getAllProducts";
import { Productlist } from "@/interfaces/productlist";
import { Tournament } from "@/interfaces/tournament";
import { Kiosk } from "@/interfaces";

export const useGetAllFacilities = (tournamentId: string) => {
  return useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await fetchWithAuth(`facilities/${tournamentId}`);

      if (!response || !response.ok) {
        throw new Error("Failed to fetch facilities");
      }
      const dataResponse: Facility[] = await response.json();
      return dataResponse;
    },
  });
};

export const useGetOneFacility = (tournamentId: string, facilityId: string) => {
  return useQuery<Facility>({
    queryKey: ["facilities", facilityId],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facilityId}`
      );
      if (!response || !response.ok) {
        throw new Error("Failed to fetch facility");
      }
      const dataResponse = await response.json();
      return dataResponse.length > 0 ? dataResponse[0] : null;
    },
  });
};

export const useGetAllStorageInventories = (tournamentId: string) => {
  return useQuery<GroupedStorageInventories>({
    queryKey: ["inventoryStorageList"],
    queryFn: async () => {
      const response = await fetchWithAuth(`
tournaments/${tournamentId}/inventories`);
      if (!response || !response.ok) {
        throw new Error("Failed to fetch inventories");
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
      if (!response || !response.ok) {
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
      if (!response || !response.ok) {
        throw new Error("Failed to fetch productlists");
      }
      const dataResponse = await response.json();

      return dataResponse || [];
    },
  });
};

export const useGetTournament = (tournamentId: string) => {
  return useQuery<Tournament>({
    queryKey: ["tournament"],
    queryFn: async () => {
      const response = await fetchWithAuth(`tournaments/${tournamentId}`);
      if (!response || !response.ok) {
        throw new Error("Failed to fetch tournament");
      }
      const dataResponse = await response.json();

      return dataResponse || [];
    },
  });
};

export const useGetAllTournaments = () => {
  return useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const response = await fetchWithAuth("tournaments");
      if (!response || !response.ok) {
        throw new Error("Failed to fetch tournaments");
      }
      const dataResponse = await response.json();

      return dataResponse || [];
    },
  });
};

export const useGetOneKiosk = (tournamentId: string, facilityId: string, kioskId: string) => {
  return useQuery<Kiosk>({
    queryKey: ["kiosk"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facilityId}/kiosks/${kioskId}`);
        if (!response || !response.ok) {
          throw new Error("Failed to fetch kiosk");
        }
        const dataResponse = await response.json();
  
        return dataResponse || [];
      },
    });
  };