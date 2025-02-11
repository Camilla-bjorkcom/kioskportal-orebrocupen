import { Product } from "./product";


export interface Kiosk {
  id: string;
  kioskName: string;
  products: Product[] | []; 
  facilityId: string;
  facility: string;
  inventoryDate: string;
  firstInventoryMade: boolean;
  inventoryKey: string;
}

export type KioskForQr = Omit<Kiosk, "facilityId" | "inventoryDate" | "firstInventoryMade" | "id"| "products">; //anpassat interface för redigering av kiosk