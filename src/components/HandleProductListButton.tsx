import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PropsWithChildren, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import UpdateProductListButton from "./UpdateProductListButton";

interface ProductList {
  id: number;
  productlistname: string;
  products: Product[];
}
interface Product {
  id: number;
  productname: string;
}

const formSchema = z.object({
  productlistname: z.string().min(2, {
    message: "Produktlistnamn måste ha minst 2 bokstäver",
  }),
});

function HandleProductListButton({
  children,
  productlist,
  onUpdate,
}: PropsWithChildren & {
  productlist: ProductList;
  onUpdate: (updatedList: ProductList) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productlistname: productlist.productlistname,
    },
  });

  console.log("Product List ID:", productlist.id);
  console.log("productname", productlist.productlistname);
  console.log("products", productlist.products);

  const [products, setProducts] = useState<Product[]>([]);
  const [productlistForUpdate, setProductlistforUpdate] =
    useState<ProductList>(productlist);
  // const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const UpdateListButton = async (productlist: ProductList) => {
    const url = `http://localhost:3000/productslists/${productlist.id}`;
    console.log("Request URL:", url);

    const sanitizedProductList = {
      id: Number(productlist.id),
      productlistname: productlist.productlistname,
      products: productlist.products.map((product) => ({
        id: product.id || "temp-id", // Fyll i ett temporärt id om saknas
        productname: product.productname,
      })),
    };

    console.log("Payload sent to server:", sanitizedProductList);
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productlist),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error("failed to update list");
      }
      const data = await response.json();
      console.log("Update successful:", data);
      setProductlistforUpdate(data);
      return data;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  const { isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">
            {productlist.productlistname}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att 
          </DialogDescription>
          <ul className="mt-4 gap-2 items-center list-inside">
            {productlist.products.map((product, index) => (
              <li className="list-decimal text-lg" key={index}>
                {product.productname}
              </li>
            ))}
          </ul>
        </DialogHeader>

        <UpdateProductListButton
          productlist={productlist}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}

export default HandleProductListButton;
