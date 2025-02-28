import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Facility, Kiosk } from "@/interfaces";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useLocalStorage } from "usehooks-ts";
import { groupBy } from "lodash-es";
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
import { Toaster } from "./ui/toaster";
import { useGetAllFacilities } from "@/hooks/use-query";
import { calculateTotal } from "@/utils/calculateTotalAmountKiosk";
import { sendNotifications } from "@/api/functions/sendNotifications";
import { badToast, okToast } from "@/utils/toasts";
import { NoResponseError } from "@/api/functions/apiErrors";
import { sortByInventoryDate } from "@/utils/sortByDate";

const InventoryStatusListKiosks = () => {
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [notifyContactPerson, setNotifyContactPerson] = useState<NotifyItem[]>(
    []
  );

  const { data, isLoading, error, isSuccess } = useGetAllFacilities(
    tournamentId!
  );

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

  useEffect(() => {
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

      persistNewInventory(data);
    }
  }, [isSuccess, data]);

  const facilityStatus = groupBy(inventoryStatus, (x) => x.facilityId);
  const kioskStatus = groupBy(inventoryStatus, (x) => x.id);

  const toggleExpandAll = () => {
    if (!isSuccess || !data) {
      return;
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

  const notifyInfoItem = (kiosk: Kiosk): NotifyItem => {
    const facility = data.find((item) => item.facilityName === kiosk.facility);

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
                onClick={() =>
                  sendNotifications(notifyContactPerson)
                    .then(() =>
                      okToast(
                        "Notifieringar skickades iväg till planansvariga."
                      )
                    )
                    .catch((error) => {
                      if (error instanceof NoResponseError) {
                        badToast(
                          "Misslyckades med att skicka notifiering, försök igen."
                        );
                      } else {
                        badToast("Misslyckades med att skicka notifiering.");
                      }
                    })
                }
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
        className="flex flex-col mb-7 dark:bg-slate-800"
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
              {sortByInventoryDate(item.kiosks).map((kiosk) => {
                const info = notifyInfoItem(kiosk);

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
                            Ingen inventering har gjorts ännu på denna kiosk.
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
                          .toSorted((a, b) =>
                            a.productName.localeCompare(b.productName)
                          )
                          .map((product) => {
                            const isOutOfStock =
                              product.amountPieces === 0 ||
                              product.amountPackages === 0;

                            return (
                              <div
                                key={product.id}
                                className="px-4 grid grid-cols-4 gap-4 py-2 text-gray-700 border-b border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-500 odd:bg-gray-200 odd:dark:bg-slate-700"
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

export default InventoryStatusListKiosks;
