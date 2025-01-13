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

interface DeleteTournamentButtonProps {
  tournamentId: string; // ID för turneringen som ska tas bort
  onDelete: (id: string) => void; // Callback-funktion som körs efter lyckad borttagning
}

const DeleteTournamentButton = ({ tournamentId, onDelete }: DeleteTournamentButtonProps) => {
  const handleDeleteTournament = async () => {
    try {
      const response = await fetch(`https://zxilxqtzdb.execute-api.eu-north-1.amazonaws.com/prod/tournaments/${tournamentId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete tournament");
      }
      onDelete(tournamentId); // Uppdaterar SettingsPage efter borttagning
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
            Den här åtgärden kan inte ångras. Turneringen och dess data kommer att tas bort permanent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Avbryt</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTournament}>Jag är säker</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteTournamentButton;