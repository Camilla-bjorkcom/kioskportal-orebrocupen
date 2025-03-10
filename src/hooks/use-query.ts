import { useQueries, useQuery } from "@tanstack/react-query";
import { Facility } from "@/interfaces/facility";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import {
  GroupedStorageInventories,
  StorageInventory,
} from "@/interfaces/storageInventory";
import { GetAllProductsResponse } from "@/interfaces/getAllProducts";
import { Productlist } from "@/interfaces/productlist";
import { KioskInventory } from "@/interfaces/kioskInventory";
import { Tournament } from "@/interfaces/tournament";
import { Kiosk } from "@/interfaces";
import { OverviewRecord } from "@/interfaces/overview";

export const useGetAllFacilities = (tournamentId: string) => {
  return useQuery<Facility[]>({
    queryKey: [tournamentId, "facilities"],
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
    queryKey: [facilityId, "facilities"],
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
    queryKey: [tournamentId, "inventoryStorageList"],
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
    queryKey: [tournamentId, "products"],
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

export const useGetAllStorageProducts = (tournamentId: string) => {
  return useQuery<StorageInventory>({
    queryKey: [tournamentId, "storageProducts"],
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
    queryKey: [tournamentId, "productlists"],
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
    queryKey: [tournamentId, "tournament"],
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

export const useGetOneKiosk = (
  tournamentId: string,
  facilityId: string,
  kioskId: string
) => {
  return useQuery<Kiosk>({
    queryKey: [tournamentId, "kiosk"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facilityId}/kiosks/${kioskId}`
      );
      if (!response || !response.ok) {
        throw new Error("Failed to fetch kiosk");
      }
      const dataResponse = await response.json();

      return dataResponse || [];
    },
  });
};
export const useGetStorageInventory = (tournamentId: string) => {
  return useQuery<StorageInventory>({
    queryKey: [tournamentId, "inventoryList"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `tournaments/${tournamentId}/inventoryoverview`
      );
      if (!response) {
        throw new Error("Failed to fetch storage inventory");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch storage inventory");
      }
      const dataResponse = await response.json();

      return dataResponse;
    },
  });
};

export const useGetFirstStorageInventory = (tournamentId: string) => {
  return useQuery<StorageInventory>({
    queryKey: [tournamentId, "firstInventoryList"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `tournaments/${tournamentId}/firstinventory`
      );
      if (!response) {
        throw new Error("Failed to fetch first storage inventory");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch first storage inventory");
      }
      const dataResponse = await response.json();

      return dataResponse;
    },
  });
};

export const useGetAllFirstKioskInventories = (tournamentId: string) => {
  return useQuery<KioskInventory[]>({
    queryKey: [tournamentId, "firstkioskinventories"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `firstkioskinventories/${tournamentId}`
      );
      if (!response) {
        throw new Error("Failed to feth first inventories");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch facilities");
      }
      const data = await response.json();

      return data;
    },
  });
};

export const useGetOneKioskFirstInventory = (
  tournamentId: string,
  kioskId: string
) => {
  return useQuery<KioskInventory>({
    queryKey: [tournamentId, "firstKioskInventory"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `firstkioskinventories/${tournamentId}/${kioskId}`
      );
      if (!response) {
        throw new Error("Failed to feth first inventories");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch facilities");
      }
      const data = await response.json();

      return data;
    },
  });
};

export const useGetFirstKioskInventoriesForOneFacility = (
  tournamentId: string,
  kiosks: Kiosk[]
) => {
  return useQueries({
    queries: kiosks.map((kiosk) => ({
      queryKey: [kiosk.id, "kioskInventory" ],
      queryFn: async (): Promise<KioskInventory> => {
        const response = await fetchWithAuth(
          `firstkioskinventories/${tournamentId}/${kiosk.id}`
        );
        if (!response) {
          throw new Error("Response is undefined");
        }
        if (!response.ok) {
          throw new Error(`Failed to fetch inventory for kiosk ${kiosk.id}`);
        }
        const firstInventory = await response.json();
        return firstInventory;
      },
      enabled: !!kiosk.id,
    })),
  });
};


export const useGetOverview = (tournamentId: string) => {
  return useQuery<OverviewRecord>({
    queryKey: [tournamentId, "overview"],
    queryFn: async () => {
      const response = await fetchWithAuth(`tournaments/${tournamentId}/overview`);
      if (!response) throw new Error("Failed to fetch overview stats");
      return response.json();
    },
  });
}