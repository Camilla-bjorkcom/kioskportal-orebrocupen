import { KioskInventory } from "@/interfaces/kioskInventory";


export const calculateFirstTotalAmountForFacility = (
    facilityId: string,
    facilityName: string,
    firstKioskInventories?: KioskInventory[]
  ): {
    facilityName: string;
    id: string;
    products: {
      productName: string;
      totalAmount: number;
      id: string;
    }[];
  } => {
    if (!firstKioskInventories) {
      return {
        facilityName,
        id: facilityId,
        products: [],
      };
    }
  
    const totals: Record<
      string,
      { productName: string; totalAmount: number; id: string }
    > = {};
  
    const matchingInventories = firstKioskInventories.filter(
      (inventory) => inventory.facilityId === facilityId
    );
  
    console.log("Facility being processed:", facilityName);
    console.log("Matching inventories for facility:", matchingInventories);
  
    matchingInventories.forEach((inventory) => {
     
  
      inventory.products.forEach((product) => {
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
      facilityName,
      id: facilityId,
      products: Object.values(totals),
    };
  };
  