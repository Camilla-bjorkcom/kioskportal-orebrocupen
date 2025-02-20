import { Product } from "./product";

export interface KioskInventory {
    kioskInventoryId: string;
    kioskId: string;
    facilityId:string;
    inventoryDate: string;
    products: Product[] | [];
}
