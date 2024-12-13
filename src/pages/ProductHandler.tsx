import CreateProductButton from "@/components/CreateProductButton";

import { TrashIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "react-router-dom";

interface Product {
  id: number;
  productname: string;
}

function ProductHandler() {
  const { pathname } = useLocation();
  const [products, setProducts] = useState<Product[]>([]);

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

  const SaveProduct = async (productname: string) => {
    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productname: productname }),
      });
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      const newProduct = await response.json();
      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error(error);
      throw new Error("failed to save product");
    }
  };

  const DeleteProduct = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("failed to delete product");
      }
      setProducts((prev) => prev.filter((list) => list.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <section>
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="mt-8 text-2xl pb-2 mb-4">Produkthantering</h2>
        <CreateProductButton onSave={SaveProduct} />
        <div className="mt-8">
          <h3 className="text-lg">Sparade produkter:</h3>
          <div className="mt-4 space-y-2 mb-10">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 border border-gray-200 rounded-md shadow w-3/4 hover:bg-gray-50"
              >
                <div className="flex justify-between">
                  {product.productname}
                  <button onClick={() => DeleteProduct(product.id)}>
                    <TrashIcon className="w-8 h-6 hover:text-red-500 "></TrashIcon>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductHandler;
