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

type ProductsItem = {
  products: string[];
};

const allProducts: ProductsItem = 
  {  products: ["Hamburgare", "Kexchoklad", "Korv", "Coca-cola"] }
;

interface AddProductsButtonProps {
  onSave: (products: string) => void;
}

function AddProductsButton({ onSave }: AddProductsButtonProps) {
  const [selectedValue, setSelectedValue] = useState<
  string | undefined
  >();

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
        <p className="m-5 mb-2 flex w-fit gap-2 cursor-pointer font-semibold">
          Lägg till fler produkter <PlusIcon className="w-4 h-4 place-self-center" />
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lägg till enstaka produkter till kiosken</DialogTitle>
          <DialogDescription className="sr-only">
          Lägg till enstaka produkter till kiosken
          </DialogDescription>
        </DialogHeader>
        <Select onValueChange={handleChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Välj produktlista" />
          </SelectTrigger>
          <SelectContent>
            {allProducts?.products.map((product, index) => (
              <SelectItem key={index} value={product}>
                {product}
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
            Lägg till produkt
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductsButton;
