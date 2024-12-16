import CreateProductButton from "@/components/CreateProductButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import UpdateProductButton from "@/components/UpdateProductButton";

import { TrashIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


interface Product {
  id: string;
  productname: string;
  amountPerPackage : number
}

function ProductHandler() {
 
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

  const SaveProduct = async (productname: string , amountPerPackage: number) => {
    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productname: productname, amountPerPackage : amountPerPackage }),
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
  
  const UpdateProduct = async ( id: string, productname: string, amountPerPackage: number) => {
    try{

      console.log("Skickar till API:", {
        id,
        productname,
        amountPerPackage
      });

      const response= await fetch(`http://localhost:3000/products/${id}`, {
        method:"PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productname: productname, amountPerPackage : amountPerPackage }),
      });
      if(!response.ok) {
        throw new Error("Failed to update product");
      }
      const updatedProduct = await response.json();
      console.log("skickat till databas", updatedProduct)
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
    }
    catch (error) {
      console.error("Failed to update product:", error);
      alert("Kunde inte uppdatera produkten. Försök igen.");
    }
  }

  const DeleteProduct = async (id: string) => {
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
  function displayAmount(amount?: number | null) {
    if (amount === null || amount === undefined) {
      return "N/A";
    }
    return amount === 0 ? "N/A" : amount;
  }

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
                <div className="flex flex-row justify-between">
                  <p className= "basis-1/4">{product.productname}</p>
                  <div className="flex justify-between basis-1/3">
                  <p className="mr-10 min-w-24">st/kolli: {displayAmount(product.amountPerPackage)}</p>
                  <UpdateProductButton onUpdate={UpdateProduct}
                   product={{ id: product.id, productname: product.productname, amountPerPackage: product.amountPerPackage }}></UpdateProductButton>
                  <button  onClick= {(e) => e.stopPropagation()}>
                    <AlertDialog>
                        <AlertDialogTrigger>
                        <TrashIcon className="w-8 h-6 hover:text-red-500 "></TrashIcon>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Vill du radera listan?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Den här åtgärden kan inte ångras. Listan kommer
                              att tas bort permanent.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => DeleteProduct(product.id)}
                            >
                              Radera
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                  
                  </button>

                  </div>
                 
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
