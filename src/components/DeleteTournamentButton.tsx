import { deleteTournament } from "@/api/functions/deleteTournament";
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
import { badToast, okToast } from "@/utils/toasts";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface DeleteTournamentButtonProps {
  tournamentId: string;
}

const DeleteTournamentButton = ({
  tournamentId,
}: DeleteTournamentButtonProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleDeleteTournament = async () => {
    try {
      await deleteTournament(tournamentId);
      navigate("/tournaments");
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
      okToast("Turneringen raderades");
      
    } catch (error) {
      badToast("Misslyckades radera turnering");
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
