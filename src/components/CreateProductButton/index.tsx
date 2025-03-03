import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Plus } from "lucide-react";
 
import CreateProductForm from "./CreateProductForm";
import { useState } from "react";
  
  
  
  interface CreateProductProps {
    tournamentId: string;
  }
  
  function CreateProductButton({ tournamentId }: CreateProductProps) {
    const [open, setOpen] = useState(false);
    
    return(
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="text-md">
            Skapa Produkt <Plus />
          </Button>
        </DialogTrigger>
        <DialogOverlay className="backdrop-blur-0" />
        <DialogContent blur={false}>
          <DialogHeader>
            <DialogTitle>Skapa Produkt</DialogTitle>
            <DialogDescription className="sr-only">
              Fyll i informationen för att skapa en ny Produkt
            </DialogDescription>
          </DialogHeader>
         <CreateProductForm tournamentId={tournamentId} 
         onDialogClosed={() => setOpen(false)}
         />
        </DialogContent>
      </Dialog>
    )   
  }
  
  export default CreateProductButton;
  