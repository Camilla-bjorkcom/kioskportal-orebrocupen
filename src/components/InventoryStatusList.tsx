import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

const InventoryStatusList = () => {
  const inventoryDataOne = [
    { name: "Kexchoklad", quantity: "20 st", unbroken: "5 st" },
    { name: "Coca-cola", quantity: "3 st", unbroken: "2 st" },
    { name: "Festis päron", quantity: "2 st", unbroken: "1 st" },
    { name: "Festis hallon", quantity: "3 st", unbroken: "2 st" },
    { name: "Korv", quantity: "0 st", unbroken: "0 st" },
    { name: "Korvbröd", quantity: "6 st", unbroken: "3 st" },
    { name: "Lakritsstång", quantity: "10 st", unbroken: "5 st" },
    { name: "Banan", quantity: "10 st", unbroken: "5 st" },
    { name: "Äpple", quantity: "15 st", unbroken: "10 st" },
    { name: "Apelsin", quantity: "10 st", unbroken: "5 st" },
  ];

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const facilityName = "Rosta Gärde";
  const kioskNameOne = "Kiosk 1";

  const toggleExpandAll = () => {
    if (expandedItems.length === 0) {
      setExpandedItems(["item-1", "item-2"]);
    } else {
      setExpandedItems([]);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-t-md">
        <h2 className="text-lg font-bold">{facilityName}</h2>
        <button onClick={toggleExpandAll} className="underline">
          {expandedItems.length === 0 ? "Expandera alla" : "Minimera alla"}
        </button>
      </div>
      <Accordion
        type="multiple"
        value={expandedItems}
        onValueChange={(newValue) => setExpandedItems(newValue)}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>{kioskNameOne}</AccordionTrigger>
          <AccordionContent>
            <div className="w-full border-t border-gray-300 mt-2">
              <div className="grid grid-cols-3 gap-4 font-bold text-gray-600 py-2">
                <p>Namn</p>
                <p>Styckvaror</p>
                <p>Obrutna förpackningar</p>
              </div>

              {inventoryDataOne.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 py-2 text-gray-700 border-b border-gray-200"
                >
                  <p>{item.name}</p>
                  <p>{item.quantity}</p>
                  <p>{item.unbroken}</p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InventoryStatusList;
