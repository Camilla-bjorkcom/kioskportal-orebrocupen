import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { calculateTotalAmountForFacility } from "@/functions/calculateTotalAmountForFacility";
import { Facility } from "@/interfaces/facility";
import { useQueries, useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KioskInventory } from "@/interfaces/kioskInventory";
import { mapKioskInventoriesToFacility } from "@/functions/mapKioskInventoriesToFacility";

const FacilityOverview = () => {
  const { id: tournamentId, fid: facilityId } = useParams<{
    id: string;
    fid: string;
  }>();

  // 🔹 Hämtar facility-data
  const {
    isLoading,
    data: facility,
    isSuccess,
  } = useQuery<Facility>({
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

  // 🔹 Vänta på att `facility` laddas innan vi skapar queries
  const currentKiosks = facility?.kiosks ?? [];

  // 🔹 Hämta alla kiosk-inventeringar
  const kioskInventoryQueries = useQueries({
    queries: currentKiosks.map((kiosk) => ({
      queryKey: ["kioskInventory", kiosk.id],
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

  // 🔹 Hantera laddning och fel
  const isFetchingInventories = kioskInventoryQueries.some(
    (query) => query.isFetching
  );
  const isInventoryLoading = kioskInventoryQueries.some(
    (query) => query.isLoading
  );
  const isInventoryError = kioskInventoryQueries.some((query) => query.isError);

  // 🔹 Se till att vi väntar på att ALLA queries är färdiga
  if (isLoading || isFetchingInventories || isInventoryLoading) {
    return <div>Loading kiosk inventories...</div>;
  }
  if (!isSuccess || !facility || isInventoryError) {
    return <div>Error loading data.</div>;
  }

  const kioskInventories = kioskInventoryQueries
    .map((query) => query.data)
    .filter((data) => data && data.kioskInventoryId !== "");

  const facilityForTable = facility
    ? calculateTotalAmountForFacility(facility)
    : null;

  // 🔹 Filtrera bort `undefined` från `kioskInventories`
  const validKioskInventories = kioskInventories.filter(
    (inventory): inventory is KioskInventory => !!inventory
  );

  // 🔹 Använd den filtrerade listan
  const mappedFacilityFirstInventory = mapKioskInventoriesToFacility(
    facility,
    validKioskInventories
  );

  console.log("Mapped Facility for Calculation:", mappedFacilityFirstInventory);

  // 🔹 Använd den omvandlade datan i `calculateTotalAmountForFacility`
  const facilityFirstForTable = calculateTotalAmountForFacility(
    mappedFacilityFirstInventory
  );

  console.log("Facility Table Data after Calculation:", facilityFirstForTable);

  return (
    <section className="container mx-auto px-5">
      <h2 className="mt-8 text-2xl pb-2 mb-1">Översikt</h2>
      <h1 className="text-2xl pb-2 mb-4 font-bold">{facility.facilityName}</h1>
      <Table>
        <TableCaption>
          Produkternas antal enligt senaste inventering{" "}
          <p className="text-red-500">Röd text indikerar att antalet produkter är mindre än 20% av det första inventerade värdet</p>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold dark:text-slate-300">
              Produkt
            </TableHead>
            {facility.kiosks.map((kiosk) => (
              <TableHead className="text-center font-bold" key={kiosk.id}>
                <p>{kiosk.kioskName}</p>
              </TableHead>
            ))}
            <TableHead className="text-center font-bold dark:text-slate-300">
              Totalt antal
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilityForTable?.products.map((product) => {
            const firstInventoryProduct = facilityFirstForTable?.products.find(
              (p) => p.id === product.id
            );
            return (
              <TableRow key={product.id}>
                <TableCell className="font-bold">
                  {product.productName}
                </TableCell>

                {/* 🔹 Loopa igenom kiosker och visa antal produkter i varje */}
                {facility.kiosks.map((kiosk) => {
                  const foundProduct = kiosk.products.find(
                    (p) => p.id === product.id
                  );
                  const amountPackages = foundProduct?.amountPackages ?? 0;
                  const amountPerPackage = foundProduct?.amountPerPackage ?? 1;
                  const amountPieces = foundProduct?.amountPieces ?? 0;
                  const totalAmount =
                    amountPackages * amountPerPackage + amountPieces;
                  return (
                    <TableCell key={kiosk.id} className="text-center">
                      {totalAmount}
                    </TableCell>
                  );
                })}

                {/* 🔹 Lägg till den totala summan */}
                <TableCell
                  className={`text-center font-bold ${
                    firstInventoryProduct &&
                    product.totalAmount <
                      firstInventoryProduct.totalAmount * 0.2
                      ? "text-red-500 font-bold dark:text-red-500 dark:font-bold" // 🔴 Röd text om under 20% av första inventeringen
                      : ""
                  }`}
                >
                  {product?.totalAmount ?? "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
};

export default FacilityOverview;
