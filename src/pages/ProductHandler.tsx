import CreateProductButton from "@/components/CreateProductButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import UpdateProductButton from "@/components/UpdateProductButton";

import { TrashIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Product } from "@/interfaces";
import { useParams } from "react-router-dom";



function ProductHandler() {
  const { id } = useParams<{ id: string }>(); 
  const [products, setProducts] = useState<Product[]>([]);
  const tournamentId = id;
  

  const { isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      console.log("TurneringsID", tournamentId)
      setProducts(data);
      return data;
    },
  });

  const SaveProduct = async (productname: string , amountPerPackage: number, tournamentId: string) => {
    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productname: productname, amountPerPackage : amountPerPackage , tournamentId : tournamentId}),
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
  
  const UpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(
        `http://localhost:3000/products/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct), 
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update product");
      }
  
      const updatedProductFromApi = await response.json();
  
     
      setProducts((prev) =>
        prev.map((product) =>
          product.id === updatedProductFromApi.id
            ? updatedProductFromApi
            : product
        )
      );
      console.log("Uppdaterad produkt:", updatedProductFromApi);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Kunde inte uppdatera produkten. Försök igen.");
    }
  };
  

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

  const productsByTournament = products.filter((product) => product.tournamentId === tournamentId);
 


  return (
    <section>
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="mt-8 text-2xl pb-2 mb-4">Produktutbud</h2>
        <CreateProductButton
              onSave={(productname, amountPerPackage, tournamentId) =>
                SaveProduct(productname, amountPerPackage, tournamentId)
              }
              tournamentId={tournamentId || ""} // Skicka id till knappen
            />


        <div className="mt-8">
          <h3 className="text-lg">Sparade produkter:</h3>
          <div className="mt-4 space-y-2 mb-10">
            {productsByTournament.map((product) => (
              <div
                key={product.id}
                className="p-4  pr-2 border border-gray-200 rounded-md shadow w-full 2xl:w-3/4 hover:bg-gray-50"
              >
                <div className="flex flex-row justify-between mr-0">
                  <p className= "basis-2/4 md:basis-1/4">{product.productname}</p>
                  <div className="flex justify-between 2xl:basis-1/3 lg:justify-between">
                  <p className="hidden min-w-36 mr-4 lg:block self-center">Antal per förp: {displayAmount(product.amountPerPackage)}</p>
                 
                  <div className="flex items-center 2xl:basis-1/4 2xl:justify-between" onClick= {(e) => e.stopPropagation()}>
                  <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                        <UpdateProductButton onUpdate={UpdateProduct}
                         product={product}
                          ></UpdateProductButton>
                   
                  </TooltipTrigger>
                        <TooltipContent>
                          <p>Redigera produkt</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>


                    <AlertDialog>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogTrigger>
                            <TrashIcon className="w-8 h-6 hover:text-red-500 flex ml-6 2xl:ml-2" />
                          </AlertDialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Radera produkt</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Vill du radera produkten?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Den här åtgärden kan inte ångras. Produkten kommer
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
                  
                  </div>

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
