import EditSelectedKioskButton from '@/components/EditSelectedKioskButton';
import SelectedKiosksButton from '@/components/SelectedKiosksButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Kiosk, Product, ProductList } from '@/interfaces';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';



function PopulateKiosks() {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [open, setOpen] = useState(false);
  const [kiosksForUpdate, setKiosksforUpdate] = useState<Kiosk[]>([]);
  const [kioskForEdit, setKioskForEdit] = useState<Kiosk>();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [productLists, setProductLists] = useState<ProductList[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  // Fetch Kiosks
  useQuery<Kiosk[]>({
    queryKey: ['kiosks'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/kiosks');
      if (!response.ok) throw new Error('Failed to fetch kiosks');
      const data = await response.json();
      console.log(data); 
      setKiosks(data);
      return data;
    },
  });

  useQuery<ProductList[]>({
    queryKey: ['productlists'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/productslists');
      if (!response.ok) throw new Error('Failed to fetch product lists');
      const data = await response.json();
      setProductLists(data);
      console.log("listor",data)
      return data;
    },
    
  });

  // Fetch Products
  useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      console.log("varor",data)
      return data;
    },
  });
  
  


  const handleSubmit = (open: boolean) => {
    if (open && kiosksForUpdate.length === 0) {
      alert('Du måste välja minst en kiosk!');
      return;
    }
    console.log('Valda kiosker:', kiosksForUpdate);
    // Här kan du öppna en dialog eller skicka datan till en API-endpoint
    alert(`Du har valt ${kiosksForUpdate.length} kiosker.`);
  };

  const handleEditClick = async (kiosk: Kiosk) => {
    console.log("handleEditClick körs för kiosk:", kiosk);
    console.log("produkter", products);
    console.log("produktlistor" ,productLists)
   
      try {
        setKioskForEdit(kiosk);
        const response = await fetch(`http://localhost:3000/kiosks/${kiosk.id}`)
        if (!response.ok) {
          console.error("Failed to fetch kiosk products");
         
        } else {
          const data = await response.json();
          console.log(data)
          setSelectedProducts(kiosk.products);  
          console.log(selectedProducts)  
          setOpen(true);
           
      }
     
    } catch (error) {
      console.error("Error handling edit click:", error);
    }
    
    }
  
  

  return (
    <section>
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="mt-8 text-2xl pb-2 mb-4">Lägg till produktutbud i kiosker</h2>
        <div className="mt-8">
          <h3 className="text-lg">Skapade kiosker</h3>
          <div className="flex justify-between w-3/4">
            <h5 className="text-base">Välj kiosker att lägga till produkter till:</h5>
            <SelectedKiosksButton selectedKiosks={kiosksForUpdate}
                                  productLists={productLists} 
                                  products={products} 
                                 onClick={handleSubmit}/>
          </div>

          <Accordion type="single" collapsible className='w-3/4'>
            {kiosks.map((kiosk) => (
              <AccordionItem
                key={kiosk.id}
                value={kiosk.id}
              >
                <AccordionTrigger  className="flex self-end">

               <div className='w-full'>
                <div className='flex justify-between'>
                  <label
                  
                    className="basis-1/4 font-medium hover:text-slate-800 cursor-pointer"
                  >
                    {kiosk.kioskName}
                    
                  </label>
                  <div className="flex self-end gap-4 place-items-center mr-2">
                  <p>
                   Antal tillagda produkter: {Array.isArray(kiosk.products) ? kiosk.products.length : 0}
                    </p>
                  <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                  <EditSelectedKioskButton
                 key={kiosk.id}
                 kioskForEdit={kiosk}
                 productLists={productLists}
                 products={products}
                 onEditClick={handleEditClick}
                />
                  </TooltipTrigger>
                        <TooltipContent>
                          <p>Redigera kioskutbud</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  <Checkbox
                    id={`kiosk-${kiosk.id}`}
                    checked={kiosksForUpdate.some((k) => k.id === kiosk.id)}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Lägg till kiosk i listan
                        setKiosksforUpdate((prev) => [...prev, kiosk]);
                      } else {
                        // Ta bort kiosk från listan
                        setKiosksforUpdate((prev) => prev.filter((k) => k.id !== kiosk.id));
                      }
                    }}
                  />
                  </div>
                </div>
                </div>
                </AccordionTrigger>
                <AccordionContent>
                
                  {kiosk.products && kiosk.products.length > 0 ? (
                    <ul className="grid grid-cols-3 gap-4">
                      {kiosk.products.map((product : Product, index: number) =>(
                         <li key={index}>
                         
                         {product.productname} 
                         
                       </li>
                       
                      ) )}
                      
                    </ul>
                  ): (
                    <p className="text-gray-500">Inga produkter tillgängliga för denna kiosk.</p>
                  )}
                  
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default PopulateKiosks;
