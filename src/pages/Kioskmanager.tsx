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

 

 

function Kioskmanager() {
  const [facilities, setFacility] = useState<Facility[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string|null >(null);
  const [selectedKioskId, setSelectedKioskId] = useState<string | null>(null);
  const[ kioskProducts, setKioskProducts] = useState<Product[]>([]);



  useQuery<Facility[]>({
    queryKey: ["facilities"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/facilities");
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

  const CreateFacility = async (facilityname: string) => {
    try {
      const response = await fetch("http://localhost:3000/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityname: facilityname }),
      });
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      const newFacility = await response.json();
      setFacility((prev) => [...prev, newFacility]);
    } catch (error) {
      console.error(error);
      throw new Error("failed to create facility");
    }
  };

  const CreateKiosk = async (kioskName: string) => {
    if (!selectedFacilityId ) {
      console.error("No facility selected. Cannot create kiosk without facility.");
      return;
    }
  
    try {
      console.log(selectedFacilityId)
      const response = await fetch("http://localhost:3000/kiosks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          kioskName: kioskName,
          facilityId: selectedFacilityId, // Skicka med det valda facilityId
          products : kioskProducts,
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
      throw new Error("failed to create facility");
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

  const kiosksByFacility = facilities.map((facility) => ({
    ...facility,
    kiosks: kiosks.filter((kiosk) => kiosk.facilityId === facility.id),
  }));

  const handleFacilityClick = (facilityId: string) => {
    setSelectedFacilityId((prev) => (prev === facilityId ? null : facilityId)); // Toggla val
    setSelectedKioskId(null); // Rensa vald kiosk när anläggningen ändras
  };
  
  

  
  const handleKioskClick = (kioskId: string) => {
    setSelectedKioskId((prev) => (prev === kioskId ? null : kioskId)); // Toggla val
  };
  
  


  
  return (
    <>
      <section className="container mx-auto px-5">
        <h1 className="mt-8 text-2xl pb-2 mb-4">Skapa anläggningar och kiosker</h1>

        <AddFacilityButton onSave={CreateFacility}/>

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
                <div className="flex justify-between w-full">
                <label className="basis-1/4 font-medium hover:text-slate-800">
                
                  {facility.facilityname}
                  </label>
                  <p className='basis-1/5 hidden lg:block lg:min-w-36'>
                     Antal kiosker:{' '}
                      {Array.isArray(facility.kiosks) ? facility.kiosks.length : 0}
                       </p>
                       <AddKioskButton onSave={CreateKiosk} 
                       onFacilityClick={() => handleFacilityClick(facility.id)}

                       />
                        
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
                              <div className="flex self-end gap-4 place-items-center mr-2">
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

       {/*  <div className="grid xl:grid-cols-3 gap-5 w-10/12">
          <div>
            <h3 className="text-xl mb-2">Anläggning</h3>
            <div className="border border-solid aspect-square sm:w-3/4 xl:w-full border-black rounded-xl pb-4">
              <AddFacilityButton onSave={CreateFacility} />
              {facilities.map((facility) => (
                <div
                  className={`ml-3 pl-3 cursor-pointer mb-2 flex justify-between 
                  ${
                    selectedFacility === facility.id
                      ? "text-black border-black border rounded-xl h-fit w-11/12"
                      : "text-black border-none w-11/12"
                  }`}
                  onClick={() => handleFacilityClick(facility)}
                >
                  <p>{facility.facilityname}</p>
                  <div
                    className="flex gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selectedOptions?.facilityId === facility.id && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
  <h3 className="text-xl mb-2">Kiosker</h3>
  <div className="border border-solid aspect-square sm:w-3/4 xl:w-full border-black rounded-xl pb-4">
    {selectedFacility && (
      <div className="mt-4">
        
        {kiosksByFacility
          .find((facility) => facility.id === selectedFacility) // Hämta den valda anläggningen
          ?.kiosks.map((kiosk) => ( // Rendera kiosker för den valda anläggningen
            <div
              key={kiosk.id}
              className={`ml-3 pl-3 cursor-pointer mb-2 flex justify-between 
                ${
                  selectedKiosk === kiosk.id
                    ? "text-black border-black border rounded-xl h-fit w-11/12"
                    : "text-black border-none w-11/12"
                }`}
              onClick={() => handleKioskClick(kiosk)}
            >
              <p>{kiosk.kioskName}</p>
              <div
                className="flex gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedOptions?.kioskId === kiosk.id && (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <UpdateKioskButton
                            onSave={UpdateKiosk}
                            kiosk={kiosk}
                            onUpdateKioskClick={() => handleKioskClick(kiosk)}
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
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
</div>;
        </div>
         */}
      </section>
    </>
  );
}

export default Kioskmanager;
