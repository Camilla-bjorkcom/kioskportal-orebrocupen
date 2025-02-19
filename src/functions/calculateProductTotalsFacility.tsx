import { StorageInventory } from "@/interfaces/storageInventory";

export const calculateProductTotalsFacility =(storageInventory:StorageInventory) => {
    if (!storageInventory || !Array.isArray(storageInventory.products)) {
      return [];
    }
  
    const productMap = new Map();
  
    storageInventory.products.forEach((product) => {
      const totalAmount = (product.amountPackages ?? 0) * (product.amountPerPackage ?? 1);
      if (productMap.has(product.id)) {
        productMap.get(product.id).totalAmount += totalAmount;
      } else {
        productMap.set(product.id, {
          productName: product.productName,
          totalAmount: totalAmount,
          id: product.id,
        });
      }
    });
  
    return Array.from(productMap.values());
  }