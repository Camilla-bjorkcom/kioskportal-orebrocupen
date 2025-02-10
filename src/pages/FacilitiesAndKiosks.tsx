import AddFacilityButton from "@/components/AddFacilityButton";
import AddKioskButton from "@/components/AddKioskButton";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UpdateFacilityButton from "@/components/UpdateFacilityButton";
import DeleteButton from "@/components/DeleteButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContactPerson,
  Facility,
  Kiosk,
  Product,
  Productlist,
} from "@/interfaces";
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
import EditSelectedKioskButton from "@/components/EditSelectedKioskButton";
import UpdateContactPersonButton from "@/components/UpdateContactPersonButton";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { toast } from "@/hooks/use-toast";
import { GetAllProductsResponse } from "@/interfaces/getAllProducts";
import AddProductsToKioskButton from "@/components/AddProductsToKioskButton";


function FacilitiesAndKiosks() {
  const queryClient = useQueryClient();

  const { id } = useParams<{ id: string }>();
  const tournamentId = id;

  const [kiosksForUpdate, setKiosksforUpdate] = useState<Kiosk[]>([]);
  const [kioskForEdit, setKioskForEdit] = useState<Kiosk>();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);

  const [open, setOpen] = useState(false);

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

      return dataResponse || [];
    },
  });

  const { data: products } = useQuery<GetAllProductsResponse>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetchWithAuth(`products/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();

      return data;
    },
  });

  const { data: productlists } = useQuery<Productlist[]>({
    queryKey: ["productlists"],
    queryFn: async () => {
      const response = await fetchWithAuth(`productlists/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch product lists");
      }
      const data = await response.json();
      console.log(data);

      return data || [];
    },
  });

  const CreateFacility = async (facilityName: string) => {
    try {
      const response = await fetchWithAuth(`facilities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityName }),
      });
      
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (response.status === 409) {
        const errorData = await response.json();
        console.log("409 Conflict Error:", errorData);

        toast({
          title: "Fel",
          description: `Anläggning med namnet ${facilityName}  finns redan.`,
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        queryClient.invalidateQueries({ queryKey: ["facilities"] });
      }

      if (response.status === 200){
        queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: `Anläggning ${facilityName} skapades`,
      });

      }
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att skapa anläggning.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
    }
  };

  const UpdateFacility = async (facility: Facility) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facility.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            facilityName: facility.facilityName,
            operation: "updateFacility",
          }),
        }
      );
      if (!response) {
        toast({
          title: "Fel",
          description: "Misslyckades med att uppdatera anläggningen.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        toast({
          title: "Fel",
          description: "Misslyckades med att uppdatera anläggningen.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to update facility");
      }

      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: `Anläggningen uppdaterades`,
      });
      //uppdaterar data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["facilities"] });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att uppdatera anläggningen.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
    }
  };

  const DeleteFacility = async (FId: string) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${FId}`,
        {
          method: "DELETE",
        }
      );
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to delete facility");
      }
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: `Anläggningen och dess kiosker raderades`,
      });
      //uppdaterar data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["facilities"] });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description:
          "Misslyckades med att radera anläggningen och dess kiosker.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
    }
  };

  const CreateContactPerson = async (
    name: string,
    phone: string,
    role: string,
    facilityId: string
  ) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facilityId}/contactpersons`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            phone,
            role,
            facilityId,
            operation: "createContactPerson",
          }),
        }
      );

      if (!response) {
        toast({
          title: "Fel",
          description:
            "Misslyckades med att lägga till kontaktperson till anläggningen.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        toast({
          title: "Fel",
          description:
            "Misslyckades med att lägga till kontaktperson till anläggningen.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to update facility");
      }
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: `Kontaktperson lades till`,
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["facilities"] });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att uppdatera anläggningen.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
    }
  };

  const UpdateContactPerson = async (contactPerson: ContactPerson) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${contactPerson.facilityId}/contactpersons`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: contactPerson.id,
            name: contactPerson.name,
            phone: contactPerson.phone,
            role: contactPerson.role,
            facilityId: contactPerson.facilityId,
            operation: "updateContactPerson",
          }),
        }
      );
      if (!response) {
        toast({
          title: "Fel",
          description: "Misslyckades med att uppdatera kontaktperson.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to update contact person");
      }
      if (!response.ok) {
        toast({
          title: "Fel",
          description: "Misslyckades med att uppdatera kontaktperson.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to update contact person");
      }
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: `Kontaktperson uppdaterades`,
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["facilities"] });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att uppdatera kontaktperson.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
    }
  };

  const DeleteContactPerson = async (
    contactPersonId: string,
    facilityId: string
  ) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facilityId}/contactpersons`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: contactPersonId,
            operation: "deleteContactPerson",
          }),
        }
      );
      if (!response) {
        toast({
          title: "Fel",
          description: "Misslyckades med att radera kontaktperson.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        toast({
          title: "Fel",
          description: "Misslyckades med att radera kontaktperson.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to update facility");
      }
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: `Kontaktperson raderades`,
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["facilities"] });
      }, 1500);
    } catch (error) {
      console.error(error);
      toast({
        title: "Fel",
        description: "Misslyckades med att radera kontaktperson.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
    }
  };

  const CreateKiosk = async (kioskName: string, facilityId: string) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facilityId}/kiosks`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kioskName: kioskName,
          }),
        }
      );
      if (!response) {
        toast({
          title: "Fel",
          description: "Misslyckades med att radera kontaktperson.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to save kiosk");
      }
      if (!response.ok) {
        toast({
          title: "Fel",
          description: "Misslyckades med att radera kontaktperson.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to save kiosk");
      }
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: ` ${kioskName} skapades`,
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Misslyckades med att radera kontaktperson.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
      console.error(error);
    }
  };

  const UpdateKiosk = async (kiosk: Kiosk) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${kiosk.facilityId}/kiosks/${kiosk.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: kiosk.id,
            kioskName: kiosk.kioskName,
            products: kiosk.products,
          }),
        }
      );
      if (!response) {
        toast({
          title: "Fel",
          description: "Misslyckades med att uppdatera kiosk.",
          className: "bg-red-200 dark:bg-red-400 dark:text-black",
        });
        throw new Error("Failed to update kiosk");
      }
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: ` Kiosk uppdaterades`,
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Misslyckades med att uppdatera kiosk.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
      console.error(error);
    }
  };

  const DeleteKiosk = async (id: string, facilityId: string) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${facilityId}/kiosks/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response) {
        throw new Error("Failed to delete kiosk");
      }
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: `Kiosk raderades`,
      });
    } catch (error) {
      toast({
        title: "Fel",
        description: "Misslyckades med att radera kiosk.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
      console.error(error);
    }
  };

  const handleSubmit = (open: boolean) => {
    if (open && kiosksForUpdate.length === 0) {
      alert("Du måste välja minst en kiosk!");
      return;
    }
    console.log("Valda kiosker:", kiosksForUpdate);
    // Här kan du öppna en dialog eller skicka datan till en API-endpoint
    alert(`Du har valt ${kiosksForUpdate.length} kiosker.`);
  };

  const handleEditClick = async (kiosk: Kiosk) => {
    console.log("handleEditClick körs för kiosk:", kiosk);
    console.log("produkter", products);
    console.log("produktlistor", productlists);

    try {
      setKioskForEdit(kiosk);
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${kiosk.facilityId}/kiosks/${kiosk.id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response) {
        console.error("Failed to fetch kiosk products");
      } else {
        const data = await response.json();
        console.log(data);
        setSelectedProducts(data.products);
        console.log("selectedProducts", selectedProducts);

        setOpen(true);
      }
    } catch (error) {
      console.error("Error handling edit click:", error);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isSuccess) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <section className="container mx-auto px-5">
      <h1 className="mt-8 text-2xl pb-2 mb-4 ">
        Hantera kiosker och produktutbud
      </h1>
      <div className="flex justify-between w-full 2xl:w-3/4 items-center mb-3">
        <AddFacilityButton
          onSave={(facilityname) => {
            CreateFacility(facilityname);
          }}
        />
        <SelectedKiosksButton
          selectedKiosks={kiosksForUpdate}
          productlists={productlists || []}
          products={products?.products || []}
          onClick={handleSubmit}
          onKiosksUpdated={handleKiosksUpdated}
          onClearSelected={clearSelectedKiosks}
          
        />
      </div>
      <Accordion type="single" collapsible className=" w-full 2xl:w-3/4">
        {data.map((facility) => (
          <AccordionItem
            key={facility.id}
            value={facility.id}
            className="p-4 border border-gray-200 rounded-md shadow dark:bg-slate-900  dark:text-gray-200  dark:border-slate-500"
          >
            <AccordionTrigger className="text-lg font-medium hover:no-underline mr-2">
              <div className="grid w-full grid-cols-1 xl:flex gap-4 justify-between items-center">
                <label className="basis-1/4 font-medium cursor-pointer">
                  {facility.facilityName}
                </label>
                <AddKioskButton
                  onSave={(kioskName) => CreateKiosk(kioskName, facility.id)}
                  facilityId={facility.id}
                />
                <AddContactPersonButton
                  onSave={(name, phone, role) =>
                    CreateContactPerson(name, phone, role, facility.id)
                  }
                  facilityId={facility.id}
                />
                <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit basis-1/12 ">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <UpdateFacilityButton
                          onSave={(updatedFacility) =>
                            UpdateFacility(updatedFacility)
                          }
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
                          onDelete={() => DeleteFacility(facility.id)}
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
              <Accordion type="single" collapsible>
                <AccordionItem
                  value={"kiosks" + facility.id}
                  className="p-4 border border-gray-200 rounded-md shadow dark:border-slate-500"
                >
                  <AccordionTrigger className="text-lg font-medium hover:no-underline">
                    Kiosker ({facility.kiosks?.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    {facility.kiosks?.map((kiosk) => (
                      <div
                        key={kiosk.id}
                        className="p-4 border border-gray-200 rounded-md shadow dark:border-slate-500"
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-lg">
                            {kiosk.kioskName}
                          </p>
                          <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit items-center">
                            <AddProductsToKioskButton  
                             kioskForEdit={kiosk}
                             productLists={productlists || []}
                             products={products?.products || []}
                             onEditClick={handleEditClick}
                             onKioskUpdated={handleKioskUpdated} />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <EditSelectedKioskButton
                                    key={kiosk.id}
                                    kioskForEdit={kiosk}
                                    onKioskUpdated={handleKioskUpdated}
                                    onSave={UpdateKiosk}
                                    onUpdateKioskClick={() => {}}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Redigera kioskutbud</p>
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
                                      DeleteKiosk(kiosk.id, facility.id)
                                    }
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Radera kiosk</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Checkbox
                              className="mr-0.5 2xl:mr-5 w-5 h-5"
                              id={`kiosk-${kiosk.id}`}
                              checked={kiosksForUpdate.some(
                                (k) => k.id === kiosk.id
                              )}
                              onClick={(e) => e.stopPropagation()}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setKiosksforUpdate((prev) => [
                                    ...prev,
                                    kiosk,
                                  ]);
                                } else {
                                  setKiosksforUpdate((prev) =>
                                    prev.filter((k) => k.id !== kiosk.id)
                                  );
                                }
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex mt-5 font-semibold">Produkter</div>
                        {kiosk.products && kiosk.products.length > 0 ? (
                          <ul className="grid grid-cols-3 gap-4 mt-2">
                            {kiosk.products.map(
                              (product: Product, index: number) => (
                                <li key={index}>{product.productName}</li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-200">
                            Inga produkter tillagda för denna kiosk.
                          </p>
                        )}
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value={"contactPersons" + facility.id}
                  className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50 dark:hover:bg-slate-800 dark:border-slate-500"
                >
                  <AccordionTrigger className="text-lg font-medium hover:no-underline">
                    Kontaktpersoner ({facility.contactPersons?.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    {facility.contactPersons?.map((contactPerson) => (
                      <div
                        key={contactPerson.id}
                        className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50 dark:hover:bg-slate-600 flex justify-between dark:border-slate-500"
                      >
                        <p>
                          {contactPerson.name} - {contactPerson.role} -{" "}
                          {contactPerson.phone}
                        </p>
                        <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <UpdateContactPersonButton
                                  onSave={(updatedContactPerson) =>
                                    UpdateContactPerson(updatedContactPerson)
                                  }
                                  contactPerson={contactPerson}
                                  onUpdateContactPersonClick={() => {}}
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
                                    DeleteContactPerson(
                                      contactPerson.id,
                                      facility.id
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export default FacilitiesAndKiosks;
