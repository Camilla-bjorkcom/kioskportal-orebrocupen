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
import { Facility, Kiosk, Product } from '@/interfaces';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useParams } from "react-router-dom";
import AddContactPersonButton from "@/components/AddContactPersonButton";
import SelectedKiosksButton from "@/components/SelectedKiosksButton";
import { Checkbox } from "@/components/ui/checkbox";
import EditSelectedKioskButton from "@/components/EditSelectedKioskButton";
import UpdateContactPersonButton from "@/components/UpdateContactPersonButton";
import fetchWithAuth from "@/api/functions/fetchWithAuth";

function FacilitiesAndKiosks() {
  const [facilities, setFacility] = useState<Facility[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string|null >(null);
  const [selectedKioskId, setSelectedKioskId] = useState<string | null>(null);
  const[ kioskProducts, setKioskProducts] = useState<Product[]>([]);
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;


  useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await fetchWithAuth(`/facilities/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch facilites");
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
        throw new Error("Failed to fetch facilites");
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
  useQuery<ProductList[]>({
    queryKey: ["productlists"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/productslists");
      if (!response.ok) throw new Error("Failed to fetch product lists");
      const data = await response.json();
      setProductLists(data);
      console.log("listor", data);
      return data;
    },
  });

  // Fetch Products
  useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      console.log("varor", data);
      return data;
    },
  });

  const CreateFacility = async (facilityName: string) => {
    try {
      const response = await fetchWithAuth(`/facilities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityName }),
      });
      if (!response.ok) {
        throw new Error("Failed to save facility");
      }
      const newFacility = await response.json();
      setFacility((prev) => [...prev, newFacility]);
    } catch (error) {
      console.error(error);
      throw new Error("failed to create facility");
    }
  };

  const CreateKiosk = async (kioskName: string, facilityId: string) => {
    try {
      const response = await fetch("http://localhost:3000/kiosks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          kioskName: kioskName,
          facilityId: facilityId,
          products: kioskProducts,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save kiosk");
      }
  
      const newKiosk = await response.json();
      setKiosks((prev) => [...prev, newKiosk]);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create kiosk");
    }
  };
  

  const UpdateFacility = async (facility: Facility) => {
    console.log("this is" + facility.facilityname + "id: " + facility.id);
    try {
      const response = await fetch(
        `http://localhost:3000/facilities/${facility.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: facility.id,
            facilityname: facility.facilityname,
            tournamentId: facility.tournamentId
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update facility");
      }
      const updatedFacility = await response.json();
      console.log(updatedFacility);

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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kioskName,
          facilityId,
          products: kioskProducts,
        }),
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
          products : kiosk.products
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update facility");
      }
      const updatedKiosk = await response.json();

      setKiosks((prev) =>
        prev.map((f) => (f.id === updatedKiosk.id ? updatedKiosk : f))
      );
    } catch (error) {
      console.error(error);
      throw new Error("failed to create facility");
    }
  };

  const DeleteFacility = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/facilities/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("failed to delete product");
      }
      setFacility((prev) => prev.filter((list) => list.id !== id));
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
        throw new Error("failed to delete product");
      }
      setKiosks((prev) => prev.filter((list) => list.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const facilitiesByTournament = facilities.filter((facility) => facility.tournamentId === tournamentId);

  const kiosksByFacility = facilitiesByTournament.map((facility) => ({
    ...facility,
    kiosks: kiosks.filter((kiosk) => kiosk.facilityId === facility.id),
  }));

  const handleFacilityClick = (facilityId: string) => {
    setSelectedFacilityId((prev) => (prev === facilityId ? null : facilityId)); 
    console.log("ID facility handleFacilityClick", selectedFacilityId)// Toggla val
    setSelectedKioskId(null); // Rensa vald kiosk när anläggningen ändras
  };
  
  

  
  const handleKioskClick = (kioskId: string) => {
    setSelectedKioskId((prev) => (prev === kioskId ? null : kioskId)); // Toggla val
  };
  
  


  
  return (
    <section className="container mx-auto px-5">
      <h1 className="mt-8 text-2xl pb-2 mb-4">
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
          productLists={productLists}
          products={products}
          onClick={handleSubmit}
          onKiosksUpdated={handleKiosksUpdated}
          onClearSelected={clearSelectedKiosks}
        />

        <Accordion type="single" collapsible className=" w-full 2xl:w-3/4">
            {kiosksByFacility.map((facility) => (
              <AccordionItem
                key={facility.id}
                value={facility.id}
                className={`p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50 ${
                    selectedFacilityId === facility.id
                      ? "text-black border-black border rounded-xl h-fit w-11/12"
                      : "text-black border-none w-11/12"
                }`
                }
                  onClick={() => handleFacilityClick(facility.id)}
              >
                <AccordionTrigger className="text-lg font-medium hover:no-underline mr-2">
                <div className="grid w-full grid-cols-1 xl:flex gap-4 justify-between items-center">
                <label className="basis-1/4 font-medium hover:text-slate-800">
                
                  {facility.facilityname}
                  </label>
                  <p className='basis-1/5 ml-0 lg:block lg:min-w-36 2xl:ml-auto'>
                     Antal kiosker:{' '}
                      {Array.isArray(facility.kiosks) ? facility.kiosks.length : 0}
                       </p>
                       <AddKioskButton 
                        
                         onSave={(kioskName) => CreateKiosk(kioskName, facility.id)} 
                         facilityId={facility.id}
                        
                          />
                       
                       <div className="flex justify-self-end gap-7 2xl:gap-10 ml-auto w-fit basis-1/12">  
                      <>
                          <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger onClick={(e) => {
                                e.stopPropagation(); // Hindrar event från att bubbla upp till AccordionTrigger
                                 }}>
                              <UpdateFacilityButton
                                onSave={UpdateFacility}
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
                                onDelete={DeleteFacility}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Radera</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                       
                       </>
                 </div>
                      </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion type="single" collapsible>
                    {facility.kiosks.map((kiosk) => (
                      <AccordionItem
                        key={kiosk.id}
                        value={kiosk.id}
                        className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
                      >
                        <AccordionTrigger className="flex self-end hover:no-underline">
                          <div className="w-full hover:no-underline">
                            <div className="flex justify-between">
                              <label className="basis-1/4 font-medium hover:text-slate-800">
                                {kiosk.kioskName}
                              </label>
                              <div className="flex self-end gap-10 place-items-center mr-2">
                              <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger 
                         onClick={(e) => {
                          e.stopPropagation(); // Hindrar event från att bubbla upp till AccordionTrigger
                        }}
                        >
                          <UpdateKioskButton
                            onSave={UpdateKiosk}
                            kiosk={kiosk}
                            onUpdateKioskClick={() => handleKioskClick(kiosk.id)}
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
                            onDelete={DeleteKiosk}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Radera</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                               
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                         
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

      </section>
    </>
  );
}

export default FacilitiesAndKiosks;
