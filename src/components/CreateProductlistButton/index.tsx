import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import CreateProductlistForm from "./CreateProductlistForm";


interface CreateProductListButtonProps {
  tournamentId: string;
}

function CreateProductListButton( props: CreateProductListButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-md">
          Skapa Produktlista <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa Produktlista</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny produktlista
          </DialogDescription>
        </DialogHeader>
        <CreateProductlistForm{...props}
        onDialogClosed={() => setOpen(false)}
        />
        </DialogContent>
        </Dialog>
  )}
  export default CreateProductListButton;