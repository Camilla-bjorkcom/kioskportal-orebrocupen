import { Facility, Product } from "@/interfaces";

export const calculateTotalAmountPerFacility = (
  facilities: Facility[]
): Record<string, { facilityName: string; products: Record<string, { productName: string; totalAmount: number; id: string }> }> => {
  
  const totals: Record<string, { facilityName: string; products: Record<string, { productName: string; totalAmount: number; id: string }> }> = {};

  facilities.forEach((facility) => {
    facility.kiosks.forEach((kiosk) => {
      kiosk.products.forEach((product) => {
        const facilityId = kiosk.facilityId;
        const facilityName = kiosk.facility;
        const productId = product.id;
        const productName = product.productName;

        // Beräkna total mängd per produkt
        const amountPackages = product.amountPackages ?? 0;
        const amountPerPackage = product.amountPerPackage ?? 1; // Default till 1 om det saknas
        const amountPieces = product.amountPieces ?? 0;

        const totalAmount = amountPackages * amountPerPackage + amountPieces;

        // Om anläggningen inte finns i totals, lägg till den
        if (!totals[facilityId]) {
          totals[facilityId] = {
            facilityName,
            products: {},
          };
        }

        // Om produkten inte finns i anläggningens products, lägg till den
        if (!totals[facilityId].products[productId]) {
          // Skapa objektet med id sist
          totals[facilityId].products[productId] = {
            productName,
            totalAmount: 0, // Uppdateras nedan
            id: productId,  // Placeras sist
          };
        }

        // Summera totalen
        totals[facilityId].products[productId].totalAmount += totalAmount;
      });
    });
  });

  return totals;
};
