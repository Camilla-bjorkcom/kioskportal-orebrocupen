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

interface CreateTournamentButtonProps {
  onSave: (data: {
    tournamentName: string;
    startDate: Date;
    endDate: Date;
  }) => void;
}

function CreateTournamentBtn({ onSave }: CreateTournamentButtonProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tournamentName: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  const [open, setOpen] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
    setOpen(false);
    console.log(values);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <button className="flex flex-col p-2 justify-between rounded-xl border-2 border-dashed bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32">
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

export default CreateTournamentBtn;
