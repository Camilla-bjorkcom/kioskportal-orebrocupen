import { calculateTotalAmountForFacility } from "@/api/functions/calculateTotalAmountForFacility";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { Facility } from "@/interfaces";
import { StorageInventory } from "@/interfaces/storaginventory";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const OverviewInventories = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;

  const { data: storageInventory } = useQuery<StorageInventory>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `/tournaments/${tournamentId}/inventoryoverview`
      );
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

  const { data: facilities } = useQuery<Facility[]>({
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

  const allProducts = storageInventory?.products.map((product) => {
    return product.productName;
  });

  const productTotals =
    storageInventory?.products.map((product) => {
      const totalAmount =
        (product.amountPackages ?? 0) * (product.amountPerPackage ?? 1);
      return {
        productName: product.productName,
        totalAmount: totalAmount,
      };
    }) || [];

  // const totalStorageAmount=

  // const allKiosks: Kiosk[] = facilities?.flatMap((facility: Facility) =>
  //     facility.kiosks?.map((kiosk) => ({
  //       id: kiosk.id,
  //       kioskName: kiosk.kioskName,
  //       products: kiosk.products,
  //       facilityId: kiosk.facilityId,
  //       facility: kiosk.facility,
  //       inventoryDate: kiosk.inventoryDate,
  //       firstInventoryMade: kiosk.firstInventoryMade,
  //       inventoryKey: kiosk.inventoryKey,
  //     })) || []
  //   ) || [];

  // console.log(allKiosks)

  // const totalsPerFacility= calculateTotalAmountPerFacility(facilities || [])

  // console.log(totalsPerFacility)

  const facilitiesWithTotals =
    facilities?.map((facility) => calculateTotalAmountForFacility(facility)) ||
    [];
  console.log("totals per facilict", facilitiesWithTotals);

  return (
    <div>
      <h3>OverviewInventories</h3>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Produkt</TableHead>
            {facilitiesWithTotals.map((facility) => (
              <TableHead className="text-center" key={facility.facilityName}>
                {facility.facilityName}
              </TableHead>
            ))}
            <TableHead className="text-center">Huvudlager</TableHead>
            <TableHead className="text-center">Totalt antal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Loopa igenom alla produkter och skapa en rad för varje produkt */}
          {allProducts?.map((productName) => {
            return (
              <TableRow key={productName}>
                {/* Produktnamn */}
                <TableCell className="font-medium">{productName}</TableCell>

                {/* För varje facility, hämta totalAmount för denna produkt */}
                {facilitiesWithTotals.map((facility) => {
                  const foundProduct = facility.products.find(
                    (p) => p.productName === productName
                  );
                  return (
                    <TableCell
                      key={facility.facilityName + productName}
                      className="text-center"
                    >
                      {foundProduct ? foundProduct.totalAmount : "-"}
                    </TableCell>
                  );
                })}

                {/* Huvudlager-värde */}
                {/* Huvudlager-värde */}
                <TableCell className="text-center">
                  {productTotals.find((p) => p.productName === productName)
                    ?.totalAmount || "-"}
                </TableCell>

                {/* Totalt antal (summa av alla facilities) */}
                <TableCell className="text-center font-bold">
                  {facilitiesWithTotals.reduce((sum, facility) => {
                    const product = facility.products.find(
                      (p) => p.productName === productName
                    );
                    return sum + (product?.totalAmount ?? 0);
                  }, 0)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OverviewInventories;
