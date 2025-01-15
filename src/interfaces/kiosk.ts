import { Product } from "./product";


export interface Kiosk {
  id: string;
  kioskName: string;
  products: Product[] | null;  // Products kan vara null eller en array om den finns
  facilityId: string;
}