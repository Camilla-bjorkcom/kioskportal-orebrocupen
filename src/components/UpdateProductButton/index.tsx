import { TournamentProduct } from "@/interfaces/product";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import UpdateProductForm from "./UpdateProductForm";

interface UpdateProductButtonProps {
  product: TournamentProduct;
  tournamentId: string;
  
}

function UpdateProductButton(
  props : UpdateProductButtonProps) {
  const [open, setOpen] = useState(false);

  const product = props.product;



return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="flex border-2 border-transparent hover:border-solid hover:border-1 rounded-md hover:text-white hover:bg-black dark:bg-slate-900 dark:hover:bg-slate-600 dark:text-gray-200">
          <p className="ml-2">{product.productName}</p>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redigera Produkt</DialogTitle>
          <DialogDescription className="sr-only">
            Uppdatera informationen för redigera Produkt
          </DialogDescription>
        </DialogHeader>
        <UpdateProductForm {...props}
        onDialogClosed = {() => setOpen(false)}/>
        </DialogContent>
        </Dialog>
);
}
  export default UpdateProductButton;