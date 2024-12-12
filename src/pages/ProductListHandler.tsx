

import CreateProductListButton from "@/components/CreateProductListButton";
import HandleProductListButton from "@/components/HandleProductListButton";
import { TrashIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import  {useState} from "react";
import { useLocation } from "react-router-dom";


interface Product {
  id: number;
  productname: string;
}

interface ProductList {
  id: number;
  productlistname: string;
  products: Product[];
}

function ProductListHandler() {
  const { pathname } = useLocation();
 
  // State för produktlistor
  const [productlists, setProductLists] = useState<ProductList[]>([]);

  // Hämta produktlistor med React Query
  const { isLoading, error } = useQuery<ProductList[]>({
    queryKey: ["productslists"],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/productslists');
      if (!response.ok) {
        throw new Error("Failed to fetch product lists");
      }
      const data = await response.json();
      console.log(data);
      setProductLists(data);
 
      return data;
    },
  });

  const updateProductList = (updatedList: ProductList) => {
    setProductLists((prev) =>
      prev.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  };

  // Spara ny produktlista (POST)
  const SaveProductList = async (productListName: string) => {
    try {
      const response = await fetch('http://localhost:3000/productslists', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productlistname: productListName, products: [] }),
      });
      if (!response.ok) {
        throw new Error("Failed to save product list");
      }
      const newProductList = await response.json();
      setProductLists((prev) => [...prev, newProductList]); // Lägg till ny lista i state
    } catch (error) {
      console.error(error);
    }
  };

  // Ta bort produktlista (DELETE)
  const DeleteProductsList = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/productslists/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product list");
      }
      setProductLists((prev) => prev.filter((list) => list.id !== id)); // Uppdatera state lokalt
    } 
    catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div>Loading productlists...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }
  return (
    <section>
      
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="font-bold text-4xl my-4">Produktlistor</h2>

        <CreateProductListButton onSave={SaveProductList}  />
      <div className="mt-8 w-3/4">
          <h3 className="font-semibold text-2xl">Sparade produktlistor:</h3>
          <div className="mt-4 gap-3 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productlists.map((productlist) =>  (
              <HandleProductListButton key={productlist.id} productlist={productlist} onUpdate={updateProductList} >
              <div className="p-2 rounded-xl border-2 cursor-pointer aspect-video h-40 md:h-full
                 shadow hover:bg-slate-800 hover:text-white text-black">
              <div className="flex justify-between">
                <p className="font-semibold text-lg flex">{productlist.productlistname}</p>
                <button onClick={() => DeleteProductsList(productlist.id)}><TrashIcon className="w-8 h-6  hover:text-red-500 "></TrashIcon></button>
                </div>      
              </div>
              </HandleProductListButton>
            ))}
          </div>
        </div>
      </div>
    

    </section>
  );
}

export default ProductListHandler;

