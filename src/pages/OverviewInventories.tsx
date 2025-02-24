import { calculateTotalAmountForFacility } from "@/utils/calculateTotalAmountForFacility";
import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateProductTotalsFacility } from "@/utils/calculateProductTotalsFacility";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calculateFirstTotalAmountForFacility } from "@/utils/calculateFirstTotalAmountForFacility";
import { sortByInventoryDate } from "@/utils/sortByDate";
import { useState } from "react";
import { cleanDate } from "@/utils/cleanDate";
import {
  useGetAllFacilities,
  useGetAllFirstKioskInventories,
  useGetFirstStorageInventory,
  useGetStorageInventory,
} from "@/hooks/use-query";

const OverviewInventories = () => {
  const tournamentId = useParams().id as string;

  const { data: storageInventory } = useGetStorageInventory(tournamentId);
  const { data: firstStorageInventory, isLoading } =
    useGetFirstStorageInventory(tournamentId);
  const { data: facilities } = useGetAllFacilities(tournamentId);
  const { data: firstKioskInventories } =
    useGetAllFirstKioskInventories(tournamentId);

  const allProducts = storageInventory?.products.map((p) => p.productName);

  const productTotals = calculateProductTotalsFacility(storageInventory!);

  const productsFirstTotals = calculateProductTotalsFacility(
    firstStorageInventory!
  );

  const facilitiesWithTotals =
    facilities?.map((facility) => calculateTotalAmountForFacility(facility)) ||
    [];

  const facilitiesFirstTotals =
    facilities?.map((facility) =>
      calculateFirstTotalAmountForFacility(
        facility.id,
        facility.facilityName,
        firstKioskInventories!
      )
    ) || [];

  const [viewDate, setViewDate] = useState<boolean>(false);

  const toggleViewDate = () => {
    setViewDate((prev) => !prev);
  };

  if (isLoading) {
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

  return (
    <section className="container mx-auto px-5">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="mt-8 text-2xl pb-2 mb-4">Inventeringsöversikt</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button onClick={toggleViewDate}>
                  {viewDate
                    ? "Dölj inventeringsdatum"
                    : "Visa inventeringsdatum"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Visa kioskernas senaste inventering</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Table>
          <TableCaption>
            Produkternas antal enligt senast gjorda inventering
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
              {facilities?.map((facility) => (
                <TableHead
                  key={facility.facilityName}
                  className="text-center font-bold group hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Link
                    to={`/facilityinventory/${tournamentId}/${facility.id}`}
                  >
                    <p className="font-bold underline dark:text-slate-300">
                      {facility.facilityName}
                    </p>
                  </Link>
                </TableHead>
              ))}
              <TableHead className="text-center font-bold dark:text-slate-300">
                <p>Huvudlager</p>
              </TableHead>
              <TableHead className="text-center font-bold dark:text-slate-300">
                Totalt antal
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {allProducts?.map((productName) => (
              <TableRow key={productName}>
                {/* Produktnamn */}
                <TableCell className="dark:text-slate-300">
                  {productName}
                </TableCell>

                {/* Facility-värden */}
                {facilitiesWithTotals.map((facility, index) => {
                  const currentTotal =
                    facilitiesWithTotals[index]?.products.find(
                      (p) => p.productName === productName
                    )?.totalAmount ?? 0;

                  return (
                    <TableCell
                      key={facility.facilityName + productName}
                      className="text-center dark:text-slate-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    >
                      {currentTotal ?? "-"}
                    </TableCell>
                  );
                })}

                {/* Huvudlager */}
                <TableCell className="text-center dark:text-slate-300">
                  {productTotals.find((p) => p.productName === productName)
                    ?.totalAmount ?? "-"}
                </TableCell>

                {/* Totalt antal */}
                <TableCell className="text-center font-bold dark:text-slate-300">
                  {[
                    productTotals.find((p) => p.productName === productName)
                      ?.totalAmount ?? 0,
                    ...facilitiesWithTotals.map(
                      (facility) =>
                        facility.products.find(
                          (p) => p.productName === productName
                        )?.totalAmount ?? 0
                    ),
                  ].reduce((a, c) => a + c, 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default OverviewInventories;
