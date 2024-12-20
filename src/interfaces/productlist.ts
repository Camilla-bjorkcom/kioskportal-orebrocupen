import { Product } from './product';

export interface ProductList {
  id: string;
  productlistname: string;
  products: Product[];
}