import { NoResponseError } from "@/api/functions/apiErrors";
import { updateTournament } from "@/api/functions/updateTournament";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent, SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { UpdateTournament } from "@/interfaces/tournament";
import { badToast, okToast } from "@/utils/toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { DatePicker } from "./DatePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Toaster } from "./ui/toaster";

const UpdateTournamentSheet = ({
  tournament,
  tournamentId,
}: {
  tournament: UpdateTournament;
  tournamentId: string;
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const updatedTournament = await updateTournament(tournamentId, data);

      if (!updatedTournament)
        throw new NoResponseError("No response from server");
      okToast("Turneringen har uppdaterats");
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    } catch (error) {
      console.error("Failed to update tournament:", error);
      badToast("Misslyckades med att spara ändringar.");
    }
  };

  return (
    <>
      <Toaster />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="dark:bg-slate-700 dark:hover:bg-slate-600"
            variant="default"
          >
            Redigera turnering
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="mb-4">Redigera turnering</SheetTitle>
          </SheetHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="tournamentName"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Turneringsnamn</FormLabel>
                    <FormControl>
                      <Input placeholder="Skriv in turneringsnamn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Startdatum</FormLabel>
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Slutdatum</FormLabel>
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
              </div>

              <div className="flex justify-between items-center mt-6">
                <SheetClose asChild>
                  <Button
                    type="submit"
                    className="border border-solid hover:bg-slate-800 hover:text-white  shadow"
                  >
                    Uppdatera turnering
                  </Button>
                </SheetClose>
                <DeleteTournamentButton
                  tournamentId={tournamentId}
                  onDelete={handleDelete}
                />
              </div>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UpdateTournamentSheet;
