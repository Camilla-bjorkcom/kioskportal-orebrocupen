import React, { useState } from 'react'
import { Kiosk, Product, ProductList } from '@/interfaces';
import { useQuery } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Pencil2Icon } from '@radix-ui/react-icons';


interface EditSelectedKioskButtonProps {
  kioskForEdit : Kiosk;
  onClick: (open :boolean) => void;
}

function EditSelectedKioskButton({kioskForEdit}: EditSelectedKioskButtonProps) {
  const [productLists, setProductLists] = useState<ProductList[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProductListId, setSelectedProductListId] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Fetch Product Lists
  useQuery<ProductList[]>({
    queryKey: ['productlists'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/productslists');
      if (!response.ok) throw new Error('Failed to fetch product lists');
      const data = await response.json();
      setProductLists(data);
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
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setProducts([]);
      }
      
      return data;
    },
  });

  const handleEditClick= async (isOpen: boolean) => {
    setOpen(isOpen);

      const response = await fetch(`http://localhost:3000/kiosks/${kioskForEdit.id}`)
      if (!response.ok) {
        console.error("Failed to fetch kiosk products");
        setSelectedProducts([]); // Återställ vid fel
      } else {
        const data = await response.json();
        setSelectedProducts(data.products || [])
    }
  }
  const handleProductListChange = (value: string) => {
    setSelectedProductListId(value);
    const selectedList = productLists.find((list) => list.id === value);

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

  return (
    <Dialog open={open} onOpenChange={handleEditClick}>
      <DialogTrigger asChild>
        <button className="flex flex-col  hover:text-orange-n">
               <Pencil2Icon className="w-8 h-6"  />
             </button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg">Vald kiosk: {kioskForEdit.kioskName}</DialogTitle>
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
                onCheckedChange={(checked) => {
                  setSelectedProducts((prev) =>
                    checked
                      ? [...prev, product] 
                      : prev.filter((p) => p.id !== product.id) 
                  );
                }}
              />
              <label htmlFor={`product-${product.id}`} className="font-medium cursor-pointer">
                {product.productname}
              </label>
            </div>
          ))}
        </div>
        <Button type="submit">Spara valda produkter till valda kiosker</Button>
      </DialogContent>
    </Dialog>
  );
}

export default EditSelectedKioskButton