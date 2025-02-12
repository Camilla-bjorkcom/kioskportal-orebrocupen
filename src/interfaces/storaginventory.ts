export interface StorageInventory  {
    inventoryDate: string,
    products: StorageProducts[],
  };

  interface StorageProducts {
    id: string;
    productName: string;
    amountPackages: number;
    amountPerPackage: number;
  }