import { Product, Productlist } from "@/interfaces";
import { Pencil } from "lucide-react";
import UpdateProductListForm from "./UpdateProductListForm";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";

interface UpdateProductListButtonProps {
  productlist: Productlist;
  tournamentId: string;
  tournamentProducts: Product[];
}

function UpdateProductListButton(props: UpdateProductListButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto dark:hover:bg-slate-600 dark:hover:text-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          Redigera produktlista <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Uppdatera produktlista</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny produktlista.
          </DialogDescription>
        </DialogHeader>
        <UpdateProductListForm
          {...props}
          onDialogClosed={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProductListButton;
