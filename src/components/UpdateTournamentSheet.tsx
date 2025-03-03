import { NoResponseError } from "@/api/functions/apiErrors";
import { updateTournament } from "@/api/functions/updateTournament";
import DeleteTournamentButton from "@/components/DeleteTournamentButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UpdateTournament } from "@/interfaces/tournament";
import { badToast, okToast } from "@/utils/toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
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
import { uploadImageFile } from "@/api/functions/uploadImageFile";
import { TrashIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { deleteLogoFile } from "@/api/functions/deleteLogoFile";

const UpdateTournamentSheet = ({
  tournament,
  tournamentId,
}: {
  tournament: UpdateTournament;
  tournamentId: string;
}) => {
  const queryClient = useQueryClient();

  const formSchema = z.object({
    tournamentName: z
      .string()
      .min(2, { message: "Turneringsnamn måste ha minst 2 bokstäver" }).max(25, {message: "Turneringsnamn är för långt. Max 25 bokstäver."}),
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
      console.log("Submitting data:", data);
      const updatedTournament = await updateTournament(tournamentId, data);

      if (!updatedTournament) {
        console.error("No response from server");
        throw new NoResponseError("No response from server");
      }

      console.log("Tournament updated successfully:", updatedTournament);
      okToast("Turneringen har uppdaterats");
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    } catch (error) {
      console.error("Failed to update tournament:", error);
      badToast("Misslyckades med att spara ändringar.");
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64String = reader.result?.toString().split(",")[1]; // Extrahera Base64-datan

      console.log("fil:", file);
      console.log("filnamn:", file.name);
      const dataResponse = await uploadImageFile(
        file.name,
        base64String,
        tournamentId!
      );
      if (dataResponse) {
        console.log(dataResponse.fileUrl);
        queryClient.invalidateQueries({ queryKey: ["tournament"] });
        okToast("Turneringslogga uppdaterades");
      }
    };
  };

  const handleDeleteLogo = async (tournamentId: string) => {
    const response = await deleteLogoFile(tournamentId);
    if (response) {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      okToast("Turneringslogga raderades");
    }
    else {
      badToast("Misslyckades radera turneringslogga")
    }
  }

  return (
    <>
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

              <div className="flex:row sm:flex justify-between items-center mt-6">
                <SheetClose asChild>
                  <Button
                    type="submit"
                    className="border border-solid hover:bg-slate-800 hover:text-white mb-4 sm:mb-0  shadow"
                  >
                    Uppdatera turnering
                  </Button>
                </SheetClose>
                <DeleteTournamentButton
                  tournamentId={tournamentId}
                />
              </div>
            </form>
          </Form>
          {tournament.logoUrl ? (
            <>
              <p className="mt-10 text-sm font-medium">Turneringslogga</p>
              <div className="flex items-center gap-5">
                <img
                  src={tournament.logoUrl}
                  alt="Logo"
                  className="mt-4 w-[30%] object-contain"
                />{" "}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button onClick={() => handleDeleteLogo(tournamentId)}variant={"destructive"}>
                        <TrashIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Radera turneringslogga</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          ) : (
            <div className="p-4 border rounded-lg mt-10">
              <h4 className="text-sm text-muted-foreground dark:text-gray-200 mb-5 font-medium">
                Ladda upp en turneringslogga{" "}
                <p className="text-xs">(max 6 mb)</p>
              </h4>
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleFileChange}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default UpdateTournamentSheet;
