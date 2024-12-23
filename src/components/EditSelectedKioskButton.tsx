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
  onKioskUpdated: (updatedkiosk: Kiosk) =>void;
  
  onEditClick: (kiosk: Kiosk) => void;
}
function EditSelectedKioskButton({
  kioskForEdit,
  productLists,
  products,
  onKioskUpdated,
  onEditClick,
}: EditSelectedKioskButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductListId, setSelectedProductListId] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleDialogOpen = async (isOpen: boolean) => {
    if (isOpen) {
      await onEditClick(kioskForEdit); // Ladda kiosken
      setSelectedProducts(kioskForEdit.products || []); // Sätt initiala produkter
      setOpen(true);
    } else {
      setOpen(false);
      setSelectedProductListId('');
      setSelectedProducts([]);
    }
  };

  const handleProductListChange = (value: string) => {
    const selectedList = productLists.find((list) => list.id === value);
    if (selectedList) {
      setSelectedProductListId(value);
      setSelectedProducts(selectedList.products);
    } else {
      setSelectedProductListId('');
      setSelectedProducts([]);
    }
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

  const editKiosk = async (kioskForEdit: Kiosk) => {
    try {
      const response = await fetch(`http://localhost:3000/kiosks/${kioskForEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: kioskForEdit.id,
          products: selectedProducts,
          kioskName: kioskForEdit.kioskName,
          facilityId: kioskForEdit.facilityId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update kiosk");
      }

      const updatedKiosk = await response.json();
      alert("Produkter har sparats!");
      onKioskUpdated(updatedKiosk); // Skicka tillbaka uppdaterad kiosk
      setOpen(false); // Stäng dialogen
    } catch (error) {
      console.error("Failed to update kiosk:", error);
      alert("Kunde inte uppdatera produkterna. Försök igen.");
    }
  };

  if (!kioskForEdit || !productLists || !products) {
    return null; // Rendera inte om data saknas
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <DialogTrigger>
        <div
          className="flex flex-col hover:text-orange-n"
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
        >
          <Pencil2Icon className="w-8 h-6" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Vald kiosk: {kioskForEdit ? kioskForEdit.kioskName : "Ingen kiosk vald"}
          </DialogTitle>
        </DialogHeader>

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
            {allSelected ? "Avmarkera alla" : "Markera alla"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-2">
              <Checkbox
                id={`product-${product.id}`}
                checked={selectedProducts.some((p) => p.id === product.id)}
                onCheckedChange={(checked) =>
                  setSelectedProducts((prev) =>
                    checked
                      ? [...prev, product]
                      : prev.filter((p) => p.id !== product.id)
                  )
                }
              />
              <label htmlFor={`product-${product.id}`} className="font-medium cursor-pointer">
                {product.productname}
              </label>
            </div>
          ))}
        </div>

        <Button type="submit" onClick={() => editKiosk(kioskForEdit)}>
          Spara valda produkter till valda kiosker
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default EditSelectedKioskButton;
