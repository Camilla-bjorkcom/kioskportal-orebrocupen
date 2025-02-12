import { Facility, Product } from "@/interfaces";

export const calculateTotalAmountForFacility = (
  facility: Facility
): { facilityName: string; products: { productName: string; totalAmount: number; id: string }[] } => {
  
  const totals: Record<string, { productName: string; totalAmount: number; id: string }> = {};

  facility.kiosks.forEach((kiosk) => {
    kiosk.products.forEach((product) => {
      const productId = product.id;
      const productName = product.productName;

      // Beräkna total mängd per produkt
      const amountPackages = product.amountPackages ?? 0;
      const amountPerPackage = product.amountPerPackage ?? 1; // Default till 1 om det saknas
      const amountPieces = product.amountPieces ?? 0;

      const totalAmount = amountPackages * amountPerPackage + amountPieces;

      // Om produkten inte finns, skapa den
      if (!totals[productId]) {
        totals[productId] = {
          productName,
          totalAmount: 0,
          id: productId, // Placeras sist
        };
      }

      // Summera totalen
      totals[productId].totalAmount += totalAmount;
    });
  });

  return {
    facilityName: facility.facilityName,
    products: Object.values(totals), // Konvertera till en array för enklare användning i UI
  };
};
