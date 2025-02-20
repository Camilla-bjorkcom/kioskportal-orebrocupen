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
import { Form, useNavigate } from "react-router-dom";
import { updateTournament } from "@/api/functions/updateTournament";
import { badToast, okToast } from "@/utils/toasts";
import { NoResponseError } from "@/api/functions/apiErrors";
import { Toaster } from "./ui/toaster";
import { DatePicker } from "./DatePicker";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

  const formSchema = z.object({
    tournamentName: z
      .string()
      .min(2, { message: "Turneringsnamn måste ha minst 2 bokstäver" }),
    startDate: z
      .date({ required_error: "Startdatum är obligatoriskt" })
      .optional(),
    endDate: z
      .date({ required_error: "Slutdatum är obligatoriskt" })
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: tournament.tournamentName || "",
      startDate: tournament.startDate || undefined,
      endDate: tournament.endDate || undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const updatedTournament: UpdateTournament = {
      ...tournament,
      ...data,
    };
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="tournamentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turneringsnamn</FormLabel>
                    <FormControl>
                      <Input placeholder="Skriv in turneringsnamn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">Startdatum</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">Slutdatum</FormLabel>
                    <FormControl>
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
                >
                  Uppdatera Turnering
                </button>
              </div>
            </form>
          </Form>
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
