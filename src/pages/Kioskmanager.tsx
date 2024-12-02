import AddFacilityButton from "@/components/AddFacilityButton";
import AddKioskButton from "@/components/AddKioskButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TrashIcon } from "lucide-react";

function Kioskmanager() {
  const { pathname } = useLocation();

  const [facility, setFacility] = useState<string[]>([]);
  const [kiosks, setKiosks] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);

  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [selectedProductlist, setSelectedProductlist] = useState<number | null>(
    null
  );
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
  
    // Återställ kiosk och produktlista
    setSelectedKiosk(null);
    setSelectedProductlist(null);
  
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

  const handleProductListClick = (index: number) => {
    const productListNames = ["Standard kiosker", "Standard skola"];
    const isSelected = selectedProductlist === index;
    const productlist = isSelected ? null : productListNames[index];

    setSelectedProductlist(isSelected ? null : index);

    setSelectedOptions((prev) => {
      return {
        ...prev,
        kiosk: selectedKiosk !== null ? kiosks[selectedKiosk] : null,
        productlist: productlist,
      };
    });
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
        <div className="grid lg:grid-cols-3 gap-5 w-10/12">
          <div>
            <h3 className="text-xl font-bold mb-2">Anläggning</h3>
            <div className="border border-solid lg:aspect-square border-black rounded-xl">
              <AddFacilityButton onSave={addFacility} />
              {facility.map((facility, index) => (
                <p
                  key={index}
                  className={`ml-3 pl-3 cursor-pointer mb-2 flex justify-between 
                 ${
                   selectedFacility === index
                     ? "text-black border-black border rounded-xl h-fit w-11/12"
                     : "text-black border-none w-11/12"
                 }`}
                  onClick={() => handleFacilityClick(index)}
                >
                  {facility} <TrashIcon className="mr-5 w-5 h-5 place-self-center" />
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
                      className={`ml-3 pl-3 cursor-pointer mb-2 flex justify-between 
                        ${
                          selectedKiosk === index
                            ? "text-black border-black border rounded-xl h-fit w-11/12"
                            : selectedKiosk === null
                            ? "text-black border-none w-11/12"
                            : "text-black"
                        }            
                `}
                      onClick={() => handleKioskClick(index)}
                    >
                      {kiosk} <TrashIcon className="mr-5 w-5 h-5 place-self-center" />
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
                <div className="mt-4 flex flex-col gap-4">
                  <ul className="ml-6">
                    <li>
                      <h3
                        onClick={() => handleProductListClick(0)}
                        className="font-semibold cursor-pointer mb-1"
                      >
                        Standard kiosker
                      </h3>
                      {selectedProductlist === 0 && (
                        <ul className="ml-2 list-inside list-disc">
                          <li>Hamburgare</li>
                          <li>Korv</li>
                          <li>Festis</li>
                        </ul>
                      )}
                    </li>
                  </ul>

                  <ul className="ml-6">
                    <li>
                      <h3
                        onClick={() => handleProductListClick(1)}
                        className="font-semibold cursor-pointer mb-1"
                      >
                        Standard skola
                      </h3>
                      {selectedProductlist === 1 && (
                        <ul className="ml-2 list-inside list-disc">
                          <li>Hamburgare</li>
                          <li>Korv</li>
                          <li>Festis</li>
                        </ul>
                      )}
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
