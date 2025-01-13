import AddFacilityButton from "@/components/AddFacilityButton";
import AddKioskButton from "@/components/AddKioskButton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UpdateFacilityButton from "@/components/UpdateFacilityButton";
import DeleteButton from "@/components/DeleteButton";
import UpdateKioskButton from "@/components/UpdateKioskButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContactPerson, Facility, Kiosk, Product } from "@/interfaces";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useParams } from "react-router-dom";
import AddContactPersonButton from "@/components/AddContactPersonButton";

function FacilitiesAndKiosks() {
  const [facilities, setFacility] = useState<Facility[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [kioskProducts, setKioskProducts] = useState<Product[]>([]);
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;

  useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/facilities");
      if (!response.ok) {
        throw new Error("Failed to fetch facilities");
      }
      const data = await response.json();
      setFacility(data);
      return data;
    },
  });

  useQuery<Kiosk[]>({
    queryKey: ["kiosks"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/kiosks");
      if (!response.ok) {
        throw new Error("Failed to fetch kiosks");
      }
      const data = await response.json();
      setKiosks(data);
      return data;
    },
  });

  useQuery<ContactPerson[]>({
    queryKey: ["contactpersons"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/contactPersons");
      if (!response.ok) {
        throw new Error("Failed to fetch contact persons");
      }
      const data = await response.json();
      setContactPersons(data);
      return data;
    },
  });

  const CreateFacility = async (facilityname: string, tournamentId: string) => {
    try {
      const response = await fetch("http://localhost:3000/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityname, tournamentId }),
      });
      if (!response.ok) {
        throw new Error("Failed to save facility");
      }
      const newFacility = await response.json();
      setFacility((prev) => [...prev, newFacility]);
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateFacility = async (facility: Facility) => {
    try {
      const response = await fetch(`http://localhost:3000/facilities/${facility.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: facility.id,
          facilityname: facility.facilityname,
          tournamentId: facility.tournamentId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update facility");
      }
      const updatedFacility = await response.json();
      setFacility((prev) =>
        prev.map((f) => (f.id === updatedFacility.id ? updatedFacility : f))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteFacility = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/facilities/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete facility");
      }
      setFacility((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const CreateKiosk = async (kioskName: string, facilityId: string) => {
    try {
      const response = await fetch("http://localhost:3000/kiosks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kioskName, facilityId, products: kioskProducts }),
      });
      if (!response.ok) {
        throw new Error("Failed to save kiosk");
      }
      const newKiosk = await response.json();
      setKiosks((prev) => [...prev, newKiosk]);
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateKiosk = async (kiosk: Kiosk) => {
    try {
      const response = await fetch(`http://localhost:3000/kiosks/${kiosk.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: kiosk.id,
          kioskName: kiosk.kioskName,
          facilityId: kiosk.facilityId,
          products: kiosk.products,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update kiosk");
      }
      const updatedKiosk = await response.json();
      setKiosks((prev) =>
        prev.map((f) => (f.id === updatedKiosk.id ? updatedKiosk : f))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteKiosk = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/kiosks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete kiosk");
      }
      setKiosks((prev) => prev.filter((k) => k.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const CreateContactPerson = async (
    name: string,
    phone: string,
    role: string,
    facilityId: string
  ) => {
    try {
      const response = await fetch("http://localhost:3000/contactPersons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, role, facilityId }),
      });
      if (!response.ok) {
        throw new Error("Failed to save contact person");
      }
      const newContactPerson = await response.json();
      setContactPersons((prev) => [...prev, newContactPerson]);
    } catch (error) {
      console.error(error);
    }
  };

  const facilitiesByTournament = facilities.filter(
    (facility) => facility.tournamentId === tournamentId
  );

  const propsByFacility = facilitiesByTournament.map((facility) => ({
    ...facility,
    kiosks: kiosks.filter((kiosk) => kiosk.facilityId === facility.id),
    contactPersons: contactPersons.filter(
      (contactPerson) => contactPerson.facilityId === facility.id
    ),
  }));

  return (
    <section className="container mx-auto px-5">
      <h1 className="mt-8 text-2xl pb-2 mb-4">Skapa anläggningar och kiosker</h1>

      <AddFacilityButton
        onSave={(facilityname, tournamentId) => {
          CreateFacility(facilityname, tournamentId);
        }}
        tournamentId={tournamentId || ""}
      />

      <Accordion type="single" collapsible className=" w-full 2xl:w-3/4">
        {propsByFacility.map((facility) => (
          <AccordionItem
            key={facility.id}
            value={facility.id}
            className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
          >
            <AccordionTrigger className="text-lg font-medium hover:no-underline mr-2">
              <div className="grid w-full grid-cols-1 xl:flex gap-4 justify-between items-center">
                <label className="basis-1/4 font-medium hover:text-slate-800">
                  {facility.facilityname}
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
                <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit basis-1/12">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <UpdateFacilityButton
                          onSave={(updatedFacility) => UpdateFacility(updatedFacility)}
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
                  className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
                >
                  <AccordionTrigger className="text-lg font-medium hover:no-underline">
                    Kiosker ({facility.kiosks.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    {facility.kiosks.map((kiosk) => (
                      <div
                        key={kiosk.id}
                        className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <p>{kiosk.kioskName}</p>
                          <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <UpdateKioskButton
                                    onSave={(updatedKiosk) => UpdateKiosk(updatedKiosk)}
                                    kiosk={kiosk}
                                    onUpdateKioskClick={() => {}}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Redigera kiosk</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <DeleteButton
                                    id={kiosk.id}
                                    type="Kiosk"
                                    onDelete={() => DeleteKiosk(kiosk.id)}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Radera kiosk</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value={"contactPersons" + facility.id}
                  className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
                >
                  <AccordionTrigger className="text-lg font-medium hover:no-underline">
                    Kontaktpersoner ({facility.contactPersons.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    {facility.contactPersons.map((contactPerson) => (
                      <div
                        key={contactPerson.id}
                        className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
                      >
                        <p>
                          {contactPerson.name} - {contactPerson.role} - {contactPerson.phone}
                        </p>
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
