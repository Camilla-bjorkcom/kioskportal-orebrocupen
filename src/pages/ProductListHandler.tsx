

import CreateProductListButton from "@/components/CreateProductListButton";
import PagesHeader from "@/components/PagesHeader";
import { TrashIcon } from "@radix-ui/react-icons";



import  {useState} from "react";
import { useLocation } from "react-router-dom";

function ProductListHandler() {
const {pathname} = useLocation();
  const [productlists, setProductLists] = useState<string[]>([]);
  
  const handleSaveProductList = (productListName: string) => {
    setProductLists((prev) => [...prev, productListName]);
  };

  const handleDeleteProductsList = (index: number) => {
    setProductLists((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section>
      <PagesHeader pathname={pathname} />
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="font-bold text-4xl my-4">Produkthantering</h2>

    <CreateProductListButton onSave={handleSaveProductList}/>
    <div className="mt-8">
          <h3 className="font-semibold text-2xl">Sparade produktlistor:</h3>
          <div className="mt-4 flex gap-2">
            {productlists.map((productlist, index) => (
              <button>
              <div
                key={index}
                className="flex flex-col p-2 justify-between rounded-xl border-2
                 bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32">
              <div className="flex justify-between">
                <p className="font-semibold text-2xl flex">{productlist}</p>
                <button onClick={() => handleDeleteProductsList(index)}><TrashIcon className="w-8 h-6  hover:text-red-500 "></TrashIcon></button>
                </div>
                <p className="text-right">Lägg till produkter</p>
              </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    

    </section>
  );
}

export default ProductListHandler;

