import CreateProductButton from "@/components/CreateProductButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpdateProductButton from "@/components/UpdateProductButton";
import { Product } from "@/interfaces";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import UpdateProductListButton from "@/components/UpdateProductListButton";
import DeleteButton from "@/components/DeleteButton";
import { Toaster } from "@/components/ui/toaster";
import ProductInfoComponent from "@/components/ProductInfoComponent";
import { useGetAllProductlists, useGetAllProducts } from "@/hooks/use-query";
import { deleteProductList } from "@/api/functions/deleteProductlist";
import CreateProductListButton from "@/components/CreateProductListButton";

function ProductHandler() {
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;

  const { data: products, isLoading, error } = useGetAllProducts(tournamentId!);

  const {
    data: productlists,
    isLoading: isLoadingProductLists,
    error: errorProductList,
  } = useGetAllProductlists(tournamentId!);

  if (isLoading || isLoadingProductLists) {
    return (
      <div className="container mx-auto px-5 py-10 flex justify-center items-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          ></div>
          <p className="mt-4 text-gray-500">Laddar turneringsdata...</p>
        </div>
      </div>
    );
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
          <div className="flex justify-between w-3/4 text-start ">
            <h2 className="mt-8 text-2xl pb-2 mb-4 mr-2">Produkthantering</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <ProductInfoComponent />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Information om produkthantering</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CreateProductButton tournamentId={tournamentId!} />

          <div className="mt-8">
            <h3 className="text-lg mb-7">Skapade produkter:</h3>

            <div className="grid grid-cols-4 mb-10 gap-2 w-full 2xl:w-3/4">
              {products?.products
                .slice()
                .sort((a, b) => a.productName.localeCompare(b.productName))
                .map((product) => (
                  <TooltipProvider key={product.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <UpdateProductButton
                          product={product}
                          tournamentId={tournamentId!}
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
          <div className="border border-t-2 mb-8 dark:border-slate-600 w-3/4"></div>
          <CreateProductListButton tournamentId={tournamentId!} />
          <div className="mt-8">
            <h3 className="text-lg mb-7">Skapade produktlistor:</h3>
            <Accordion
              type="multiple"
              className=" w-full 2xl:w-3/4 dark:bg-slate-800"
            >
              {productlists?.map((productlist) => (
                <AccordionItem
                  key={productlist.id}
                  value={productlist.id}
                  className="p-4 border border-gray-200 rounded-md shadow dark:border-slate-500"
                >
                  <AccordionTrigger className="text-lg font-medium hover:no-underline mr-2">
                    <div className="grid w-full grid-cols-1 xl:flex gap-4 justify-between items-center">
                      <label className="basis-1/4 font-medium cursor-pointer">
                        {productlist.productlistName}
                      </label>
                      <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit basis-1/12 mr-5">
                        <UpdateProductListButton
                          productlist={productlist}
                          tournamentProducts={products?.products || []}
                          tournamentId={tournamentId!}
                        />

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <DeleteButton
                                id={productlist.id}
                                type="Productlist"
                                onDelete={() =>
                                  deleteProductList(
                                    productlist.id,
                                    tournamentId!
                                  )
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
                        {productlist.products
                          .slice()
                          .sort((a, b) =>
                            a.productName.localeCompare(b.productName)
                          )
                          .map((product: Product, index: number) => (
                            <li key={index}>{product.productName}</li>
                          ))}
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
