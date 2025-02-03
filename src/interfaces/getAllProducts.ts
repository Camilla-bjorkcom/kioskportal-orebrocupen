import { Product } from './product';


export interface GetAllProductsResponse {
    inventoryDate: string;
  products: Product[];
}   