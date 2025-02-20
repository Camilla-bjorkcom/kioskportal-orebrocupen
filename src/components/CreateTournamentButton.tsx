import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { DatePicker } from "./DatePicker";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createTournament } from "@/api/functions/createTournament";
import { NoResponseError } from "@/api/functions/apiErrors";
import { okToast, badToast } from "@/utils/toasts";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  tournamentName: z.string().min(2, {
    message: "Turneringsnamn måste ha minst 2 bokstäver",
  }),
  startDate: z.date({
    required_error: "Startdatum är obligatoriskt",
  }),
  endDate: z.date({
    required_error: "Slutdatum är obligatoriskt",
  }),
});


function CreateTournamentButton() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const tournamentCreated = await createTournament(values);
      if (!tournamentCreated) {
        throw new NoResponseError("No response from server");
      }

      queryClient.invalidateQueries({ queryKey: ["tournaments"] });

      okToast(`Turnering ${values.tournamentName} skapades`);
    } catch (error) {
      if (error instanceof NoResponseError) {
        badToast("Misslyckades med att skapa turnering.");
      } else {
        badToast("Misslyckades med att skapa turnering.");
      }
    }
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col p-2 justify-between rounded-xl border-2 border-dashed bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32 dark:bg-slate-900 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-500">
          <PlusIcon className=" w-32 h-32 mx-auto" />
          <p className="text-center w-full mb-4 ">Skapa turnering</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa turnering</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny turnering
          </DialogDescription>
        </DialogHeader>
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
                Spara Turnering
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTournamentButton;
