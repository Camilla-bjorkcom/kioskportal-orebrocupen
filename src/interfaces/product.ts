export interface Product {
    id: string;
    productName: string;
    amountPerPackage: number;
    amountPieces: number;
    amountPackages: number;
    total: number;
  }


 export type InventoryStorageProducts  = Omit<Product, "amountPieces" | "total" >;

 export type TournamentProduct = Omit<Product, "amountPieces" | "total" | "amountPackages">