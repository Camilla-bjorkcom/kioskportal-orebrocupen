import { Product } from "@/interfaces/product";

export function calculateTotal(product: Product) {
    const { amountPieces, amountPackages, amountPerPackage } = product;
    product.total = amountPieces! + amountPackages! * amountPerPackage!;
    return product.total;
  }