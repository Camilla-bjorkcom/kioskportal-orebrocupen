export interface Product {
    id: string;
    productName: string;
    amountPerPackage?: number;
    amountPieces?: number;
    amountPackages?: number;
    total?: number;
  }


 export type InventoryProducts = Omit<Product, "amountPieces" | "total">; //anpassat interface för inventering av huvudlager

 export type InventoryStorageProducts = Omit<Product, "amountPieces" | "total">;