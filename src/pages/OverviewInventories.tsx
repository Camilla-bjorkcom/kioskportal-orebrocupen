import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { Facility, Kiosk } from "@/interfaces";
import { GetAllProductsResponse } from "@/interfaces/getAllProducts";
import { StorageInventory } from "@/interfaces/storaginventory";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";

const OverviewInventories = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;


  const {data: storageInventory } = useQuery<StorageInventory>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      const response = await fetchWithAuth(`products/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch products");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    },
  });

  const {  data: facilities,  } = useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await fetchWithAuth(`facilities/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch facilities");
      }
      const data = await response.json();
      return data;
    },
  });

  const allProducts= storageInventory?.products.map((product) => {
    return product.productName;
  });
  console.log(allProducts);

  const allFacilities = facilities?.map((facility) => {
    return facility.facilityName;
  });
    console.log(allFacilities);

    const allKiosks: Kiosk[] = facilities?.flatMap((facility: Facility) =>
        facility.kiosks?.map((kiosk) => ({
          id: kiosk.id,
          kioskName: kiosk.kioskName,
          products: kiosk.products,
          facilityId: kiosk.facilityId,
          facility: kiosk.facility,
          inventoryDate: kiosk.inventoryDate,
          firstInventoryMade: kiosk.firstInventoryMade,
          inventoryKey: kiosk.inventoryKey,
        })) || []
      ) || [];

      console.log(allKiosks)


      
  return <div>OverviewInventories</div>;
};

export default OverviewInventories;
