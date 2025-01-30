import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type StorageInventory = {
  id: string;
  inventoryDate: string;
  products: Products[];
};

interface Products {
  id: number;
  productName: string;
  amountPackages: number;
  total: number;
}


const mockStorageInventory: StorageInventory[] = [
  {
    id: "1",
    inventoryDate: "2025-01-01",
    products: [
      {
        id: 101,
        productName: "Chips",
        amountPackages: 20,
        total: 200,
      },
      {
        id: 102,
        productName: "Soda",
        amountPackages: 50,
        total: 500,
      },
    ],
  },
  {
    id: "2",
    inventoryDate: "2025-01-15",
    products: [
      {
        id: 103,
        productName: "Candy",
        amountPackages: 30,
        total: 300,
      },
      {
        id: 104,
        productName: "Juice",
        amountPackages: 25,
        total: 250,
      },
      {
        id: 105,
        productName: "Water",
        amountPackages: 40,
        total: 400,
      },
    ],
  },
  {
    id: "3",
    inventoryDate: "2025-01-22",
    products: [
      {
        id: 106,
        productName: "Hotdogs",
        amountPackages: 15,
        total: 150,
      },
      {
        id: 107,
        productName: "Bread",
        amountPackages: 35,
        total: 350,
      },
    ],
  },
];

const InventoryStatusStorage = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const mockdata = true;

  const { data, isLoading, error, isSuccess } = useQuery<StorageInventory[]>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      if(mockdata){
        const mockData = mockStorageInventory
        return mockData;
      }

      const response = await fetchWithAuth(`tournaments/{tid}/storage`);
      if(!response){
        throw new Error("Failed to fetch products");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }
  if (error) {
    return <div>Error: {String(error)}</div>;
  }
 
 
  const toggleExpandAll = () => {
    if (!isSuccess || !data) {
      return; // Gör inget om isSuccess är false eller data saknas
    }
    if (expandedItems.length === 0) {
      const allItems = data.map((item) => item.id);
      setExpandedItems(allItems);
    } else {
      setExpandedItems([]);
    }
  };
const sortByInventoryDate = (storage: StorageInventory[]) => {
    return storage.sort((a, b) => {
      const dateA = new Date(a.inventoryDate!);
      const dateB = new Date(b.inventoryDate!);
      return dateA > dateB ? -1 : 1; // Senast inventering hamnar först
    });
  };

  return (
    <div className="container mx-auto ">
      <h2 className="mt-8 text-2xl pb-2 ml-2">Huvudlagrets inventeringar</h2>
      <div className=" 2xl:w-3/4 w-full ml-2">
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
  {
  sortByInventoryDate(data).map((inventory) => (
            <AccordionItem
            key={inventory.id}
            value={inventory.id}
            className="p-3 border border-gray-200 rounded-md shadow hover:bg-gray-50"
          >
            <AccordionTrigger
              className="text-lg font-medium hover:text-slate-800"
            >
              <p>{inventory.inventoryDate}</p>
            </AccordionTrigger>
            <AccordionContent>
                <div key={inventory.id} className="mb-7">
                  <div className="flex flex-col bg-gray-50 p-3 border-b-2 rounded-xl w-full -mb-2">

                    <h2 className="">
                      Senast inventering:{" "}
                      {new Intl.DateTimeFormat("sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(inventory.inventoryDate))}
                    </h2>
                  </div>
                  <div className="w-full mt-2">
                    {/* Rubriker för kolumner */}
                    <div className="grid grid-cols-4 gap-4 font-bold text-gray-600 py-2 px-4">
                      <p>Namn</p>
                      <p>Obrutna förpackningar</p>
                      <p className="text-center">Totalt</p>
                    </div>

                    {/* Lista över produkter */}

                    {inventory.products.map((product, productIndex) => {
                      const isOutOfStock =
                        product.amountPackages === 0;
                      return (
                        <div
                          key={product.id}
                          className={`px-4 grid grid-cols-4 gap-4 py-2 text-gray-700 border-b border-gray-200 hover:bg-gray-200 ${
                            productIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                          }`}
                        >
                          <p
                            className={
                              isOutOfStock ? "text-red-500 font-semibold" : ""
                            }
                          >
                            {product.productName}
                          </p>
                         
                          <p
                            className={
                              isOutOfStock ? "text-red-500 font-semibold" : ""
                            }
                          >
                            {product.amountPackages} st
                          </p>
                          {product.total ? (
                            <p
                              className={
                                isOutOfStock
                                  ? "text-red-500 text-center font-semibold"
                                  : "text-center"
                              }
                            >
                              {product.total} st
                            </p>
                          ) : (
                            <p className="text-center">N/A</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
            </AccordionContent>
          </AccordionItem>
        ))
      }
      </Accordion>
      </div>
    </div>
  );
};

export default InventoryStatusStorage;
