import { useState } from "react";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { UpdateTournament } from "@/interfaces";
import { DatePicker } from "./DatePicker";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "./ui/toaster";

interface UpdateTournamentButtonProps {
  onUpdate: (updatedTournament: UpdateTournament) => void;
  tournament: UpdateTournament;
}

const UpdateTournamentButton = ({
  onUpdate,
  tournament,
}: UpdateTournamentButtonProps) => {
  const [open, setOpen] = useState(false);

  
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
    onUpdate(updatedTournament);
    setOpen(false);
  };

  return (
     <>
     <Toaster />

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Uppdatera turnering</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uppdatera turnering</DialogTitle>
          <DialogDescription>
            Ändra information för turneringen nedan.
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
                    <DatePicker selected={field.value} onChange={field.onChange} />
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
                    <DatePicker selected={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <button 
                type="submit"
                className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"onClick={() => {
                toast({
                    className: "bg-orange-200",
                    title: "Ändringen sparades",
                    description: "Turneringen har uppdaterats",
                  });
                }}
              >
                Uppdatera Turnering
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default UpdateTournamentButton;
