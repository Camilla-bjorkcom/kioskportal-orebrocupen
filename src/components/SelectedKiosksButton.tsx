import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { Kiosk, Product, Productlist } from '@/interfaces';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

interface SelectedKiosksButtonProps {
  selectedKiosks: Kiosk[]; // Lista över valda kiosker
  productlists: Productlist[]; // Produktlistor skickas från PopulateKiosks
  products: Product[]; // Produkter skickas från PopulateKiosks
  onClick: (open :boolean) => void; 
  onKiosksUpdated: (updatedKiosks: Kiosk[]) => void;
  onClearSelected: ()=> void;
}

function SelectedKiosksButton({ selectedKiosks,
  productlists,
  products , onKiosksUpdated, onClearSelected}: SelectedKiosksButtonProps) {
  
  const [open, setOpen] = useState(false);
  const [selectedProductListId, setSelectedProductListId] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  

  const handleDialogOpenChange = async (isOpen: boolean) => {

    if (isOpen && selectedKiosks.length === 0) {
        alert('Du måste välja minst en kiosk!');
        return; 
      }
    setOpen(isOpen);
    setSelectedProducts([]); // Återställ om dialogen stängs eller inga kiosker finns
    
  };


  const handleProductListChange = (value: string) => {
    setSelectedProductListId(value);
    const selectedList = productlists.find((list) => list.id === value);

    if (selectedList) {
      setSelectedProducts(selectedList.products);
    } else {
      setSelectedProducts([]); 
    }
  };

  
  const allSelected = products.length > 0 && products.every((product) =>
    selectedProducts.some((p) => p.id === product.id)
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedProducts([]); 
    } else {
      setSelectedProducts(products); 
    }
  };

  const saveProductsToKiosks = async () => {
   
    if (selectedProducts.length === 0) {
        alert("Du måste välja minst en produkt!");
        return;
        
      }
      const updatedKioskList = [];

    for (const kiosk of selectedKiosks) {
        const response = await fetch(`http://localhost:3000/kiosks/${kiosk.id}`, 
            {
               method: "PUT",
               headers: {'Content-Type': 'application.json'},
               body: JSON.stringify({
                kioskName: kiosk.kioskName,
                products: selectedProducts,
                facilityId: kiosk.facilityId
              }),
            })
            if(!response.ok) {
                const errorText = await response.text();
                console.error("Server response error:", errorText);
                throw new Error("Failed to update list");
            }
            const updatedKiosk = await response.json();
            console.log(updatedKiosk);
            
            updatedKioskList.push(updatedKiosk);
            onKiosksUpdated(updatedKioskList);
            onClearSelected();
            setOpen(false);
           ;

      }
      alert("kioskerna har nu produkter tillagda");
    };
    

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className=''>
          Valda kiosker att lägga till produkter i ({selectedKiosks.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Valda kiosker:</DialogTitle>
          <ul className="mt-4 list-disc list-inside">
            {selectedKiosks.map((kiosk) => (
              <li key={kiosk.id}>{kiosk.kioskName}</li>
            ))}
          </ul>
        </DialogHeader>

        {/* Select för produktlista */}
        <Select value={selectedProductListId} onValueChange={handleProductListChange}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Lägg till produkter från produktlista" />
          </SelectTrigger>
          <SelectContent>
            {productlists.map((productlist) => (
              <SelectItem key={productlist.id} value={productlist.id}>
                {productlist.productlistName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

       
        <div className="mb-4 text-right">
          <Button type="button" onClick={toggleSelectAll}>
            {allSelected ? 'Avmarkera alla' : 'Markera alla'}
          </Button>
        </div>

        {/* Produktlista */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-2">
              <Checkbox
                id={`product-${product.id}`}
                checked={selectedProducts.some((p) => p.id === product.id)}
                onCheckedChange={(checked) => {
                  setSelectedProducts((prev) =>
                    checked
                      ? [...prev, product] 
                      : prev.filter((p) => p.id !== product.id) 
                  );
                }}
              />
              <label htmlFor={`product-${product.id}`} className="font-medium cursor-pointer">
                {product.productName}
              </label>
            </div>
          ))}
        </div>
        <Button type="submit" onClick={saveProductsToKiosks}>Spara valda produkter till valda kiosker</Button>
      </DialogContent>
    </Dialog>
  );
}

export default SelectedKiosksButton;
