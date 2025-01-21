import { Product } from "./product";


export interface Kiosk {
  id: string;
  kioskName: string;
  products: Product[] | []; 
  facilityId: string;
  facilityName: string;
}