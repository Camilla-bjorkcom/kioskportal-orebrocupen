
import CreateProductButton from "@/components/CreateProductButton";


import React, {useState} from "react";

function ProductHandler() {

  const [products, setProducts] = useState<string[]>([]);
  
  const handleSaveProduct = (productName: string) => {
    setProducts((prev) => [...prev, productName]);
  };
  return (
    <section>
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="font-bold text-4xl my-4">Produkthantering</h2>

    <CreateProductButton onSave={handleSaveProduct}/>
    <div className="mt-8">
          <h3 className="font-semibold text-2xl">Sparade produkter:</h3>
          <div className="mt-4 space-y-2">
            {products.map((product, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-md shadow"
              >
                {product}
              </div>
            ))}
          </div>
        </div>
      </div>
    

    </section>
  );
}

export default ProductHandler;

