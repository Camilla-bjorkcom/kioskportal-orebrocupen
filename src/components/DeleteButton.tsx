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

interface DeleteButtonProps {
  id: string; // ID för objektet som ska raderas
  type: "Facility" | "Kiosk"; // Typ av objekt
  onDelete: (id: string, type: "Facility" | "Kiosk") => void; // Callback för att radera
}

const DeleteButton = ({ id, type, onDelete }: DeleteButtonProps) => {
  const getDialogContent = () => {
    switch (type) {
      case "Facility":
        return {
          title: "Vill du radera anläggningen och dess kiosker?",
          description:
            "Den här åtgärden kan inte ångras. Anläggningen och dess kiosker kommer att tas bort permanent.",
        };
      case "Kiosk":
        return {
          title: "Vill du radera kiosken?",
          description:
            "Den här åtgärden kan inte ångras. Kiosken kommer att tas bort permanent.",
        };
      default:
        return {
          title: "Vill du radera objektet?",
          description: "Den här åtgärden kan inte ångras.",
        };
    }
  };

  const dialogContent = getDialogContent();
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex">
        <TrashIcon className=" mr-0.5 2xl:mr-5 w-5 h-5  hover:text-red-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(id, type)} // Skicka id och typ till callback
          >
            Radera
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
