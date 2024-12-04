import AddFacilityButton from "@/components/AddFacilityButton";
import AddKioskButton from "@/components/AddKioskButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TrashIcon } from "lucide-react";
import AddProductListButton from "@/components/AddProductListButton";

function Kioskmanager() {
  type ProductListItem = {
    productListName: string;
    products: string[];
  };

  const { pathname } = useLocation();

  const [facility, setFacility] = useState<string[]>([]);
  const [kiosks, setKiosks] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [selectedKiosk, setSelectedKiosk] = useState<number | null>(null);
  const [productList, setProductList] = useState<ProductListItem | undefined>();

  //Sparar ned vad användaren valt för värden i UI i selectedOptions, ska ändras från string till id sen och skickas till databas för put och get
  const [selectedOptions, setSelectedOptions] = useState<{
    facility: string | null;
    kiosk: string | null;
    productlist: string | undefined;
  }>({
    facility: null,
    kiosk: null,
    productlist: undefined,
  });

  const addFacility = (facilityName: string) => {
    setFacility((prev) => [...prev, facilityName]);
  };

  const addKiosk = (kioskName: string) => {
    setKiosks((prev) => [...prev, kioskName]);
  };

  const addProductList = (productList: ProductListItem | undefined) => {
    setProductList(productList);
    if (productList != undefined) {
      setSelectedOptions((prev) => ({
        ...prev,
        productlist: productList.productListName,
      }));
    }
  };

  const handleFacilityClick = (index: number) => {
    const isSelected = selectedFacility === index;
    const facilityName = isSelected ? null : facility[index];
    setSelectedFacility(isSelected ? null : index);

    // Återställ kiosk och produktlista
    setSelectedKiosk(null);


    // Uppdatera endast facility i `selectedOptions`
    setSelectedOptions({
      facility: facilityName,
      kiosk: null,
      productlist: undefined,
    });
  };

  // const handleKioskClick = (index: number) => {
  //   const isSelected = selectedKiosk === index;
  //   const kioskName = isSelected ? null : kiosks[index];

  //   setSelectedKiosk(isSelected ? null : index);

  //   // Uppdatera `selectedOptions`
  //   setSelectedOptions((prev) => ({
  //     ...prev,
  //     kiosk: kioskName,
  //     productlist: isSelected ? undefined : prev.productlist, // Nollställ produktlistan om kiosken avmarkeras
  //   }));

  //   // Nollställ `productList` om kiosken är `null`
  //   if (isSelected) {
  //     setProductList(undefined);
  //   }
  // };

  const handleKioskClick = (index: number) => {
    const isSelected = selectedKiosk === index;
    const kioskName = isSelected ? null : kiosks[index];

    setSelectedKiosk(isSelected ? null : index);

    // Uppdatera `selectedOptions`
    setSelectedOptions((prev) => ({
      ...prev,
      kiosk: kioskName,
      productlist: isSelected ? undefined : prev.productlist, 
    }));
  };

  // const removeFacility = (facilityId: string) => {
  // };
  // const removeKiosk = (kioskId: string) => {
  // };

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
                  {facility} {/* Lägg till removeFacility onClick */}
                  <TrashIcon className="mr-5 w-5 h-5 place-self-center hover:text-red-500" />
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
                            : "text-black border-none w-11/12"
                        }            
                `}
                      onClick={() => handleKioskClick(index)}
                    >
                      {kiosk} {/* Lägg till removeKiosk onClick på trashIcon */}
                      <TrashIcon className="mr-7 w-5 h-5 place-self-center  hover:text-red-500" />
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
                  {productList === undefined && (
                    <AddProductListButton onSave={addProductList} />
                  )}
                  <ul className="ml-5">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">
                        {productList?.productListName}
                      </h3>
                      {productList != undefined && (
                        <TrashIcon className="mr-5 w-5 h-5 place-self-center cursor-pointer hover:text-red-500" />
                      )}
                    </div>
                    {productList?.products.map((product, index) => (
                      <li key={index} className="list-inside ml-4">
                        {product}
                      </li>
                    ))}
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
