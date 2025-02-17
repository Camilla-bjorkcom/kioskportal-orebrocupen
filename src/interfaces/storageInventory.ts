import { InventoryStorageProducts } from "./product";

export interface StorageInventory {
  id: string;
  inventoryDate: string;
  products: InventoryStorageProducts[];
}

export type GroupedStorageInventories = Record<string, StorageInventory[]>;