import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/interfaces";
import { useState } from "react";
import { Button } from "./ui/button";

interface InventoryStatusKiosks {
  kioskId: string;
  kioskName: string;
  facilityName: string;
  facilityId: string;
  inventoryDate: string;
  products: Product[];
}

const InventoryStatusList = () => {
  const inventoryData: InventoryStatusKiosks[] = [
    {
      kioskId: "123",
      kioskName: "Kiosk 1",
      facilityName: "Trängen",
      facilityId: "001",
      inventoryDate: "2025-01-21 15:00",
      products: [
        {
          id: "1234",
          productName: "Kexchoklad",
          amountPieces: 20,
          amountPackages: 6,
        },
        {
          id: "1235",
          productName: "Coca-cola",
          amountPieces: 20,
          amountPackages: 0,
          amountPerPackage: 10,
        },
        {
          id: "1236",
          productName: "Festis päron",
          amountPieces: 5,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1237",
          productName: "Festis hallon",
          amountPieces: 20,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "123",
      kioskName: "Kiosk 1",
      facilityName: "Trängen",
      facilityId: "001",
      inventoryDate: "2025-01-21 15:00",
      products: [
        {
          id: "1234",
          productName: "Kexchoklad",
          amountPieces: 20,
          amountPackages: 6,
        },
        {
          id: "1235",
          productName: "Coca-cola",
          amountPieces: 20,
          amountPackages: 0,
          amountPerPackage: 10,
        },
        {
          id: "1236",
          productName: "Festis päron",
          amountPieces: 5,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1237",
          productName: "Festis hallon",
          amountPieces: 20,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "123",
      kioskName: "Kiosk 1",
      facilityName: "Rosta",
      facilityId: "002",
      inventoryDate: "2025-01-21 15:00",
      products: [
        {
          id: "1234",
          productName: "Kexchoklad",
          amountPieces: 20,
          amountPackages: 6,
        },
        {
          id: "1235",
          productName: "Coca-cola",
          amountPieces: 20,
          amountPackages: 0,
          amountPerPackage: 10,
        },
        {
          id: "1236",
          productName: "Festis päron",
          amountPieces: 5,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1237",
          productName: "Festis hallon",
          amountPieces: 20,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "123",
      kioskName: "Kiosk 1",
      facilityName: "Rosta",
      facilityId: "002",
      inventoryDate: "2025-01-21 15:00",
      products: [
        {
          id: "1234",
          productName: "Kexchoklad",
          amountPieces: 20,
          amountPackages: 6,
        },
        {
          id: "1235",
          productName: "Coca-cola",
          amountPieces: 20,
          amountPackages: 0,
          amountPerPackage: 10,
        },
        {
          id: "1236",
          productName: "Festis päron",
          amountPieces: 5,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1237",
          productName: "Festis hallon",
          amountPieces: 20,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "123",
      kioskName: "Kiosk 1",
      facilityName: "Björkvalla",
      facilityId: "004",
      inventoryDate: "2025-01-21 15:00",
      products: [
        {
          id: "1234",
          productName: "Kexchoklad",
          amountPieces: 20,
          amountPackages: 6,
        },
        {
          id: "1235",
          productName: "Coca-cola",
          amountPieces: 20,
          amountPackages: 0,
          amountPerPackage: 10,
        },
        {
          id: "1236",
          productName: "Festis päron",
          amountPieces: 5,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1237",
          productName: "Festis hallon",
          amountPieces: 20,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "123",
      kioskName: "Kiosk 1",
      facilityName: "Pettersberg",
      facilityId: "003",
      inventoryDate: "2025-01-21 15:00",
      products: [
        {
          id: "1234",
          productName: "Kexchoklad",
          amountPieces: 20,
          amountPackages: 6,
        },
        {
          id: "1235",
          productName: "Coca-cola",
          amountPieces: 20,
          amountPackages: 0,
          amountPerPackage: 10,
        },
        {
          id: "1236",
          productName: "Festis päron",
          amountPieces: 5,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1237",
          productName: "Festis hallon",
          amountPieces: 20,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "123",
      kioskName: "Kiosk 1",
      facilityName: "Pettersberg",
      facilityId: "003",
      inventoryDate: "2025-01-21 15:00",
      products: [
        {
          id: "1234",
          productName: "Kexchoklad",
          amountPieces: 20,
          amountPackages: 6,
        },
        {
          id: "1235",
          productName: "Coca-cola",
          amountPieces: 20,
          amountPackages: 0,
          amountPerPackage: 10,
        },
        {
          id: "1236",
          productName: "Festis päron",
          amountPieces: 5,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1237",
          productName: "Festis hallon",
          amountPieces: 20,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "1235",
      kioskName: "Kiosk 2",
      facilityName: "Trängen",
      facilityId: "001",
      inventoryDate: "2025-01-21 11:00",
      products: [
        {
          id: "1234",
          productName: "Kexchoklad",
          amountPieces: 20,
          amountPackages: 6,
        },
        {
          id: "1235",
          productName: "Coca-cola",
          amountPieces: 20,
          amountPackages: 0,
          amountPerPackage: 10,
        },
        {
          id: "1236",
          productName: "Festis päron",
          amountPieces: 5,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1237",
          productName: "Festis hallon",
          amountPieces: 20,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "124",
      kioskName: "Kiosk 2",
      facilityName: "Rosta",
      facilityId: "002",
      inventoryDate: "2025-01-21 13:00",
      products: [
        {
          id: "1241",
          productName: "Korv",
          amountPieces: 15,
          amountPackages: 4,
          amountPerPackage: 10,
        },
        {
          id: "1242",
          productName: "Korvbröd",
          amountPieces: 10,
          amountPackages: 3,
          amountPerPackage: 10,
        },
        {
          id: "1243",
          productName: "Lakritsstång",
          amountPieces: 5,
          amountPackages: 2,
          amountPerPackage: 10,
        },
        {
          id: "1244",
          productName: "Banan",
          amountPieces: 25,
          amountPackages: 3,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "124",
      kioskName: "Kiosk 4",
      facilityName: "Rosta",
      facilityId: "002",
      inventoryDate: "2025-01-21 10:00",
      products: [
        {
          id: "1241",
          productName: "Korv",
          amountPieces: 15,
          amountPackages: 4,
          amountPerPackage: 10,
        },
        {
          id: "1242",
          productName: "Korvbröd",
          amountPieces: 10,
          amountPackages: 3,
          amountPerPackage: 10,
        },
        {
          id: "1243",
          productName: "Lakritsstång",
          amountPieces: 5,
          amountPackages: 2,
          amountPerPackage: 10,
        },
        {
          id: "1244",
          productName: "Banan",
          amountPieces: 25,
          amountPackages: 3,
          amountPerPackage: 10,
        },
      ],
    },
    {
      kioskId: "125",
      kioskName: "Kiosk 3",
      facilityName: "Rosta",
      facilityId: "002",
      inventoryDate: "2025-01-21 15:00",
      products: [
        {
          id: "1251",
          productName: "Äpple",
          amountPieces: 8,
          amountPackages: 5,
          amountPerPackage: 10,
        },
        {
          id: "1252",
          productName: "Apelsin",
          amountPieces: 12,
          amountPackages: 4,
          amountPerPackage: 10,
        },
        {
          id: "1253",
          productName: "Coca-cola",
          amountPieces: 18,
          amountPackages: 2,
          amountPerPackage: 10,
        },
        {
          id: "1254",
          productName: "Festis hallon",
          amountPieces: 10,
          amountPackages: 1,
          amountPerPackage: 10,
        },
      ],
    },
  ];

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  function calculateTotal(product: Product) {
    const { amountPieces, amountPackages, amountPerPackage } = product;
    product.total = amountPieces! + amountPackages! * amountPerPackage!;
    return product.total;
  }
  inventoryData.forEach((item) => {
    item.products.forEach((product) => {
      if (product.amountPerPackage != undefined || null || 0) {
        const result = calculateTotal(product);
        product.total = result;
      }
    });
  });

  // Funktion för att gruppera kiosker per facility
  const groupByFacility = (data: InventoryStatusKiosks[]) => {
    return data.reduce((acc, kiosk) => {
      if (!acc[kiosk.facilityId]) {
        acc[kiosk.facilityId] = {
          facilityName: kiosk.facilityName,
          kiosks: [],
        };
      }
      acc[kiosk.facilityId].kiosks.push(kiosk);
      return acc;
    }, {} as Record<string, { facilityName: string; kiosks: InventoryStatusKiosks[] }>);
  };

  const groupedData = groupByFacility(inventoryData);

  const sortKiosksByInventoryDate = (kiosks: InventoryStatusKiosks[]) => {
    return kiosks.sort((a, b) => {
      const dateA = new Date(a.inventoryDate);
      const dateB = new Date(b.inventoryDate);
      return dateA > dateB ? -1 : 1; // Senast inventering hamnar först
    });
  };

  const toggleExpandAll = () => {
    if (expandedItems.length === 0) {
      const allItems = Object.keys(groupedData).map(
        (facilityId) => `facility-${facilityId}`
      );
      setExpandedItems(allItems);
    } else {
      setExpandedItems([]);
    }
  };

  return (
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
        {Object.entries(groupedData).map(
          ([facilityId, { facilityName, kiosks }]) => (
            <AccordionItem
              key={facilityId}
              value={`facility-${facilityId}`}
              className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
            >
              <AccordionTrigger className="text-lg font-medium hover:text-slate-800">
                {facilityName}
              </AccordionTrigger>
              <AccordionContent>
                {sortKiosksByInventoryDate(kiosks).map((kiosk) => (
                  <div key={kiosk.kioskId} className="mb-7">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{kiosk.kioskName}</h3>
                      <h2 className="">
                        Senast inventering gjord: {kiosk.inventoryDate}
                      </h2>
                    </div>
                    <div className="w-full border-t border-gray-300 mt-2">

                      {/* Rubriker för kolumner */}
                      <div className="grid grid-cols-4 gap-4 font-bold text-gray-600 py-2 px-4">
                        <p>Namn</p>
                        <p>Styckvaror</p>
                        <p>Obrutna förpackningar</p>
                        <p className="text-center">Totalt</p>
                      </div>

                      {/* Lista över produkter */}
                      {kiosk.products.map((product, productIndex) => {
                        return (
                          <div
                            key={product.id}
                            className={`px-4 grid grid-cols-4 gap-4 py-2 text-gray-700 border-b border-gray-200 hover:bg-gray-200 ${
                              productIndex % 2 === 0
                                ? "bg-gray-100"
                                : "bg-white"
                            }`}
                          >
                            <p>{product.productName}</p>
                            <p>{product.amountPieces} st</p>
                            <p>{product.amountPackages} st</p>
                            {product.total ? (
                              <p className="text-center">{product.total} st</p>
                            ) : (
                              <p className="text-center">N/A</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          )
        )}
      </Accordion>
    </div>
  );
};

export default InventoryStatusList;
