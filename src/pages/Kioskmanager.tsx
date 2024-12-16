import AddFacilityButton from "@/components/AddFacilityButton";
import AddKioskButton from "@/components/AddKioskButton";
import { useState } from "react";
import { Pencil, TrashIcon } from "lucide-react";
// import AddProductListButton from "@/components/AddProductListButton";
// import AddProductsButton from "@/components/AddProductButton";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UpdateFacilityButton from "@/components/UpdateFacilityButton";
import DeleteButton from "@/components/DeleteButton";
import UpdateKioskButton from "@/components/UpdateKioskButton";

interface Facility {
  id: number;
  facilityname: string;
}
interface Kiosk {
  id: number;
  kioskName: string;
}

// interface ProductList {
//   id: number;
//   productlistname: string;
//   products: Product[];
// }
// interface Product {
//   id: number;
//   productname: string;
// }

function Kioskmanager() {
  const [facility, setFacility] = useState<Facility[]>([]);
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<number | null>(null);
  const [selectedKiosk, setSelectedKiosk] = useState<number | null>(null);
  // const [productList, setProductList] = useState<ProductList | undefined>();
  // const [products, setProducts] = useState<string[]>([]);

  //Sparar ned vad användaren valt för värden i UI i selectedOptions, ska ändras från string till id sen och skickas till databas för put och get
  const [selectedOptions, setSelectedOptions] = useState<{
    facility: number | null;
    kiosk: number | null;
  }>({
    facility: null,
    kiosk: null,
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
    try {
      const response = await fetch("http://localhost:3000/kiosks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kioskName: kioskName }),
      });
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      const newKiosk = await response.json();
      setKiosks((prev) => [...prev, newKiosk]);
    } catch (error) {
      console.error(error);
      throw new Error("failed to create facility");
    }
  };

  // const addProductList = (productList: ProductList | undefined) => {
  //   setProductList(productList);
  //   if (productList != undefined) {
  //     setSelectedOptions((prev) => ({
  //       ...prev,
  //       productlist: productList.id,
  //     }));
  //   }
  // };

  // const addProduct = (productName: string) => {
  //   setProducts((prev) => [...prev, productName]);
  // };

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

  const DeleteFacility = async (id: number) => {
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

  const DeleteKiosk = async (id: number) => {
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

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility((prevSelectedFacility) =>
      prevSelectedFacility === facility.id ? null : facility.id
    );

    // Återställ kiosk och uppdatera valda alternativ
    setSelectedKiosk(null);
    setSelectedOptions((prev) => ({
      ...prev,
      facility: selectedFacility === facility.id ? null : facility.id,
      kiosk: null,
    }));
  };

  const handleKioskClick = (kiosk: Kiosk) => {
    setSelectedKiosk((prevSelectedKiosk) =>
      prevSelectedKiosk === kiosk.id ? null : kiosk.id
    );

    // Uppdatera valda alternativ
    setSelectedOptions((prev) => ({
      ...prev,
      kiosk: selectedKiosk === kiosk.id ? null : kiosk.id,
    }));
  };

  console.log(selectedOptions);

  return (
    <>
      <section className="container mx-auto px-5">
        <h1 className="mt-8 text-2xl pb-2 mb-4">Skapa kiosker</h1>
        <div className="grid lg:grid-cols-3 gap-5 w-10/12">
          <div>
            <h3 className="text-xl mb-2">Anläggning</h3>
            <div className="border border-solid lg:aspect-square border-black rounded-xl pb-4">
              <AddFacilityButton onSave={CreateFacility} />
              {facility.map((facility) => (
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
                    <UpdateFacilityButton
                      onSave={UpdateFacility}
                      facility={facility}
                    />
                    <DeleteButton
                      id={facility.id}
                      type="Facility"
                      onDelete={DeleteFacility}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl mb-2">Kiosker</h3>
            <div className="border border-solid lg:aspect-square border-black rounded-xl pb-4">
              {selectedFacility !== null && (
                <div className="mt-4">
                  <AddKioskButton onSave={CreateKiosk} />
                  {kiosks.map((kiosk) => (
                    <div
                      key={kiosk.id}
                      className={`ml-3 pl-3 cursor-pointer mb-2 flex justify-between 
              ${
                selectedKiosk === kiosk.id
                  ? "text-black border-black border rounded-xl h-fit w-11/12"
                  : "text-black border-none w-11/12"
              }            
            `}
                      onClick={() => handleKioskClick(kiosk)}
                    >
                      <p>{kiosk.kioskName}</p>
                      <div
                        className="flex gap-3"
                        onClick={(e) => e.stopPropagation()} // Hindrar klick på ikoner från att trigga kioskval
                      >
                        <UpdateKioskButton onSave={UpdateKiosk} kiosk={kiosk} />
                        <DeleteButton
                          id={kiosk.id}
                          type="Kiosk"
                          onDelete={DeleteKiosk}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Produktlista */}
          {/* <div>
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
                        {productList?.productlistname}
                      </h3>
                      {productList != undefined && (
                        <TrashIcon className="mr-5 w-5 h-5 place-self-center cursor-pointer hover:text-red-500" />
                      )}
                    </div>
                    {productList?.products.map((product, index) => (
                      <li key={index} className="list-inside ml-4">
                        {product.productname}
                      </li>
                    ))}
                  </ul>

                  {/*                  
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
          </div> */}
        </div>
      </section>
    </>
  );
}

export default Kioskmanager;
