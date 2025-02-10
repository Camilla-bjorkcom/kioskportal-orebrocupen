import fetchWithAuth from "@/api/functions/fetchWithAuth";
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
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DeleteTournamentButtonProps {
  tournamentId: string;
  onDelete: (id: string) => void;
}

const DeleteTournamentButton = ({
  tournamentId,
  onDelete,
}: DeleteTournamentButtonProps) => {
  const handleDeleteTournament = async () => {
    try {
      const response = await fetchWithAuth(`tournaments/${tournamentId}`, {
        method: "DELETE",
      });
      if (!response) {
        throw new Error("Failed to fetch");
      }
      if (!response.ok) {
        throw new Error("Failed to delete tournament");
      }
      if (response.ok) {
        toast({
          title: "Lyckat",
          description: "Turneringen har tagits bort",
          className: "bg-green-200 dark:bg-green-400 dark:text-black",
        });
      }
      onDelete(tournamentId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>Ta bort turnering</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Är du säker?</AlertDialogTitle>
          <AlertDialogDescription>
            Den här åtgärden kan inte ångras. Turneringen och dess data kommer
            att tas bort permanent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTournament}>
            Jag är säker
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTournamentButton;
