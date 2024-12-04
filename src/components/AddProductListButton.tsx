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
  productListName: string;
  products: string[];
};

const productList: ProductListItem[] = [
  { productListName: "Standard skola", products: ["Hamburgare", "Kexchoklad","Korv", "Banan", "Dressing", "Rostad lök", "Festis päron", "Festis hallon", "Loka naturell", "Loka citron", "Loka hallon", "Coca-cola", "Sprite", "Coca-cola zero", "Fanta", "Gurka", "Senap", "Ketchup", "Korvbröd", "Ost", "Festis citron", "Festis naturell"] },
  { productListName: "Standard kiosk", products: ["Hamburgare", "Kexchoklad","Korv", "Banan", "Dressing", "Rostad lök", "Festis päron", "Festis hallon", "Loka naturell", "Loka citron", "Loka hallon", "Coca-cola", "Sprite", "Coca-cola zero", "Fanta", "Gurka", "Senap", "Ketchup", "Korvbröd", "Ost", "Festis citron", "Festis naturell"] },
];

interface AddProductListButtonProps {
  onSave: (productList: ProductListItem | undefined) => void;
}

function AddProductListButton({ onSave }: AddProductListButtonProps) {
  const [selectedValue, setSelectedValue] = useState<
    ProductListItem | undefined
  >();

  const handleChange = (value: ProductListItem["productListName"]) => {
    const selectedProductList = productList.find(
      (product) => product.productListName === value
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
            {productList.map((product, index) => (
              <SelectItem key={index} value={product.productListName}>
                {product.productListName}
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
