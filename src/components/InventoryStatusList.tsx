import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Facility, Kiosk, Product } from "@/interfaces";
import { useState } from "react";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { groupBy } from "lodash-es";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { useParams } from "react-router-dom";
import { Checkbox } from "./ui/checkbox";
import { BellIcon } from "lucide-react";
import { NotifyItem } from "@/interfaces/notifyInfoItem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";

const InventoryStatusList = () => {
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;

  const { isLoading, error, data, isSuccess } = useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await fetchWithAuth(`facilities/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch facilities");
      }
      const dataResponse = await response.json();

      persistNewInventory(dataResponse);

      return dataResponse;
    },
  });

  const [inventoryStatus, setInventoryStatus] = useLocalStorage(
    "inventoryStatus",
    [] as {
      lastUpdated: string;
      hasNewData: boolean;
      facilityId: string;
      id: string;
    }[]
  );

  const persistNewInventory = (newItems: Facility[]) => {
    const oldInventory = inventoryStatus;

    const newInventory = newItems.flatMap((item) =>
      item.kiosks.map(({ id, inventoryDate, facilityId }) => {
        const oldKiosk = oldInventory.find((x) => x.id === id);

        if (!oldKiosk) {
          return {
            facilityId,
            id,
            lastUpdated: inventoryDate,
            hasNewData: false,
          };
        }

        const oldDate = new Date(oldKiosk.lastUpdated);
        const newDate = new Date(inventoryDate);

        return {
          facilityId,
          id,
          hasNewData: oldKiosk.hasNewData || newDate > oldDate,
          lastUpdated: inventoryDate,
        };
      })
    );

    setInventoryStatus(newInventory);
  };

  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [notifyContactPerson, setNotifyContactPerson] = useState<NotifyItem[]>(
    []
  );

  function calculateTotal(product: Product) {
    const { amountPieces, amountPackages, amountPerPackage } = product;
    product.total = amountPieces! + amountPackages! * amountPerPackage!;
    return product.total;
  }

  if (isSuccess) {
    data.forEach((item) => {
      item.kiosks.forEach((kiosk) => {
        kiosk.products.forEach((product) => {
          if (product.amountPerPackage) {
            const result = calculateTotal(product);
            product.total = result;
          }
        });
      });
    });
  }

  const facilityStatus = groupBy(inventoryStatus, (x) => x.facilityId);
  const kioskStatus = groupBy(inventoryStatus, (x) => x.id);

  const sortKiosksByInventoryDate = (kiosks: Kiosk[]) => {
    return kiosks.sort((a, b) => {
      const dateA = new Date(a.inventoryDate!);
      const dateB = new Date(b.inventoryDate!);
      return dateA > dateB ? -1 : 1; // Senast inventering hamnar först
    });
  };

  const toggleExpandAll = () => {
    if (!isSuccess || !data) {
      return; // Gör inget om isSuccess är false eller data saknas
    }
    if (expandedItems.length === 0) {
      const allItems = data.map((facility) => facility.id);
      setExpandedItems(allItems);
      setTimeout(() => {
        setInventoryStatus([]);
      }, 2000);
    } else {
      setExpandedItems([]);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }

  const notifyInfo = (kiosk: Kiosk): NotifyItem => {
    const facility = data.find((item) => item.facilityName === kiosk.facility); // Hitta rätt facility

    if (!facility) {
      return {
        kioskId: kiosk.id,
        facilityName: "",
        kioskName: "",
        contactPersons: [],
      };
    }

    return {
      kioskId: kiosk.id,
      facilityName: facility.facilityName,
      kioskName: kiosk.kioskName,
      contactPersons: facility.contactPersons.filter(
        (contactPerson) => contactPerson.role === "Planansvarig"
      ),
    };
  };

  console.log(notifyContactPerson);

  console.log(inventoryStatus);

  const sendNotifications = async () => {
    try {
      const response = await fetchWithAuth(`send-sns-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notifications: notifyContactPerson.map((item) => ({
            kioskName: item.kioskName,
            facilityName: item.facilityName,
            contactPersons: item.contactPersons.map((contact) => {
              let phone = contact.phone;

              if (phone.startsWith("00")) {
                phone = phone.replace(/^00/, "+46");
              }

              if (phone.startsWith("+46")) {
                return { name: contact.name, phone };
              }

              return { name: contact.name, phone: `+46${phone}` };
            }),
          })),
        }),
      });

      if (!response) {
        toast({
          title: "Fel",
          description: "Misslyckades med att skicka notifiering.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Kunde inte skicka notifiering");
      }

      toast({
        title: "Lyckat",
        description: "Notifieringar skickades iväg till planansvariga.",
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
      });
    } catch (error) {
      console.error("Fel vid notifiering:", error);
      toast({
        title: "Fel",
        description: "Misslyckades med att skicka notifiering, försök igen.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
    }
  };

  const getKioskClasses = (id: string) => {
    return kioskStatus[id]?.some((x) => x.hasNewData)
      ? "text-orange-400 font-bold transition-all delay-150 duration-300 ease-in-out"
      : "font-medium transition-all delay-150 duration-300 ease-in-out";
  };

  const getFacilityClasses = (id: string) => {
    return facilityStatus[id]?.some((x) => x.hasNewData)
      ? "bg-orange-400 w-2 h-2 rounded-full opacity-100 transition-all delay-150 duration-500 ease-in-out absolute -right-3 top-3"
      : "bg-orange-400  w-2 h-2 opacity-0 rounded-full transition-all delay-150 duration-500 ease-in-out absolute -right-3 top-[10px]";
  };

  return (
    <div className="2xl:w-3/4 w-full ml-2">
      <div className="ml-auto w-fit flex">
        <Toaster />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={sendNotifications}
                className="mb-4 mr-2"
                disabled={notifyContactPerson.length === 0}
              >
                Skicka notifieringar
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {notifyContactPerson.length === 0 ? (
                <p>Välj en kiosk att notifiera</p>
              ) : (
                <p>Skicka en påminnelse om inventering till planansvariga</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button onClick={toggleExpandAll} className="mb-4">
          {expandedItems.length === 0 ? "Expandera alla" : "Minimera alla"}
        </Button>
      </div>
      <Accordion
        type="multiple"
        value={expandedItems}
        onValueChange={(newValue) => setExpandedItems(newValue)}
        className="flex flex-col mb-7 dark:bg-slate-900"
      >
        {data.map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="p-3 border border-gray-200 rounded-md shadow 0 dark:border-slate-500 "
          >
            <AccordionTrigger
              className="text-lg font-medium"
              onClick={() =>
                setTimeout(() => {
                  setInventoryStatus((prev) =>
                    prev.filter(
                      (inventoryItem) => inventoryItem.facilityId !== item.id
                    )
                  );
                }, 2000)
              }
            >
              <div className="flex relative">
                <p>{item.facilityName}</p>
                <div className={getFacilityClasses(item.id)}></div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {sortKiosksByInventoryDate(item.kiosks).map((kiosk) => {
                const info = notifyInfo(kiosk);

                return (
                  <div key={kiosk.id}>
                    <div className="mb-3 mt-10">
                      <div className="flex flex-col p-3 border-b-4 rounded-xl w-full -mb-2 dark:bg-slate-800 dark:border-slate-500">
                        <div className="flex justify-between">
                          <h3 className={getKioskClasses(kiosk.id)}>
                            {kiosk.kioskName}
                          </h3>
                          {info.contactPersons.length > 0 ? (
                            <div className="flex place-content-end gap-3">
                              <div className="font-medium">
                                Välj kiosk att notifiera
                              </div>
                              <BellIcon className="w-4 h-4" />
                              <Checkbox
                                id={info.facilityName}
                                checked={notifyContactPerson.some(
                                  (i) => i.kioskId === kiosk.id
                                )}
                                onCheckedChange={(checked) => {
                                  setNotifyContactPerson((prev) =>
                                    checked
                                      ? [...prev, info]
                                      : prev.filter(
                                          (i) => i.kioskId !== kiosk.id
                                        )
                                  );
                                }}
                              />
                            </div>
                          ) : (
                            <p>Planansvarig kontaktperson saknas</p>
                          )}
                        </div>

                        {kiosk.firstInventoryMade ? (
                          <h2>
                            Senast inventering:{" "}
                            {new Intl.DateTimeFormat("sv-SE", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(new Date(kiosk.inventoryDate))}
                          </h2>
                        ) : (
                          <h2>
                            Ingen inventering har gjorts ännu hos{" "}
                            {kiosk.kioskName} på {kiosk.facility}.
                          </h2>
                        )}
                      </div>
                    </div>

                    {kiosk.firstInventoryMade && (
                      <div className="w-full mt-2">
                        <div className="grid grid-cols-4 gap-4 font-bold text-gray-600 py-2 px-4 dark:text-gray-300">
                          <p>Namn</p>
                          <p>Styckvaror</p>
                          <p>Obrutna förpackningar</p>
                          <p className="text-center">Totalt</p>
                        </div>

                        {kiosk.products
                          .slice()
                          .sort((a, b) =>
                            a.productName.localeCompare(b.productName)
                          )
                          .map((product, productIndex) => {
                            const isOutOfStock =
                              product.amountPieces === 0 ||
                              product.amountPackages === 0;

                            return (
                              <div
                                key={product.id}
                                className={`px-4 grid grid-cols-4 gap-4 py-2 text-gray-700 border-b border-gray-200 hover:bg-gray-200 
                  dark:bg-slate-800 dark:text-gray-300 dark:border-slate-500 dark:hover:bg-slate-700 
                  ${
                    productIndex % 2 === 0
                      ? "bg-gray-100"
                      : "bg-white dark:bg-slate-900"
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
                                  {product.amountPieces} st
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
                    )}
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default InventoryStatusList;
