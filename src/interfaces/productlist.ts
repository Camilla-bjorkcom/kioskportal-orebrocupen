import { Product } from './product';

export interface Productlist {
  id: string;
  productlistName: string;
  products: Product[];
}