import AddFacilityButton from "@/components/AddFacilityButton";
import AddKioskButton from "@/components/AddKioskButton";
import { useState } from "react";

import UpdateFacilityButton from "@/components/UpdateFacilityButton";
import DeleteButton from "@/components/DeleteButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Facility, Kiosk, KioskForQr, Product } from "@/interfaces";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "react-router-dom";
import AddContactPersonButton from "@/components/AddContactPersonButton";
import SelectedKiosksButton from "@/components/SelectedKiosksButton";
import { Checkbox } from "@/components/ui/checkbox";
import UpdateContactPersonButton from "@/components/UpdateContactPersonButton";

import AddProductsToKioskButton from "@/components/AddProductsToKioskButton";
import QrCodeSingleBtn from "@/components/QrCodeSingleBtn";
import QrCodeAllBtn from "@/components/QrCodeAllBtn";
import FacilityProductInfoComponent from "@/components/FacilityProductInfoComponent";
import { deleteFacility } from "@/api/functions/deleteFacility";
import { deleteContactPerson } from "@/api/functions/deleteContactPerson";
import { deleteKiosk } from "@/api/functions/deleteKiosk";
import UpdateKioskKioskButton from "@/components/UpdateKioskButton";
import {
  useGetAllFacilities,
  useGetAllProductlists,
  useGetAllProducts,
  useGetOneKiosk,
} from "@/hooks/use-query";
import { badToast } from "@/utils/toasts";

function FacilitiesAndKiosks() {
  const tournamentId = useParams().id as string;

  const [kiosksForUpdate, setKiosksforUpdate] = useState<Kiosk[]>([]);
  const [, setKioskForEdit] = useState<Kiosk>();
  const [, setSelectedProducts] = useState<Product[]>([]);
  const [, setKiosks] = useState<Kiosk[]>([]);

  const [, setOpen] = useState(false);
  const [openFacilityId, setOpenFacilityId] = useState<string | null>(null);

  const { isLoading, error, data, isSuccess } =
    useGetAllFacilities(tournamentId);

  const { data: products } = useGetAllProducts(tournamentId);

  const { data: productlists } = useGetAllProductlists(tournamentId);

  const toggleFacility = (facilityId: string) => {
    setOpenFacilityId((prevId) => (prevId === facilityId ? null : facilityId));
  };

  const handleSubmit = (open: boolean) => {
    if (open && kiosksForUpdate.length === 0) {
      alert("Du måste välja minst en kiosk!");
      return;
    }
    alert(`Du har valt ${kiosksForUpdate.length} kiosker.`);
  };

  const handleEditClick = async (kiosk: Kiosk) => {
    try {
      setKioskForEdit(kiosk);

      const { data: fetchedKiosk, isSuccess: kioskSuccess } = useGetOneKiosk(
        tournamentId!,
        kiosk.facilityId,
        kiosk.id
      );
      if (kioskSuccess) {
        setSelectedProducts(fetchedKiosk.products);
        setOpen(true);
      }
    } catch (error) {
      console.error("Error handling edit click:", error);
      badToast("Något gick fel.");
    }
  };

  const handleKioskUpdated = (updatedKiosk: Kiosk) => {
    setKiosks((prevKiosks) =>
      prevKiosks.map((kiosk) =>
        kiosk.id === updatedKiosk.id ? updatedKiosk : kiosk
      )
    );
  };

  const handleKiosksUpdated = (updatedKiosks: Kiosk[]) => {
    setKiosks((prevKiosks) =>
      prevKiosks.map(
        (kiosk) =>
          updatedKiosks.find((updatedKiosk) => updatedKiosk.id === kiosk.id) ||
          kiosk
      )
    );
  };

  const clearSelectedKiosks = () => {
    setKiosksforUpdate([]);
  };

  const kiosksForQrCode: KioskForQr[] =
    data?.flatMap((facility: Facility) =>
      facility.kiosks.map((kiosk) => ({
        kioskName: kiosk.kioskName,
        facility: kiosk.facility,
        inventoryKey: kiosk.inventoryKey,
      }))
    ) || [];

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

  return (
    <section className="container mx-auto px-5">
      <div className="flex flex-col md:flex-row justify-between items-center w-full md:w-3/4">
        <h1 className="mt-8 text-2xl pb-2 mb-4">Anläggningshantering</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FacilityProductInfoComponent />
            </TooltipTrigger>
            <TooltipContent>
              <p>Information om anläggningshantering</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col gap-4 mt-4 sm:mt-0 md:flex-row sm:justify-between sm:items-center w-full md:w-3/4 mb-3">
        <AddFacilityButton tournamentId={tournamentId!} />
        <div className="flex flex-col sm:flex-row gap-3 place-items-start ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <QrCodeAllBtn kiosksForQr={kiosksForQrCode} />
              </TooltipTrigger>
              <TooltipContent>
                Klicka för att öppna utskriftsvänlig vy
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <SelectedKiosksButton
                  selectedKiosks={kiosksForUpdate}
                  productlists={productlists || []}
                  products={products?.products || []}
                  onClick={handleSubmit}
                  onKiosksUpdated={handleKiosksUpdated}
                  onClearSelected={clearSelectedKiosks}
                />
              </TooltipTrigger>
              <TooltipContent>
                {kiosksForUpdate.length > 0
                  ? "Klicka på knappen för att lägga till produkter i valda kiosker"
                  : "Välj minst en kiosk för att lägga till produkter"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Accordion
        type="multiple"
        value={openFacilityId ? [openFacilityId] : []}
        className="w-full md:w-3/4"
      >
        {data.map((facility) => (
          <AccordionItem
            key={facility.id}
            value={openFacilityId === facility.id ? facility.id : ""}
            className="p-4 border border-gray-200 rounded-md shadow dark:bg-slate-800 dark:text-gray-200 dark:border-slate-500 mb-4"
          >
            <AccordionTrigger
              className="text-lg font-medium hover:no-underline mr-2"
              onClick={() => toggleFacility(facility.id)}
            >
              <div className="grid w-full grid-cols-1 xl:flex gap-4 justify-between items-center">
                <label className="basis-1/4 font-medium cursor-pointer">
                  {facility.facilityName}
                </label>
                <AddKioskButton
                  onFacilityAdded={setOpenFacilityId}
                  tournamentId={tournamentId!}
                  facilityId={facility.id}
                />
                <AddContactPersonButton
                  tournamentId={tournamentId!}
                  facilityId={facility.id}
                  onFacilityAdded={setOpenFacilityId}
                />
                <div className="flex flex-wrap sm:justify-end gap-4 ml-auto mr-5 w-fit basis-1/12">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <UpdateFacilityButton
                          tournamentId={tournamentId!}
                          facility={facility}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Redigera anläggning</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <DeleteButton
                          id={facility.id}
                          type="Facility"
                          onDelete={() =>
                            deleteFacility(facility.id, tournamentId!)
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Radera anläggning</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                <div>
                  {facility.kiosks?.map((kiosk) => (
                    <div
                      key={kiosk.id}
                      className="p-4 border border-gray-200 rounded-md shadow dark:border-slate-500 mb-4"
                    >
                      <div className="flex flex-col md:flex-row sm:justify-between sm:items-center ">
                        <p className="font-semibold text-lg">
                          {kiosk.kioskName}
                        </p>

                        <div className="flex flex-wrap sm:justify-end gap-4 ml-auto w-fit mt-2 md:mt-0 items-center">
                          <AddProductsToKioskButton
                            kioskForEdit={kiosk}
                            productlists={productlists || []}
                            products={products?.products || []}
                            onEditClick={handleEditClick}
                            onKioskUpdated={handleKioskUpdated}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <QrCodeSingleBtn
                                  kioskName={kiosk.kioskName}
                                  facility={kiosk.facility}
                                  inventoryKey={kiosk.inventoryKey}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Visa kioskens QR kod</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <UpdateKioskKioskButton
                                  key={kiosk.id}
                                  kioskForEdit={kiosk}
                                  tournamentId={tournamentId!}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Redigera kiosknamn</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <DeleteButton
                                  id={kiosk.id}
                                  type="Kiosk"
                                  onDelete={() =>
                                    deleteKiosk(
                                      kiosk.id,
                                      facility.id,
                                      tournamentId!
                                    )
                                  }
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Radera kiosk</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Checkbox
                            className="mr-0.5 w-5 h-5"
                            id={`kiosk-${kiosk.id}`}
                            checked={kiosksForUpdate.some(
                              (k) => k.id === kiosk.id
                            )}
                            onClick={(e) => e.stopPropagation()}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setKiosksforUpdate((prev) => [...prev, kiosk]);
                              } else {
                                setKiosksforUpdate((prev) =>
                                  prev.filter((k) => k.id !== kiosk.id)
                                );
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex mt-5 font-semibold">
                        Produkter ({kiosk.products.length})
                      </div>
                      {kiosk.products && kiosk.products.length > 0 ? (
                        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                          {kiosk.products
                            .slice()
                            .sort((a, b) =>
                              a.productName.localeCompare(b.productName)
                            )
                            .map((product: Product, index: number) => (
                              <li key={index}>{product.productName}</li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-200 mt-2">
                          Inga produkter tillagda för denna kiosk.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4">
                {facility.contactPersons?.length > 0 && (
                  <>
                    <div className="font-semibold text-lg ml-2 mb-2">
                      Kontaktpersoner
                    </div>
                    <div>
                      {facility.contactPersons?.map((contactPerson) => (
                        <div
                          key={contactPerson.id}
                          className="p-4 border border-gray-200 rounded-md shadow flex flex-col md:flex-row justify-between dark:border-slate-500 mb-3"
                        >
                          <p className="mb-2 md:mb-0">
                            {contactPerson.name} - {contactPerson.role} -{" "}
                            {contactPerson.phone}
                          </p>
                          <div className="flex flex-wrap justify-end gap-4 ml-auto w-fit items-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <UpdateContactPersonButton
                                    tournamentId={tournamentId!}
                                    contactPerson={contactPerson}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Redigera kontaktperson</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <DeleteButton
                                    id={contactPerson.id}
                                    type="ContactPerson"
                                    onDelete={() =>
                                      deleteContactPerson(
                                        contactPerson.id,
                                        facility.id,
                                        tournamentId!
                                      )
                                    }
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Radera kontaktperson</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default FacilitiesAndKiosks;
