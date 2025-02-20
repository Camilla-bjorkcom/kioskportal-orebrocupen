import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateTournament } from "@/interfaces/tournament";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";
import { useNavigate } from "react-router-dom";
import { updateTournament } from "@/api/functions/updateTournament";
import { badToast, okToast } from "@/utils/toasts";
import { NoResponseError } from "@/api/functions/apiErrors";
import { Toaster } from "./ui/toaster";

const UpdateTournamentSheet = ({
  tournament,
  tournamentId,
}: {
  tournament: UpdateTournament;
  tournamentId: string;
}) => {
  const [formData, setFormData] = useState(tournament);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(tournament);
  }, [tournament]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const updatedTournament = await updateTournament(tournamentId, formData);

      if (!updatedTournament)
        throw new NoResponseError("No response from server");
      okToast("Turneringen har uppdaterats");
      queryClient.invalidateQueries({ queryKey: ["tournament"] });

      
    } catch (error) {
      console.error("Failed to update tournament:", error);
      badToast("Misslyckades med att spara ändringar.");
    }
  };

  const handleDelete = () => {
    queryClient.invalidateQueries({ queryKey: ["tournament"] });
    okToast("Turnering raderades");
    navigate("/tournaments");
  };

  return (
    <>
    <Toaster />
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="dark:bg-slate-700 dark:hover:bg-slate-600"
          variant="outline"
        >
          Redigera turnering
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Redigera turnering</SheetTitle>
          <SheetDescription>
            Uppdatera turneringsinformationen här.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tournamentName" className="text-right">
              Namn
            </Label>
            <Input
              id="tournamentName"
              name="tournamentName"
              value={formData.tournamentName}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Startdatum
            </Label>
            <Input
              id="startDate"
              type="date"
              name="startDate"
              value={
                formData.startDate
                  ? new Date(formData.startDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              Slutdatum
            </Label>
            <Input
              id="endDate"
              type="date"
              name="endDate"
              value={
                formData.endDate
                  ? new Date(formData.endDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button onClick={handleUpdate}>Spara ändringar</Button>
          </SheetClose>
          <DeleteTournamentButton
            tournamentId={tournamentId}
            onDelete={handleDelete}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </>
  );
};

export default UpdateTournamentSheet;
