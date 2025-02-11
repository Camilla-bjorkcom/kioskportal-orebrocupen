import { Facility } from "@/interfaces";

const calculateTotalAmountPerFacility = (facilities: Facility[]): Record<string, Record<string, number>> => {
    const totals: Record<string, Record<string, number>> = {};
  
    facilities.forEach((facility) => {
      facility.kiosks.forEach((kiosk) => {
        kiosk.products.forEach((product) => {
          const facilityId = kiosk.facilityId;
          const productId = product.id;
  
          if (!totals[facilityId]) {
            totals[facilityId] = {};
          }
  
          if (!totals[facilityId][productId]) {
            totals[facilityId][productId] = 0;
          }
  
          totals[facilityId][productId] += product.amount; // Summera total mängd per produkt
        });
      });
    });
    return totals;
};