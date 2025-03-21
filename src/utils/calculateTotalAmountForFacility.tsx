import { Facility } from "@/interfaces";

export const calculateTotalAmountForFacility = (
  facility: Facility
): { facilityName: string; id:string; products: { productName: string; totalAmount: number; id: string }[] } => {
  
  const totals: Record<string, { productName: string; totalAmount: number; id: string }> = {};

  facility.kiosks.forEach((kiosk) => {
    kiosk.products.forEach((product) => {
      const productId = product.id;
      const productName = product.productName;

     
      const amountPackages = product.amountPackages ?? 0;
      const amountPerPackage = product.amountPerPackage ?? 1; 
      const amountPieces = product.amountPieces ?? 0;

      const totalAmount = amountPackages * amountPerPackage + amountPieces;

     
      if (!totals[productId]) {
        totals[productId] = {
          productName,
          totalAmount: 0,
          id: productId, 
        };
      }

    
      totals[productId].totalAmount += totalAmount;
    });
  });

  return {
    facilityName: facility.facilityName,
    id: facility.id,
    products: Object.values(totals)
  };
};
