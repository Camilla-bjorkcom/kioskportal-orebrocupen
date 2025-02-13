import { calculateTotalAmountForFacility } from "@/functions/calculateTotalAmountForFacility";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { Facility } from "@/interfaces";
import { StorageInventory } from "@/interfaces/storaginventory";
import { useQuery } from "@tanstack/react-query";
import React from "react";
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

const OverviewInventories = () => {
 
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

  const facilitiesWithTotals =
    facilities?.map((facility) => calculateTotalAmountForFacility(facility)) ||
    [];
 

  return (
    <section className="container mx-auto px-5">
    <div>
    <h1 className="mt-8 text-2xl pb-2 mb-4 ">Inventeringsöversikt</h1>
      <Table>
        <TableCaption>Produkternas antal enligt senast gjorda inventering</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold dark:text-slate-300">Produkt</TableHead>
            {facilitiesWithTotals.map((facility) => (
              <TableHead className="text-center font-bold" key={facility.facilityName}>
                <Link to={`/facilityinventory/${tournamentId}/${facility.id}`} >
                <p className="font-bold underline dark:text-slate-300">{facility.facilityName}</p>
                </Link>
               
              </TableHead>
            ))}
            <TableHead className="text-center font-bold dark:text-slate-300">Huvudlager</TableHead>
            <TableHead className="text-center font-bold dark:text-slate-300">Totalt antal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Loopa igenom alla produkter och skapa en rad för varje produkt */}
          {allProducts?.map((productName) => {
            const productsInFacilities = facilitiesWithTotals.map((x) =>
              x.products.find((p) => p.productName === productName)
            );

            const productsInStorage = productTotals.find(
              (x) => x.productName === productName
            );

            const total = [productsInStorage, ...productsInFacilities]
              .map((x) => x?.totalAmount ?? 0)
              .reduce((a, c) => a + c, 0);

            return (
              <TableRow key={productName}>
                {/* Produktnamn */}
                <TableCell ><p className="font-bold dark:text-slate-300">{productName}</p></TableCell>

                {/* För varje facility, hämta totalAmount för denna produkt */}
                {facilitiesWithTotals.map((facility, index) => (
                  <TableCell
                    key={facility.facilityName + productName}
                    className="text-center dark:text-slate-300"
                  >
                    {productsInFacilities[index]?.totalAmount ?? "-"}
                  </TableCell>
                ))}

                {/* Huvudlager-värde */}
                <TableCell className="text-center dark:text-slate-300">
                  {productsInStorage?.totalAmount || "-"}
                </TableCell>

                {/* Totalt antal (summa av alla facilities) */}
                <TableCell className="text-center font-bold dark:text-slate-300">{total}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
      </section>
  );
};

export default OverviewInventories;
