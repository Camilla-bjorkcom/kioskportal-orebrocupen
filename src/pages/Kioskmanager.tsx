import AddFacilityButton from "@/components/AddFacilityButton";
import AddKioskButton from "@/components/AddKioskButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useLocation } from "react-router-dom";

function Kioskmanager() {
  const { pathname } = useLocation();

  const [facility, setFacility] = useState<string[]>([]);
  const [kiosks, setKiosks] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);

  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [selectedKiosk, setSelectedKiosk] = useState<number | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<{
    facility: string | null;
    kiosk: string | null;
  }>({
    facility: null,
    kiosk: null,
  });

  const addFacility = (facilityName: string) => {
    setFacility((prev) => [...prev, facilityName]);
  };

  const addKiosk = (kioskName: string) => {
    setKiosks((prev) => [...prev, kioskName]);
  };

  const handleFacilityClick = (index: number) => {
    const isSelected = selectedFacility === index;
    const facilityName = isSelected ? null : facility[index];
    setSelectedFacility(isSelected ? null : index);

    // Uppdatera endast facility i `selectedOptions`
    setSelectedOptions({
      facility: facilityName,
      kiosk: null, // Återställ kioskval när facility ändras
    });
  };

  const handleKioskClick = (index: number) => {
    const isSelected = selectedKiosk === index;
    const kioskName = isSelected ? null : kiosks[index];
    setSelectedKiosk(isSelected ? null : index);

    // Uppdatera endast kiosk i `selectedOptions`
    setSelectedOptions((prev) => ({
      ...prev,
      kiosk: kioskName,
    }));
  };

  console.log(selectedOptions);

  return (
    <>
      <div className="p-1 shadow w-full flex items-center mb-8">
        <SidebarTrigger />
        <h2>{pathname}</h2>
      </div>
      <section className="container mx-auto px-5">
        <h1 className="text-3xl font-bold mb-10">Skapa kiosker och utbud</h1>
        <div className="grid lg:grid-cols-3 gap-5">
          <div>
            <h3 className="text-xl font-bold mb-2">Anläggning</h3>
            <div className="border border-solid lg:aspect-square border-black rounded-xl">
              <AddFacilityButton onSave={addFacility} />
              {facility.map((facility, index) => (
                <p
                  key={index}
                  className={`ml-3 pl-3 cursor-pointer mb-2
                 ${
                   selectedFacility === index
                     ? "text-black border-black border rounded-xl h-fit w-10/12"
                     : "text-black"
                 }`}
                  onClick={() => handleFacilityClick(index)}
                >
                  {facility}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Kiosker</h3>
            <div className="border border-solid lg:aspect-square border-black rounded-xl">
              {selectedFacility !== null && (
                <div className="mt-4">
                  <AddKioskButton onSave={addKiosk} />
                  {kiosks.map((kiosk, index) => (
                    <p
                      key={index}
                      className={`ml-3 pl-3 cursor-pointer mb-2
                 ${
                   selectedKiosk === index
                     ? "text-black border-black border rounded-xl h-fit w-10/12"
                     : "text-black"
                 }`}
                      onClick={() => handleKioskClick(index)}
                    >
                      {kiosk}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">Produktlista</h3>
            <div className="border border-solid lg:aspect-square border-black rounded-xl">
              {selectedKiosk !== null && (
                <div className="mt-4">
                  <ul className="ml-6">
                    <li>
                      <h3 className="font-semibold cursor-pointer mb-1">Standard Kiosker</h3>
                      <ul className="ml-2 list-inside list-disc">
                        <li>Hamburgare</li>
                        <li>Korv</li>
                        <li>Festis</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Kioskmanager;
