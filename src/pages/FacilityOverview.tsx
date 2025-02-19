import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { calculateTotalAmountForFacility } from "@/functions/calculateTotalAmountForFacility";
import { useQueries } from "@tanstack/react-query";
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
import { useGetOneFacility } from "@/hooks/use-query";
import { cleanDate } from "@/utils/cleanDate";

const FacilityOverview = () => {
  const { id: tournamentId, fid: facilityId } = useParams<{
    id: string;
    fid: string;
  }>();

  const {
    isLoading,
    data: facility,
    isSuccess,
  } = useGetOneFacility(tournamentId!, facilityId!)

  
  const currentKiosks = facility?.kiosks ?? [];

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

  const isFetchingInventories = kioskInventoryQueries.some(
    (query) => query.isFetching
  );
  const isInventoryLoading = kioskInventoryQueries.some(
    (query) => query.isLoading
  );
  const isInventoryError = kioskInventoryQueries.some((query) => query.isError);

  if (isLoading || isFetchingInventories || isInventoryLoading) {
    return (
      <div className="container mx-auto px-5 py-10 flex justify-center items-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          ></div>
          <p className="mt-4 text-gray-500">Laddar turneringsdata...</p>
        </div>
      </div>
    );
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

  // 🔹 Använd den omvandlade datan i `calculateTotalAmountForFacility`
  const facilityFirstForTable = calculateTotalAmountForFacility(
    mappedFacilityFirstInventory
  );

  return (
    <section className="container mx-auto px-5">
      <h2 className="mt-8 text-2xl pb-2 mb-1">Översikt</h2>
      <h1 className="text-2xl pb-2 mb-4 font-bold">{facility.facilityName}</h1>
      <Table>
        <TableCaption>
          Produkternas antal enligt senaste inventering{" "}
          <p className="text-red-500">
            Röd text indikerar att antalet produkter är mindre än 20% av det
            första inventerade värdet
          </p>
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
                  // 🔹 Hitta den första inventeringen för denna kiosk i `validKioskInventories`
                  const firstKioskInventory = validKioskInventories.find(
                    (inventory) => inventory.kioskId === kiosk.id
                  );

                  return (
                    <TableCell key={kiosk.id} className="text-center">

                      {/* 🔹 Hitta motsvarande produkt i kioskens senaste inventering */}
                      {(() => {
                        const latestProduct = kiosk.products.find(
                          (p) => p.id === product.id
                        );

                        // 🔹 Hitta motsvarande produkt i den första inventeringen
                        const firstInventoryProduct =
                          firstKioskInventory?.products.find(
                            (p) => p.id === product.id
                          );

                        // 🔹 Beräkna totalAmount från den senaste inventeringen
                        const latestAmountPackages =
                          latestProduct?.amountPackages ?? 0;
                        const latestAmountPerPackage =
                          latestProduct?.amountPerPackage ?? 1;
                        const latestAmountPieces =
                          latestProduct?.amountPieces ?? 0;
                        const latestTotalAmount =
                          latestAmountPackages * latestAmountPerPackage +
                          latestAmountPieces;

                        // 🔹 Beräkna totalAmount från den första inventeringen
                        const firstAmountPackages =
                          firstInventoryProduct?.amountPackages ?? 0;
                        const firstAmountPerPackage =
                          firstInventoryProduct?.amountPerPackage ?? 1;
                        const firstAmountPieces =
                          firstInventoryProduct?.amountPieces ?? 0;
                        const firstTotalAmount =
                          firstAmountPackages * firstAmountPerPackage +
                          firstAmountPieces;

                        // 🔹 Bestäm om vi ska färga rött (nuvarande mängd < 20% av första mängden)
                        const isLowStock =
                          firstTotalAmount > 0 &&
                          latestTotalAmount < firstTotalAmount * 0.2;

                        return (
                          <span
                            className={
                              isLowStock ? "text-red-500 font-bold" : ""
                            }
                          >
                            {latestTotalAmount}
                          </span>
                        );
                      })()}
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
           <TableRow>
            <TableHead className="font-normal dark:text-slate-300">
              Senaste Inventering
            </TableHead>
            {facility.kiosks.map((kiosk) => (
              <TableHead className="text-center font-bold" key={kiosk.id}>
                <p>{cleanDate(kiosk.inventoryDate)}</p>
              </TableHead>
            ))}
            
            </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default FacilityOverview;
