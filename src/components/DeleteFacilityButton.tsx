import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { TrashIcon } from "lucide-react";
  
interface DeleteFacilityButtonProps {
    id: number; 
    onDelete: (id: number) => void;
  }



const DeleteFacilityButton = ({onDelete, id }: DeleteFacilityButtonProps) => {
  return (
    <AlertDialog>
    <AlertDialogTrigger>
      <TrashIcon className="mr-5 w-5 h-5 place-self-center hover:text-red-500" />
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Vill du radera anläggningen och dess kiosker?
        </AlertDialogTitle>
        <AlertDialogDescription>
          Den här åtgärden kan inte ångras. Anläggningen och
          dess kiosker kommer att tas bort permanent.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Avbryt</AlertDialogCancel>
        <AlertDialogAction
             onClick={() => onDelete(id)} 
        >
          Radera
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default DeleteFacilityButton