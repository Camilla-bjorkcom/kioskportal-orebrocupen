import AddFacilityButton from "@/components/AddFacilityButton";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UpdateFacilityButton from "@/components/UpdateFacilityButton";
import DeleteButton from "@/components/DeleteButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Facility, Kiosk, Product } from '@/interfaces';
import AddKioskButtonC from "@/components/AddKioskButtonC";
import UpdateKioskButtonC from "@/components/UpdataKioskButtonC";
import AddFacilityButtonC from "@/components/AddFacilityButtonC";
 

 

function Kioskmanager() {
  const [facilities, setFacility] = useState<Facility[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<string >();
  const [selectedKiosk, setSelectedKiosk] = useState<string>();
  const[ kioskProducts, setKioskProducts] = useState<Product[]>([]);

  //Sparar ned vad användaren valt för värden i UI i selectedOptions, ska ändras från string till id sen och skickas till databas för put och get
  const [selectedOptions, setSelectedOptions] = useState<{
    facilityId?: string;
    kioskId?: string;
  }>({
    facilityId: "",
    kioskId: "",
  });
  

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
    if (!selectedFacility ) {
      console.error("No facility selected. Cannot create kiosk without facility.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/kiosks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          kioskName: kioskName,
          facilityId: selectedFacility, // Skicka med det valda facilityId
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

  const handleFacilityClick = (facility: Facility) => {
    const newFacilityId = selectedFacility === facility.id ? "" : facility.id;
  
    setSelectedFacility(newFacilityId); // Uppdaterar selectedFacility
  
    setSelectedOptions((prev) => ({
      ...prev,
      facilityId: newFacilityId,
      kioskId: "", // Rensar kiosk eftersom anläggning ändras
    }));
  };

  
  const handleKioskClick = (kiosk: Kiosk) => {
    const newKioskId = selectedKiosk === kiosk.id ? "" : kiosk.id;
  
    setSelectedKiosk(newKioskId); // Uppdaterar selectedKiosk
  
    setSelectedOptions((prev) => ({
      ...prev,
      kioskId: newKioskId,
    }));
  };
  


  
  return (
    <>
      <section className="container mx-auto px-5">
        <h1 className="mt-8 text-2xl pb-2 mb-4">Skapa kiosker</h1>
        <div className="grid xl:grid-cols-3 gap-5 w-10/12">
          <div>
            <h3 className="text-xl mb-2">Anläggning</h3>
            <div className="border border-solid aspect-square sm:w-3/4 xl:w-full border-black rounded-xl pb-4">
              <AddFacilityButtonC onSave={CreateFacility} />
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
        <AddKioskButtonC onSave={CreateKiosk} />
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
                          <UpdateKioskButtonC
                            onSave={UpdateKiosk}
                            kiosk={kiosk}
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
      </section>
    </>
  );
}

export default Kioskmanager;