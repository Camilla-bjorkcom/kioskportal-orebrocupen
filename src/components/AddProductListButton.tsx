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
import { useState } from "react";

type ProductListItem = {
  productlistname: string;
};

const productList: ProductListItem[] = [
  { productlistname: "Standard skola" },
  { productlistname: "Standard kiosk" },
];


interface AddProductListButtonProps {
    onSave: (productList: string) => void; 
  }
  function AddProductListButton({ onSave }: AddProductListButtonProps) {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
  
    const handleChange = (value: string) => {
      setSelectedValue(value);
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
            Lägg till <PlusIcon className="w-4 h-4 place-self-center" />
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
              {productList.map((product, index) => (
                <SelectItem key={index} value={product.productlistname.toLowerCase()}>
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
