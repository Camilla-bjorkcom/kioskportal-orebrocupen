"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PlusIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ProductList {
  id: number;
  productlistname: string;
  products: Product[];
}
interface Product {
  id: number;
  productname: string;
}
interface AddProductListButtonProps {
  onSave: (productlists: ProductList | undefined) => void;
}

function AddProductListButton({ onSave }: AddProductListButtonProps) {
  const [selectedValue, setSelectedValue] = useState<
  ProductList | undefined
  >();

  const [productlists, setProductLists] = useState<ProductList[]>([]);

  useQuery<ProductList[]>({
    queryKey: ["productslists"],
    queryFn: async () => {
      const response = await fetch( `http://localhost:3000/productslists`);
      if (!response.ok) {
        throw new Error("Failed to fetch facilites");
      }
      const data = await response.json();
      setProductLists(data);
      return data;
    },
  });
  
  const handleChange = (value: ProductList["productlistname"]) => {
    const selectedProductList = productlists.find(
      (product) => product.productlistname === value
    );
    setSelectedValue(selectedProductList);
  };
  

  const handleSave = () => {
    if (selectedValue) {
      onSave(selectedValue);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="m-5 flex w-fit gap-2 cursor-pointer font-semibold">
          Lägg till produktlista<PlusIcon className="w-4 h-4 place-self-center" />
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lägg till produktlista</DialogTitle>
          <DialogDescription className="sr-only">
            Lägg till produktlista för kiosk
          </DialogDescription>
        </DialogHeader>
        <Select onValueChange={handleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Välj produktlista" />
          </SelectTrigger>
          <SelectContent>
            {productlists.map((product, index) => (
              <SelectItem key={index} value={product.productlistname}>
                {product.productlistname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
          >
            Spara produktlista
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductListButton;
