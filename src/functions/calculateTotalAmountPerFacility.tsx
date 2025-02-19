import { Facility } from "@/interfaces";

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

    
        const amountPackages = product.amountPackages ?? 0;
        const amountPerPackage = product.amountPerPackage ?? 1; 
        const amountPieces = product.amountPieces ?? 0;

        const totalAmount = amountPackages * amountPerPackage + amountPieces;

     
        if (!totals[facilityId]) {
          totals[facilityId] = {
            facilityName,
            products: {},
          };
        }

        if (!totals[facilityId].products[productId]) {
          totals[facilityId].products[productId] = {
            productName,
            totalAmount: 0,
            id: productId,
          };
        }
        totals[facilityId].products[productId].totalAmount += totalAmount;
      });
    });
  });

  return totals;
};
