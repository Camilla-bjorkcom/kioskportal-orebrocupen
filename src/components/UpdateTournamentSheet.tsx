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
import { toast } from "@/hooks/use-toast";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateTournament } from "@/interfaces/tournament";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";
import { useNavigate } from "react-router-dom";

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
      const response = await fetchWithAuth(`tournaments/${tournamentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response) {
        throw new Error("Failed to update tournament");
      }

      queryClient.invalidateQueries({ queryKey: ["tournament", tournamentId] });

      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Ändringen sparades",
        description: "Turneringen har uppdaterats",
      });
    } catch (error) {
      console.error("Failed to update tournament:", error);
      toast({
        title: "Fel",
        description: "Misslyckades med att spara ändringar.",
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
      });
    }
  };

  const handleDelete = () => {
    queryClient.invalidateQueries({ queryKey: ["tournament"] });
    navigate("/tournaments");
  };

  return (
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
  );
};

export default UpdateTournamentSheet;
