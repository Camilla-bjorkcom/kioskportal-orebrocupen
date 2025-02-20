import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useGetAllStorageInventories } from "@/hooks/use-query";
import { sortByInventoryDate } from "@/utils/sortByDate";
import { useState } from "react";
import { useParams } from "react-router-dom";

const InventoryStatusStorage = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;

  const { data, isLoading, error, isSuccess } = useGetAllStorageInventories(
    tournamentId!
  );

  if (isLoading) {
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

  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }
  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  const toggleExpandAll = () => {
    if (!isSuccess || !data) {
      return;
    }
    if (expandedItems.length === 0) {
      const allItems = Object.entries(data).map(([date, value]) => date);
      setExpandedItems(allItems);
    } else {
      setExpandedItems([]);
    }
  };

  return (
    <div className="container mx-auto ">
      <h2 className="mt-8 text-2xl pb-2 ml-2">Huvudlagrets inventeringar</h2>
      <div className="2xl:w-3/4 w-full ml-2">
        <div className="ml-auto w-fit flex">
          <Button onClick={toggleExpandAll} className="mb-4">
            {expandedItems.length === 0 ? "Expandera alla" : "Minimera alla"}
          </Button>
        </div>
        <Accordion
          type="multiple"
          value={expandedItems}
          onValueChange={(newValue) => setExpandedItems(newValue)}
          className="flex flex-col gap-3 mb-7"
        >
          {Object.entries(data).map(([date, inventories]) => (
            <AccordionItem
              key={date}
              value={date}
              className="p-3 border border-gray-200 rounded-md shadow hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-500"
            >
              <AccordionTrigger>
                <div className="flex flex-col gap-2">
                  <h2>
                    {new Date(date).toLocaleString("sv-SE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour12: false,
                    })}
                  </h2>
                  <p className="text-xs font-normal hover:no-underline">
                    ({inventories.length} inventeringar)
                  </p>
                </div>
              </AccordionTrigger>

              {sortByInventoryDate(inventories).map((inventory) => (
                <AccordionContent key={inventory.id}>
                  <div className="mb-7">
                    <div className="flex flex-col bg-gray-50 p-3 border-b-2 rounded-xl w-full -mb-2 dark:bg-slate-800 dark:border-slate-400">
                      <h2 className="">
                        Inventering gjord kl: {""}
                        {new Intl.DateTimeFormat("sv-SE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(inventory.inventoryDate))}
                      </h2>
                    </div>
                    <div className="w-full mt-2">
                      <div className="grid grid-cols-4 gap-4 font-bold text-gray-600 py-2 px-4 dark:text-gray-200">
                        <p>Namn</p>
                        <p>Obrutna förpackningar</p>
                        <p className="text-center">Totalt</p>
                      </div>

                      {inventory.products
                        .slice()
                        .sort((a, b) =>
                          a.productName.localeCompare(b.productName)
                        )
                        .map((product, productIndex) => {
                          const isOutOfStock = product.amountPackages === 0;

                          const total =
                          product.amountPackages && product.amountPerPackage
                            ? product.amountPackages * product.amountPerPackage
                            : 0;
                          return (
                            <div
                              key={product.id}
                              className={`px-4 grid grid-cols-4 gap-4 py-2 text-gray-700 border-b border-gray-200 hover:bg-gray-200 dark:bg-slate-800 dark:border-slate-500 dark:text-gray-200 dark:hover:bg-slate-600 ${
                                productIndex % 2 === 0
                                  ? "bg-gray-100"
                                  : "bg-white dark:bg-slate-800"
                              }`}
                            >
                              <p
                                className={
                                  isOutOfStock
                                    ? "text-red-500 font-semibold"
                                    : ""
                                }
                              >
                                {product.productName}
                              </p>
                              <p
                                className={
                                  isOutOfStock
                                    ? "text-red-500 font-semibold"
                                    : ""
                                }
                              >
                                {product.amountPackages} st
                              </p>
                              {product.amountPackages ? (
                                <p
                                  className={
                                    isOutOfStock
                                      ? "text-red-500 text-center font-semibold"
                                      : "text-center"
                                  }
                                >
                                  {total > 0 ? `${total} st` : "N/A"}  
                                </p> //fixat totalen
                              ) : (
                                <p className="text-center">N/A</p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </AccordionContent>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default InventoryStatusStorage;
