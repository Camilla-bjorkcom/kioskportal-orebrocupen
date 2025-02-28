import { calculateTotalAmountForFacility } from "@/utils/calculateTotalAmountForFacility";
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
import { mapKioskInventoriesToFacility } from "@/utils/mapKioskInventoriesToFacility";
import { cleanDate } from "@/utils/cleanDate";
import {
  useGetFirstKioskInventoriesForOneFacility,
  useGetOneFacility,
} from "@/hooks/use-query";

const FacilityOverview = () => {
  const tournamentId = useParams().id as string;
  const facilityId = useParams().fid as string;

  const {
    isLoading,
    data: facility,
    isSuccess,
  } = useGetOneFacility(tournamentId, facilityId);

  const currentKiosks = facility?.kiosks ?? [];

  const kiosksFirstInventories = useGetFirstKioskInventoriesForOneFacility(
    tournamentId,
    currentKiosks
  );
  const isInventoryLoading = kiosksFirstInventories.some(
    (query) => query.isLoading
  );
  const isInventoryError = kiosksFirstInventories.some(
    (query) => query.isError
  );

  if (isLoading || isInventoryLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-5 py-10">
        <div className="text-center">
          <div
            className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4"
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

  const kioskInventories = kiosksFirstInventories
    .map((query) => query.data)
    .filter((data) => data && data.kioskInventoryId !== "");

  const facilityForTable = facility
    ? calculateTotalAmountForFacility(facility)
    : null;

  const validKioskInventories = kioskInventories.filter(
    (inventory): inventory is KioskInventory => !!inventory
  );

  const mappedFacilityFirstInventory = mapKioskInventoriesToFacility(
    facility,
    validKioskInventories
  );

  const facilityFirstForTable = calculateTotalAmountForFacility(
    mappedFacilityFirstInventory
  );

  return (
    <section className="container mx-auto px-5">
      <h2 className="mb-1 mt-8 pb-2 text-2xl">Översikt</h2>
      <h1 className="mb-4 pb-2 text-2xl font-bold">{facility.facilityName}</h1>
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
          {facilityForTable?.products
            .toSorted((a, b) => a.productName.localeCompare(b.productName))
            .map((product) => {
              const firstInventoryProduct =
                facilityFirstForTable?.products.find(
                  (p) => p.id === product.id
                );
              return (
                <TableRow
                  key={product.id}
                  className="odd:dark:bg-slate-700 odd:bg-gray-200"
                >
                  <TableCell className="dark:text-slate-300">
                    {product.productName}
                  </TableCell>

                  {/* 🔹 Loopa igenom kiosker och visa antal produkter i varje */}
                  {facility.kiosks.map((kiosk) => {
                    // 🔹 Hitta den första inventeringen för denna kiosk i `validKioskInventories`
                    const firstKioskInventory = validKioskInventories.find(
                      (inventory) => inventory.kioskId === kiosk.id
                    );
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
                    const latestAmountPieces = latestProduct?.amountPieces ?? 0;
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
                      <TableCell key={kiosk.id} className="text-center">
                        {/* 🔹 Hitta motsvarande produkt i kioskens senaste inventering */}

                        <span
                          className={isLowStock ? "font-bold text-red-500" : ""}
                        >
                          {latestTotalAmount}
                        </span>
                      </TableCell>
                    );
                  })}

                  {/* 🔹 Lägg till den totala summan */}
                  <TableCell
                    className={`text-center font-bold ${
                      firstInventoryProduct &&
                      product.totalAmount <
                        firstInventoryProduct.totalAmount * 0.2
                        ? "font-bold text-red-500 dark:font-bold dark:text-red-500" // 🔴 Röd text om under 20% av första inventeringen
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
              <TableHead className="text-center" key={kiosk.id}>
                <p>
                  {kiosk.firstInventoryMade
                    ? cleanDate(kiosk.inventoryDate)
                    : "Ingen inventering gjord"}
                </p>
              </TableHead>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default FacilityOverview;
