import fetchWithAuth from '@/api/functions/fetchWithAuth';
import { calculateTotalAmountForFacility } from '@/functions/calculateTotalAmountForFacility';
import { Facility } from '@/interfaces/facility';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useParams } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";


const FacilityOverview = () => {


    const { id: tournamentId, fid: facilityId } = useParams<{ id: string; fid: string }>();

    const { isLoading, error, data: facility, isSuccess } = useQuery<Facility>({
        queryKey: ["facilities"],
        queryFn: async () => {
          const response = await fetchWithAuth(`facilities/${tournamentId}/${facilityId}`);
          if (!response) {
            throw new Error("Failed to fetch");
          }
          if (!response.ok) {
            throw new Error("Failed to fetch facilitiy");
          }
          const dataResponse = await response.json();
          console.log(dataResponse)
          return dataResponse.length >0 ? dataResponse[0] :null;
        },
      });

     

      if (isLoading) {
        return <div>Loading...</div>;
      }
      if (!isSuccess || !facility) {
        return <div>Error: {String(error) || "Facility not found"}</div>;
      }
      
      const facilityForTable = calculateTotalAmountForFacility(facility) || null;
      console.log(facilityForTable)
      
      const facilityProducts = facilityForTable.products

  return (
    <section className="container mx-auto px-5">
    <h2 className="mt-8 text-2xl pb-2 mb-1">Översikt</h2>
    <h1 className='text-2xl pb-2 mb-4 font-bold'>{facility.facilityName}</h1>
    <Table>
        <TableCaption>Produkternas antal enligt senaste inventering </TableCaption>
        <TableHeader>
        <TableRow>
        <TableHead className="font-bold dark:text-slate-300">Produkt</TableHead>
        {facility.kiosks.map((kiosk) =>(
            <TableHead className="text-center font-bold" key={kiosk.id}>
                <p>{kiosk.kioskName}</p>
            </TableHead>   
        ))}
         <TableHead className="text-center font-bold dark:text-slate-300">Totalt antal</TableHead>
         </TableRow>
         </TableHeader>
         <TableBody>
  {facilityForTable.products.map((product) => {
    
    return (
      <TableRow key={product.id}>
        <TableCell className="font-bold">{product.productName}</TableCell>

        {/* 🔹 Loopa igenom kiosker och visa antal produkter i varje */}
        {facility.kiosks.map((kiosk) => {
          const foundProduct = kiosk.products.find((p) => p.id === product.id);
          const amountPackages = foundProduct?.amountPackages ?? 0;
          const amountPerPackage = foundProduct?.amountPerPackage ?? 1;
          const amountPieces = foundProduct?.amountPieces ?? 0;
          const totalAmount = amountPackages * amountPerPackage + amountPieces;
          return (
            <TableCell key={kiosk.id} className="text-center">
              {totalAmount}
            </TableCell>
          );
        })}

        {/* 🔹 Lägg till den totala summan */}
        <TableCell className="text-center font-bold">{product.totalAmount}</TableCell>
      </TableRow>
    );
  })}
</TableBody>

    </Table>


</section>
  )
}

export default FacilityOverview