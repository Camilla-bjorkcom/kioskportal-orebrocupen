import CreateProductButton from "@/components/CreateProductButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateProductButton from "@/components/UpdateProductButton";

import { TrashIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Product, Productlist } from "@/interfaces";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddProductListButton from "@/components/AddProductListButton";
import CreateProductListButton from "@/components/CreateProductListButton";
import UpdateProductListButton from "@/components/UpdateProductListButton";
import HandleProductListButton from "@/components/HandleProductListButton";
import DeleteButton from "@/components/DeleteButton";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { toast } from "@/hooks/use-toast";

function ProductHandler() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  
  const tournamentId = id;

  const {data:products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetchWithAuth(`products/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
   
      return data;
    },
  });

  const {data:productlists, isLoading: isLoadingProductLists, error: errorProductList } =
    useQuery<Productlist[]>({
      queryKey: ["productlists"],
      queryFn: async () => {
        const response = await fetchWithAuth(`productlists/${tournamentId}`);
        if (!response) {
          throw new Error("Failed to fetch product lists");
        }
        const data = await response.json();
        console.log(data);
        

        return data || [];
      },
    });

 

  const CreateProduct = async (productName: string, amountPerPackage: number) => {
    try {
      const response = await fetchWithAuth(`products/${tournamentId}}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, amountPerPackage }),
      });
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      //uppdaterar data
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        className: "bg-green-200",
        title: "Lyckat",
        description: `Produkt ${productName} skapades`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att skapa produkt.",
        className: "bg-red-200",
      });
    }
  };

  const DeleteProduct = async (id: string) => {

    try {
      const response = await fetchWithAuth(`products/${tournamentId}/${id}`, {
        method: "DELETE",
      });
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      //uppdaterar data
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        className: "bg-green-200",
        title: "Lyckat",
        description: `Produkt med id ${id} raderades`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att radera produkt.",
        className: "bg-red-200",
      });
    }
  }

  const UpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetchWithAuth(
        `/products/${tournamentId}/${updatedProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (!response) {
        throw new Error("Failed to update product");
      }

      const updatedProductFromApi = await response.json();

      queryClient.invalidateQueries({ queryKey: ["products"] });
      
      console.log("Uppdaterad produkt:", updatedProductFromApi);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Kunde inte uppdatera produkten. Försök igen.");
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
  const updateProductList = (updatedList: Productlist) => {
   
  };

  // Spara ny produktlista (PUT)
  const SaveProductList = async (
    productlistName: string,
    
  ) => {
    try {
      console.log("Saving product list:", productlistName, "Tournament ID:", tournamentId);
      const response = await fetchWithAuth(`productlists/${tournamentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productlistName: productlistName,
          products: [],
        }),
      });
      if (!response) {
        throw new Error("Failed to save product list");
      }
      const newProductList = await response.json();
      queryClient.invalidateQueries({ queryKey: ["productslists"] });
      console.log(newProductList);
    } catch (error) {
      console.error(error);
    }
  };

  // Ta bort produktlista (DELETE)
  const DeleteProductsList = async (id: string) => {
    try {
      const response = await fetchWithAuth(`productlists/${tournamentId}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response) {
        throw new Error("Failed to delete product list");
      }
      queryClient.invalidateQueries({ queryKey: ["productslists"] });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading || isLoadingProductLists) {
    return <div>Loading products and product lists...</div>;
  }

  if (error || errorProductList) {
    return (
      <div>
        <p>Error occurred while fetching data:</p>
        {error && <p>Products error: {String(error)}</p>}
        {errorProductList && (
          <p>Product lists error: {String(errorProductList)}</p>
        )}
      </div>
    );
  }

 

  return (
    <section>
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="mt-8 text-2xl pb-2 mb-4">Produktutbud</h2>
        <CreateProductButton
          onSave={(productName, amountPerPackage) =>
            CreateProduct(productName, amountPerPackage)
          }
          
        />

        <div className="mt-8">
          <h3 className="text-lg mb-7">Sparade produkter:</h3>

          <div className="grid grid-cols-4 mb-10 gap-2">
            {products?.map((product) => (
              <TooltipProvider key={product.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <UpdateProductButton
                      product={product}
                      onUpdate={UpdateProduct}  
                      onDelete={() => product.id && DeleteProduct(product.id)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Redigera produkt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 flex-row items-center">
        <CreateProductListButton
          onSave={(productListName) => {
            SaveProductList(productListName);
          }}
         
        />
        <div className="mt-8">
        <Accordion type="multiple"  className=" w-full 2xl:w-3/4">
          {productlists?.map((productlist) => (
            <AccordionItem
              key={productlist.id}
              value={productlist.id}
              className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
            >
              <AccordionTrigger className="text-lg font-medium hover:no-underline mr-2">
                <div className="grid w-full grid-cols-1 xl:flex gap-4 justify-between items-center">
                  <label className="basis-1/4 font-medium hover:text-slate-800">
                    {productlist.productlistName}
                  </label>
                  {/* <HandleProductListButton
                    key={productList.id}
                    productlist={productList}
                    onUpdate={updateProductList}
                  ></HandleProductListButton> */}

                  <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit basis-1/12">
                   
                          <UpdateProductListButton
                            onUpdate={(updatedProductList) => updateProductList(updatedProductList)}
                            tournamentProducts={products!}
                            productlist={productlist}
                          />
                        
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <DeleteButton
                            id={productlist.id}
                            type="Productlist"
                            onDelete={() => DeleteProductsList(productlist.id)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Radera produktlista</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex mt-5 font-semibold">Produkter</div>
                        {productlist.products && productlist.products.length > 0 ? (
                          <ul className="grid grid-cols-3 gap-4 mt-2">
                            {productlist.products.map(
                              (product: Product, index: number) => (
                                <li key={index}>{product.productName}</li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-gray-500">
                            Inga produkter tillagda för denna kiosk.
                          </p>
                        )}
                </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </div>
      </div>
    </section>
  );
}

export default ProductHandler;
