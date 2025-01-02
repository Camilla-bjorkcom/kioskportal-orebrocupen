import { Facility, Kiosk, ProductList } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const DashboardStats = () => {

const [facilities , setFacilities]= useState<Facility[]>([]);
const [kiosks, setKiosks] = useState<Kiosk[]>([]);
const [productlists, setProductLists]= useState<ProductList[]>([]);


useQuery<Facility[]>({
  queryKey: ["facilities"],
  queryFn: async () => {
    const response = await fetch("http://localhost:3000/facilities");
    if (!response.ok) {
      throw new Error("Failed to fetch facilites");
    }
    const data = await response.json();
    setFacilities(data);
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

useQuery<ProductList[]>({
    queryKey: ["productslists"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/productslists");
      if (!response.ok) {
        throw new Error("Failed to fetch product lists");
      }
      const data = await response.json();
      console.log(data);
      setProductLists(data);

      return data;
    },
  });






  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
      <div className="flex flex-col p-2 justify-between rounded-xl border-2 border-solid text-black aspect-video w-1/2 md:w-full md:h-full">
        <p className="text-left w-full xl:ml-7 mt-2 lg:mt-5 text-sm  sm:text-xl lg:text-lg">
          Anläggningar
        </p>
        <p className="text-right lg:m-5 lg:text-3xl text-xl">{' '}
                      {Array.isArray(facilities) ? facilities.length : 0}
                       </p>
      </div>
      <div className="flex flex-col p-2 justify-between rounded-xl border-2 border-solid text-black aspect-video w-1/2 md:w-full md:h-full">
        <p className="text-left w-full xl:ml-7 mt-2 lg:mt-5 text-sm sm:text-xl  lg:text-lg">
          Kiosker
        </p>
        <p className="text-right  lg:m-5  lg:text-3xl text-xl"> {Array.isArray(kiosks) ? kiosks.length : 0}</p>
      </div>
      <div className="flex flex-col p-2 justify-between rounded-xl border-2 border-solid text-black aspect-video w-1/2 md:w-full md:h-full">
        <p className="text-left w-full xl:ml-7 mt-2 lg:mt-5  text-sm sm:text-xl lg:text-lg">
          Produktlistor
        </p>
        <p className="text-right  lg:m-5  lg:text-3xl text-xl"> {Array.isArray(productlists) ? productlists.length : 0}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
