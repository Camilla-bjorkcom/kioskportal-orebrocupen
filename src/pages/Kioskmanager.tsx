import AddFacilityButton from "@/components/AddFacilityButton";
import AddKioskButton from "@/components/AddKioskButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { TrashIcon } from "lucide-react";
import AddProductListButton from "@/components/AddProductListButton";
import AddProductsButton from "@/components/AddProductButton";
import { useQuery } from "@tanstack/react-query";



interface Facility {
  id: number;
  facilityname : string;
}

function Kioskmanager() {
  type ProductListItem = {
    productListName: string;
    products: string[];
  };

  const { pathname } = useLocation();

  const [facility, setFacility] = useState<Facility[]>([]);
  const [kiosks, setKiosks] = useState<string[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [selectedKiosk, setSelectedKiosk] = useState<number | null>(null);
  const [productList, setProductList] = useState<ProductListItem | undefined>();
  const [products, setProducts] = useState<string[]>([]);

  //Sparar ned vad användaren valt för värden i UI i selectedOptions, ska ändras från string till id sen och skickas till databas för put och get
  const [selectedOptions, setSelectedOptions] = useState<{
    facility: number | undefined;
    kiosk: string | null;
    productlist: string | undefined;
  }>({
    facility: undefined,
    kiosk: null,
    productlist: undefined,
  });


  const{isLoading, error}  = useQuery<Facility[]>({
    queryKey :["facilities"],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/facilities');
      if(!response.ok){
        throw new Error("Failed to fetch facilites");
      }
      const data = await response.json();
      setFacility(data)
      return data;
    }
 })

 
const CreateFacility = async (facilityname: string) => {
  try{
    const response = await fetch('http://localhost:3000/facilities' ,{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({facilityname: facilityname}),
    });
    if(!response.ok) {
      throw new Error("Failed to save product");
    }
    const newFacility = await response.json();
    setFacility((prev) =>[...prev, newFacility]);
  }
  catch(error){
    console.error(error)
    throw new Error("failed to create facility")
     } 
    };

    

  // const addFacility = (facility: Facility) => {
  //   setFacility((prev) => [...prev, facility]);
  // };

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

  const addProduct = (productName: string) => {
    setProducts((prev) => [...prev, productName]);
  };

  const handleFacilityClick = (facility: Facility) => { 
     setSelectedFacility(facility.id);

    //återställ kiosk
    setSelectedKiosk(null);

    setSelectedOptions({
      facility: facility.id,
      kiosk: null,
      productlist: undefined,
    });
  };

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

  const DeleteFacility = async (id: number) => {
    try{
      const response = await fetch(
        `http://localhost:3000/facilities/${id}`, 
        {
          method: "DELETE",
        }
      );
      if(!response.ok){
        throw new Error("failed to delete product")
      }
      setFacility((prev) => prev.filter((list) =>list.id !==id));
    }
    catch (error) {
      console.error(error)
    }
  }

  // const removeFacility = (facilityId: string) => {
  // };
  // const removeKiosk = (kioskId: string) => {
  // };

  
  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }
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
              <AddFacilityButton onSave={CreateFacility} />
              {facility.map((facility) => (
                <p
                  key={facility.id}
                  className={`ml-3 pl-3 cursor-pointer mb-2 flex justify-between 
                 ${
                   selectedFacility === facility.id
                     ? "text-black border-black border rounded-xl h-fit w-11/12"
                     : "text-black border-none w-11/12"
                 }`}
                  onClick={() => handleFacilityClick(facility)}
                >
                  {facility.facilityname} {/* Lägg till removeFacility onClick */}
                  <TrashIcon onClick={() => DeleteFacility(facility.id)} className="mr-5 w-5 h-5 place-self-center hover:text-red-500" />
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
                <div className="mt-4 flex flex-col gap-4 mb-5">
                  {productList === undefined && (
                    <AddProductListButton onSave={addProductList} />
                  )}
                  <ul className="ml-5">
                    <div className="flex justify-between">
                      <h3 className="font-semibold">
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
                  <ul>
                    {productList != undefined && (
                      <AddProductsButton onSave={addProduct} />
                    )}

                    {products.map((product, index) => (
                      <div className="flex justify-between">
                        <li key={index} className="list-inside ml-9">
                          {product}
                        </li>
                        <TrashIcon className="mr-5 w-4 h-4 place-self-center cursor-pointer hover:text-red-500" />
                      </div>
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
