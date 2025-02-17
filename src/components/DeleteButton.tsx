import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";
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
import { badToast, okToast } from "@/utils/toasts";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";

interface DeleteButtonProps {
  id: string; // ID för objektet som ska raderas
  type: "Facility" | "Kiosk" | "ContactPerson" | "Productlist"; // Typ av objekt
  onDelete: (
    id: string,
    type: "Facility" | "Kiosk" | "ContactPerson" | "Productlist"
  ) => Promise<void>; // Callback för att radera
}

const DeleteButton = ({ id, type, onDelete }: DeleteButtonProps) => {
  const queryClient = useQueryClient();
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
      case "ContactPerson":
        return {
          title: "Vill du radera kontaktpersonen?",
          description:
            "Den här åtgärden kan inte ångras. Kontaktpersonen kommer att tas bort permanent.",
        };
      case "Productlist":
        return {
          title: "Vill du radera produktlistan?",
          description:
            "Den här åtgärden kan inte ångras. Produktlistan kommer att tas bort permanent.",
        };
      default:
        return {
          title: "Vill du radera objektet?",
          description: "Den här åtgärden kan inte ångras.",
        };
    }
  };

  function deleteConfirmed() {
    try {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });

      okToast(`Objektet raderades`);
    } catch (error) {
      if (error instanceof NoResponseError) {
        badToast("Misslyckades med att radera objektet.");
      } else {
        badToast("Misslyckades med att radera objektet.");
      }
    }
  }

  const dialogContent = getDialogContent();
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex w-fit">
        <TrashIcon className=" mr-0.5 w-5 h-5  hover:text-red-500" />
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
            onClick={() => {
              onDelete(id, type).then(() => deleteConfirmed());
            }}
          >
            Radera
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteButton;
