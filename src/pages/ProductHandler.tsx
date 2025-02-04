import CreateProductButton from "@/components/CreateProductButton";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateProductButton from "@/components/UpdateProductButton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product, Productlist } from "@/interfaces";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import CreateProductListButton from "@/components/CreateProductListButton";
import UpdateProductListButton from "@/components/UpdateProductListButton";
import DeleteButton from "@/components/DeleteButton";
import fetchWithAuth from "@/api/functions/fetchWithAuth";

import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { GetAllProductsResponse } from "@/interfaces/getAllProducts";

function ProductHandler() {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const tournamentId = id;

  const {
    data: products,
    isLoading,
    error,
  } = useQuery<GetAllProductsResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetchWithAuth(`products/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      console.log(data);

      return data;
    },
  });

  const {
    data: productlists,
    isLoading: isLoadingProductLists,
    error: errorProductList,
  } = useQuery<Productlist[]>({
    queryKey: ["productlists"],
    queryFn: async () => {
      const response = await fetchWithAuth(`productlists/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch product lists");
      }
      const data = await response.json();

      return data || [];
    },
  });

  const CreateProduct = async (
    productName: string,
    amountPerPackage: number
  ): Promise<number> => {
    // 🔥 Gör att vi kan returnera true/false
    try {
      const response = await fetchWithAuth(`products/${tournamentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, amountPerPackage }),
      });

      if (!response) {
        throw new Error("Failed to fetch");
      }

      if (response.status === 409) {
        const errorData = await response.json();
        console.log("409 Conflict Error:", errorData);

        toast({
          title: "Fel",
          description: errorData.message || "Produkten finns redan.",
          className: "bg-red-200  dark:bg-red-400 dark:text-black",
        });

        return 409; // returnerar 409 om det är en konflikt för att sätta meddelandet till användare
      }

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });

      toast({
        className: "bg-green-200 dark:text-black dark:bg-green-400",
        title: "Lyckat",
        description: `Produkt ${productName} skapades`,
      });

      return 201; // 🔥 Returnerar 500 om något går fel för att sätta meddelandet till användare
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att skapa produkt.",
        className: "bg-red-200 dark:text-black dark:bg-red-400",
      });
      return 500; // 🔥 Returnerar false vid fel
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
      queryClient.invalidateQueries({ queryKey: ["productlists"] });
      toast({
        className: "bg-green-200 dark:text-black dark:bg-green-400",
        title: "Lyckat",
        description: `Produkt har raderats`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att radera produkt.",
        className: "bg-red-200 dark:text-black dark:bg-red-400",
      });
    }
  };

  const UpdateProduct = async (updatedProduct: Product): Promise<number> => {
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
      if (response.status === 409) {
        const errorData = await response.json();
        console.log("409 Conflict Error:", errorData);

        toast({
          title: "Fel",
          description: errorData.message || "Produkten finns redan.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        return 409; // returnerar 409 om det är en konflikt för att sätta meddelandet till användare
      }

      const updatedProductFromApi = await response.json();

      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productlists"] });
      toast({
        className: "bg-green-200 dark:text-black dark:bg-green-400",
        title: "Lyckat",
        description: `Produkten uppdaterades`,
      });
      console.log("Uppdaterad produkt:", updatedProductFromApi);
      return 200; // returnerar 200 om det lyckas för att sätta meddelandet till användare
    } catch (error) {
      console.error("Failed to update product:", error);
      toast({
        title: "Fel",
        description: "Misslyckades med att uppdatera produkt.",
        className: "bg-red-200 dark:text-black dark:bg-red-400",
      });
      return 500; // returnerar 500 om det misslyckas för att sätta meddelandet till användare
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  // Spara ny produktlista (PUT)
  const SaveProductList = async (productlistName: string) => {
    try {
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
      if (response.status === 409) {
        const errorData = await response.json();
        console.log("409 Conflict Error:", errorData);

        toast({
          title: "Fel",
          description: `Produktlista med namnet ${productlistName}  finns redan.`,
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        queryClient.invalidateQueries({ queryKey: ["productslists"] });
        return 409; // returnerar 409 om det är en konflikt för att sätta meddelandet till användare
      }

      queryClient.invalidateQueries({ queryKey: ["productlists"] });
      toast({
        className: "bg-green-200 dark:text-black dark:bg-green-400",
        title: "Lyckat",
        description: `Produktlista  ${productlistName} skapades`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att skapa produktlista.",
        className: "bg-red-200 dark:text-black dark:bg-red-400",
      });
    }
  };

  const UpdateProductlist = async (updatedProductList: Productlist) => {
    try {
      const response = await fetchWithAuth(
        `productlists/${tournamentId}/${updatedProductList.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProductList),
        }
      );

      if (!response) {
        throw new Error("Failed to update product list");
      }

      if (response.status === 409) {
        const errorData = await response.json();
        console.log("409 Conflict Error:", errorData);

        toast({
          title: "Fel",
          description: `Produktlista med namnet ${updatedProductList.productlistName}  finns redan.`,
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        queryClient.invalidateQueries({ queryKey: ["productslists"] });
      }
      // const updatedProductListFromApi = await response.json();
      if(response.status === 200){
      queryClient.invalidateQueries({ queryKey: ["productlists"] });
      toast({
        className: "bg-green-200 dark:text-black dark:bg-green-400",
        title: "Lyckat",
        description: `Produktlista  ${updatedProductList.productlistName} uppdaterades`,
      });

      console.log("Uppdaterad produktlista:", updatedProductList.productlistName);
    }
    } catch (error) {
      console.error("Failed to update product list:", error);
      toast({
        title: "Fel",
        description: "Misslyckades med att uppdatera produktlista.",
        className: "bg-red-200 dark:text-black dark:bg-red-400",
      });
    }
  };

  // Ta bort produktlista (DELETE)
  const DeleteProductsList = async (id: string) => {
    try {
      const response = await fetchWithAuth(
        `productlists/${tournamentId}/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response) {
        throw new Error("Failed to delete product list");
      }
      queryClient.invalidateQueries({ queryKey: ["productlists"] });
      toast({
        className: "bg-green-200 dark:text-black dark:bg-green-400",
        title: "Lyckat",
        description: `Produktlistan raderades`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att radera produktlista.",
        className: "bg-red-200 dark:text-black dark:bg-red-400",
      });
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
    <>
      <Toaster />
      <section>
        <div className="container mx-auto px-4 flex-row items-center">
          <h2 className="mt-8 text-2xl pb-2 mb-4">
            Skapa produkter och produktlistor
          </h2>
          <CreateProductButton
            onSave={(productName, amountPerPackage) =>
              CreateProduct(productName, amountPerPackage)
            }
          />

          <div className="mt-8">
            <h3 className="text-lg mb-7">Sparade produkter:</h3>

          <div className="grid grid-cols-6 mb-10 gap-2  w-full 2xl:w-3/4">
            {products?.products.map((product) => (
                
              
             
                <TooltipProvider key={product.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <UpdateProductButton
                        product={product}
                        onUpdate={UpdateProduct}
                        onDelete={() => product.id && DeleteProduct(product.id)}
                        key={product.id}
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
            <Accordion
              type="multiple"
              className=" w-full 2xl:w-3/4 dark:bg-slate-900"
            >
              {productlists?.map((productlist) => (
                <AccordionItem
                  key={productlist.id}
                  value={productlist.id}
                  className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-500"
                >
                  <AccordionTrigger className="text-lg font-medium hover:no-underline mr-2">
                    <div className="grid w-full grid-cols-1 xl:flex gap-4 justify-between items-center">
                      <label className="basis-1/4 font-medium  ">
                        {productlist.productlistName}
                      </label>
                      {/* <HandleProductListButton
                    key={productList.id}
                    productlist={productList}
                    onUpdate={updateProductList}
                  ></HandleProductListButton> */}

                      <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit basis-1/12">
                        <UpdateProductListButton
                          productlist={productlist}
                          tournamentProducts={products?.products || []}
                          onUpdate={(updatedList) =>
                            UpdateProductlist(updatedList)
                          } // Använder funktionen från ProductHandler
                        />

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <DeleteButton
                                id={productlist.id}
                                type="Productlist"
                                onDelete={() =>
                                  DeleteProductsList(productlist.id)
                                }
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
                    <div className="flex mt-5 font-semibold ml-4">
                      Produkter
                    </div>
                    {productlist.products && productlist.products.length > 0 ? (
                      <ul
                        className="grid grid-cols-3 gap-4 mt-2 p-4"
                        key={productlist.id}
                      >
                        {productlist.products.map(
                          (product: Product, index: number) => (
                            <li key={index}>{product.productName}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-300 ml-4">
                        Inga produkter tillagda i denna produktlista.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductHandler;
