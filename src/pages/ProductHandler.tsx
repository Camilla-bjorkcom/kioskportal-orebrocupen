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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Product, ProductList } from "@/interfaces";
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

function ProductHandler() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [productlists, setProductLists] = useState<ProductList[]>([]);
  const tournamentId = id;

  const { isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      console.log("TurneringsID", tournamentId);
      setProducts(data);
      return data;
    },
  });

  const { isLoading: isLoadingProductLists, error: errorProductList } =
    useQuery<ProductList[]>({
      queryKey: ["productslists"],
      queryFn: async () => {
        const response = await fetch("http://localhost:3000/productslists");
        if (!response.ok) {
          throw new Error("Failed to fetch product lists");
        }
        const data = await response.json();
        console.log(data);
        setProductLists(data);

        return data;
      },
    });

  const SaveProduct = async (
    productname: string,
    amountPerPackage: number,
    tournamentId: string
  ) => {
    try {
      const response = await fetch("http://localhost:3000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productname: productname,
          amountPerPackage: amountPerPackage,
          tournamentId: tournamentId,
        }),
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
  const updateProductList = (updatedList: ProductList) => {
    setProductLists((prev) =>
      prev.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  };

  // Spara ny produktlista (POST)
  const SaveProductList = async (
    productListName: string,
    tournamentId: string
  ) => {
    try {
      const response = await fetch("http://localhost:3000/productslists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productlistname: productListName,
          tournamentId: tournamentId,
          products: [],
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save product list");
      }
      const newProductList = await response.json();
      setProductLists((prev) => [...prev, newProductList]); // Lägg till ny lista i state
    } catch (error) {
      console.error(error);
    }
  };

  // Ta bort produktlista (DELETE)
  const DeleteProductsList = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/productslists/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product list");
      }
      setProductLists((prev) => prev.filter((list) => list.id !== id)); // Uppdatera state lokalt
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

  const productListsByTournament = productlists.filter(
    (productlist) => productlist.tournamentId === tournamentId
  );
  const productsByTournament = products.filter(
    (product) => product.tournamentId === tournamentId
  );

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
          <h3 className="text-lg mb-7">Sparade produkter:</h3>

          <div className="grid grid-cols-4 mb-10 gap-2">
            {productsByTournament.map((product) => (
              <TooltipProvider key={product.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <UpdateProductButton
                      product={product}
                      onUpdate={UpdateProduct}
                      onDelete={DeleteProduct}
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
          onSave={(productListName, tournamentId) => {
            SaveProductList(productListName, tournamentId);
          }}
          tournamentId={tournamentId || ""}
        />
        <div className="mt-8">
        <Accordion type="multiple"  className=" w-full 2xl:w-3/4">
          {productListsByTournament.map((productList) => (
            <AccordionItem
              key={productList.id}
              value={productList.id}
              className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
            >
              <AccordionTrigger className="text-lg font-medium hover:no-underline mr-2">
                <div className="grid w-full grid-cols-1 xl:flex gap-4 justify-between items-center">
                  <label className="basis-1/4 font-medium hover:text-slate-800">
                    {productList.productlistname}
                  </label>
                  {/* <HandleProductListButton
                    key={productList.id}
                    productlist={productList}
                    onUpdate={updateProductList}
                  ></HandleProductListButton> */}

                  <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit basis-1/12">
                   
                          <UpdateProductListButton
                            onUpdate={(updatedProductList) => updateProductList(updatedProductList)}
                            tournamentProducts={productsByTournament}
                            
                            
                             

                            productlist={productList}
                          />
                        
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <DeleteButton
                            id={productList.id}
                            type="ProductList"
                            onDelete={() => DeleteProductsList(productList.id)}
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
                        {productList.products && productList.products.length > 0 ? (
                          <ul className="grid grid-cols-3 gap-4 mt-2">
                            {productList.products.map(
                              (product: Product, index: number) => (
                                <li key={index}>{product.productname}</li>
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
