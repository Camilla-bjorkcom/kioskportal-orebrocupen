import { useQueries, useQuery } from "@tanstack/react-query";
import { Facility } from "@/interfaces/facility";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { GroupedStorageInventories, StorageInventory } from "@/interfaces/storageInventory";
import { GetAllProductsResponse } from "@/interfaces/getAllProducts";
import { Productlist } from "@/interfaces/productlist";
import { KioskInventory } from "@/interfaces/kioskInventory";
import { Kiosk } from "@/interfaces";

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

export const useGetOneFacility = (tournamentId: string, facilityId: string) =>{
  return useQuery<Facility>({
    queryKey: ["facilities", tournamentId, facilityId],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facilityId}`
      );
      if (!response) {
        throw new Error("Response is undefined");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch facility");
      }
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    },
  });
}

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

export const useGetStorageInventory = (tournamentId: string) => {
  return useQuery<StorageInventory>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      const response = await fetchWithAuth(`tournaments/${tournamentId}/inventoryoverview`
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
}

export const useGetFirstStorageInventory = (tournamentId : string) => {
 return useQuery<StorageInventory>(
    {
      queryKey: ["firstInventoryList"],
      queryFn: async () => {
        const response = await fetchWithAuth(`tournaments/${tournamentId}/firstinventory`
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

}

export const useGetAllFirstKioskInventories = (tournamentId: string) => {
  return useQuery<KioskInventory[]>({
    queryKey: ["firstkioskinventories"],
    queryFn: async () => {
      const response = await fetchWithAuth(`firstkioskinventories/${tournamentId}`);
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
}

export const useGetOneKioskFirstInventory = (tournamentId:string, kioskId:string) =>{
  return useQuery<KioskInventory>(
    {
      queryKey:["firstKioskInventory"],
      queryFn: async() => {
        const response= await fetchWithAuth(`firstkioskinventories/${tournamentId}/${kioskId}`);
        if(!response) {
          throw new Error("Failed to feth first inventories");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch facilities");
        }
        const data = await response.json();
  
        return data;
      },
        });
      }

  export const useGetFirstKioskInventoriesForOneFacility =(tournamentId:string, kiosks: Kiosk[]) =>{
    return useQueries({
      queries: kiosks.map((kiosk) => ({
        queryKey: ["kioskInventory", kiosk.id],
        queryFn: async (): Promise<KioskInventory> => {
          const response = await fetchWithAuth(`firstkioskinventories/${tournamentId}/${kiosk.id}`
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
  }
    
    