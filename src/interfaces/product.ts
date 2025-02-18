export interface Product {
    id: string;
    productName: string;
    amountPerPackage: number;
    amountPieces: number;
    amountPackages: number;
    total: number;
  }

 export type InventoryStorageProducts = Omit<Product, "amountPieces" >;

 export type TournamentProducts  = Omit<Product, "amountPieces" | "total" >;