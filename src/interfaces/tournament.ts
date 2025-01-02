import { Product } from "./product";

export interface Tournament {
    id: string;
    tournamentName: string;
    startDate: Date;
    endDate: Date;
    products: Product[];
  }