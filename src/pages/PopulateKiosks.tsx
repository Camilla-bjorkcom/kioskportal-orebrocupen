import EditSelectedKioskButton from '@/components/EditSelectedKioskButton';
import SelectedKiosksButton from '@/components/SelectedKiosksButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Facility, Kiosk, Product, ProductList } from '@/interfaces';
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
  const [facilities, setFacilities ]= useState<Facility[]>([]);
  
  
  
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
  
  const kiosksByFacility = facilities.map((facility) => ({
    ...facility,
    kiosks: kiosks.filter((kiosk) => kiosk.facilityId === facility.id),
  }));



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
          
          setOpen(true);
           
      }
     
    } catch (error) {
      console.error("Error handling edit click:", error);
    }
    
    }
    const handleKioskUpdated = (updatedKiosk: Kiosk) => {
      setKiosks((prevKiosks) =>
        prevKiosks.map((kiosk) =>
          kiosk.id === updatedKiosk.id ? updatedKiosk : kiosk
        )
      );
    };
  
    const handleKiosksUpdated = (updatedKiosks: Kiosk[]) => {
      setKiosks((prevKiosks) =>
        prevKiosks.map((kiosk) =>
          updatedKiosks.find((updatedKiosk) => updatedKiosk.id === kiosk.id) || kiosk
        )
      );
    };
  
  

  return (
    <section>
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="mt-8 text-2xl pb-2 mb-4">Lägg till produktutbud i kiosker</h2>
        <div className="mt-8">
          <h3 className="text-lg">Skapade kiosker</h3>
          <div className="grid mb-4 lg:flex justify-between 2xl:w-3/4">
            <h5 className="text-base self-center mt-2">Välj kiosker att lägga till produkter till:</h5>
            <SelectedKiosksButton selectedKiosks={kiosksForUpdate}
                                  productLists={productLists} 
                                  products={products} 
                                 onClick={handleSubmit}
                                 onKiosksUpdated={handleKiosksUpdated} />
          </div>
          <Accordion type="single" collapsible className=" w-full 2xl:w-3/4">
            {kiosksByFacility.map((facility) => (
              <AccordionItem
                key={facility.id}
                value={facility.id}
                className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
              >
                <AccordionTrigger className="text-lg font-medium hover:no-underline mr-2">
                <div className="flex justify-between w-full">
                <label className="basis-1/4 font-medium hover:text-slate-800">
                
                  {facility.facilityname}
                  </label>
                  <p className='basis-1/5 hidden lg:block lg:min-w-36'>
                     Antal kiosker:{' '}
                      {Array.isArray(facility.kiosks) ? facility.kiosks.length : 0}
                       </p>
                       </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion type="single" collapsible>
                    {facility.kiosks.map((kiosk) => (
                      <AccordionItem
                        key={kiosk.id}
                        value={kiosk.id}
                        className="p-4 border border-gray-200 rounded-md shadow hover:bg-gray-50"
                      >
                        <AccordionTrigger className="flex self-end hover:no-underline">
                          <div className="w-full hover:no-underline">
                            <div className="flex justify-between">
                              <label className="basis-1/4 font-medium hover:text-slate-800">
                                {kiosk.kioskName}
                              </label>
                              <div className="flex self-end gap-4 place-items-center mr-2">
                                <p className='hidden lg:block '>
                                  Antal tillagda produkter:{' '}
                                  {Array.isArray(kiosk.products) ? kiosk.products.length : 0}
                                </p>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger >
                                      <EditSelectedKioskButton
                                        key={kiosk.id}
                                        kioskForEdit={kiosk}
                                        productLists={productLists}
                                        products={products}
                                        onEditClick={handleEditClick}
                                        onKioskUpdated={handleKioskUpdated}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Redigera kioskutbud</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <Checkbox
                                  className="w-6 h-6 mr-4 ml-4"
                                  id={`kiosk-${kiosk.id}`}
                                  checked={kiosksForUpdate.some((k) => k.id === kiosk.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setKiosksforUpdate((prev) => [...prev, kiosk]);
                                    } else {
                                      setKiosksforUpdate((prev) =>
                                        prev.filter((k) => k.id !== kiosk.id)
                                      );
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
                              {kiosk.products.map((product: Product, index: number) => (
                                <li key={index}>{product.productname}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500">
                              Inga produkter tillgängliga för denna kiosk.
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
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
