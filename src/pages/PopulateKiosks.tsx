import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react'


interface Kiosk {
    id: string,
    kioskName: string,
}

interface Product {
    id: string, 
    productname: string,
}

interface ProductList {
    id: string,
    productlistname: string,
    products: Product[];
}


function PopulateKiosks() {

    const [kiosks , setKiosks] = useState<Kiosk[]>([]);
    const [productLists, setProductLists] = useState<ProductList[]>([]);
    const [products, setProducts] = useState<Product[]>([]);


    useQuery<Kiosk[]>({
        queryKey: ["kiosks"],
        queryFn: async () => {
          const response = await fetch("http://localhost:3000/kiosks");
          if (!response.ok) {
            throw new Error("Failed to fetch kiosks");
          }
          const data = await response.json();
          setKiosks(data);
          return data;
        },
      });

      useQuery<ProductList[]>({
        queryKey: ["productlists"],
        queryFn: async () => {
            const response = await fetch("http://localhost:3000/productslists");
            if (!response.ok) {
                throw new Error("failed to fetch productlists");
            }
            const data = await response.json();
            setProductLists(data);
            return data;
            
        }, 
      });

      useQuery<Product[]>({
        queryKey:["products"],
        queryFn: async () => {
            const response = await fetch ("http://localhost:3000/products");
            if (!response.ok) {
                throw new Error("failed to fetch products");
            }
            const data = await response.json();
            setProducts(data);
            return data;
            
        }, 
      });
      
  return (
    <div>PopulateKiosks</div>
  )
}

export default PopulateKiosks