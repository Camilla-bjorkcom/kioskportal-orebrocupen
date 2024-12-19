import React, { useState } from 'react'
import { Kiosk, Product, ProductList } from '@/interfaces';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Pencil2Icon } from '@radix-ui/react-icons';





interface EditSelectedKioskButtonProps {
  kioskForEdit: Kiosk;
  productLists: ProductList[];
  products: Product[];

  onEditClick: (kiosk: Kiosk) => void;
}
function EditSelectedKioskButton({
  kioskForEdit,
  productLists,
  products,
 
  onEditClick,
 
}: EditSelectedKioskButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductListId, setSelectedProductListId] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  

  const handleDialogOpen = async (isOpen: boolean) => {
    if (isOpen) {
      await onEditClick(kioskForEdit); // Vänta på att `handleEditClick` körs
      setOpen(true); // Öppna dialogen
    } else {
      setOpen(false); // Stäng dialogen om det behövs
    }
  };

  const handleProductListChange = (value: string) => {
    setSelectedProductListId(value);
    const selectedList = productLists.find((list) => list.id === value);
    setSelectedProducts(selectedList ? selectedList.products : []);
  };

  const toggleSelectAll = () => {
    if (products.every((product) => selectedProducts.some((p) => p.id === product.id))) {
      setSelectedProducts([]); // Avmarkera alla
    } else {
      setSelectedProducts(products); // Markera alla
    }
  };

  const allSelected = products.length > 0 && products.every((product) =>
    selectedProducts.some((p) => p.id === product.id)
  );

  const editKiosk = async (kioskForEdit : Kiosk) => {
    console.log(kioskForEdit);
    if (!kioskForEdit) {
      alert("Ingen kiosk vald. Vänligen välj en kiosk att redigera.");
      return;
    }
    console.log("Uppdaterar kiosk:", kioskForEdit);
    
    try{
  
    const response= await fetch(`http://localhost:3000/kiosks/${kioskForEdit.id}`, {
      method:"PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: kioskForEdit.id,
        products: selectedProducts, 
        kioskName: kioskForEdit.kioskName
      }),
    });
    if(!response.ok) {
      throw new Error("Failed to update product");
    }
    const data = await response.json();
    console.log("skickat till databas", data)
    alert("Produkter har sparats!");
    
  }
  catch (error) {
    console.error("Failed to update product:", error);
    alert("Kunde inte uppdatera produkten. Försök igen.");
  }
}

  

  
 
  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger>
        <div className="flex flex-col  hover:text-orange-n"role="button" tabIndex={0}  onClick={() => setOpen(true)}>
               <Pencil2Icon className="w-8 h-6"/>
             </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Vald kiosk: {kioskForEdit ? kioskForEdit.kioskName : "Ingen kiosk vald"}</DialogTitle>
          
        </DialogHeader>

        {/* Select för produktlista */}
        <Select value={selectedProductListId} onValueChange={handleProductListChange}>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Lägg till produkter från produktlista" />
          </SelectTrigger>
          <SelectContent>
            {productLists.map((productList) => (
              <SelectItem key={productList.id} value={productList.id}>
                {productList.productlistname}
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
                    onCheckedChange={(checked: boolean) => {
                      setSelectedProducts((prev: Product[]) =>
                        checked
                          ? [...prev, product] // Lägg till produkt
                          : prev.filter((p) => p.id !== product.id) // Ta bort produkt
                      );
                    }}
                  />
              <label htmlFor={`product-${product.id}`} className="font-medium cursor-pointer">
                {product.productname}
              </label>
            </div>
          ))}
        </div>
        <Button type="submit" onClick={() =>editKiosk(kioskForEdit)} >Spara valda produkter till valda kiosker</Button>
      </DialogContent>
    </Dialog>
  );
}

export default EditSelectedKioskButton