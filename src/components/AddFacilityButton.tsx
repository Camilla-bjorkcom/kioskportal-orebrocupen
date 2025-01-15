"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "./ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
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
import { useState } from "react";
import { Button } from "./ui/button";


const formSchema = z.object({
  facilityName: z.string().min(2, {
    message: "Anläggnings namn måste ha minst 2 bokstäver",
  }),
  tournamentId: z.string().min(2, {
    message: "TurneringsId måste finnas",
  }),
});




interface AddFacilityButtonProps {
  onSave: (facilityname: string, tournamentId: string) => void; 
  tournamentId: string;
}



function AddFacilityButton({ onSave, tournamentId }: AddFacilityButtonProps) {
  
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityName: "",
      tournamentId
      
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values.facilityName, values.tournamentId);
    setOpen(false);
    form.reset();
  }


  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button className=" flex w-fit gap-2 cursor-pointer">
          Lägg till anläggning <PlusIcon className="w-4 h-4 place-self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa Anläggning</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny anläggning
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="facilityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn på anläggning</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv in anläggnings namn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
              >
                Spara anläggning
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddFacilityButton;
