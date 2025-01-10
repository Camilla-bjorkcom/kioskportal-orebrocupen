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
  kioskname: z.string().min(2, {
    message: "Kiosk namn måste ha minst 2 bokstäver",
  }),
});

interface AddKioskButtonProps {
  onSave: (kioskname: string, facilityId: string) => void; // Callback för att spara kiosknamn
  facilityId: string;
 
}

function AddKioskButton({ onSave, facilityId }: AddKioskButtonProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kioskname: "",
   
    },
  });

   function onSubmit(values: z.infer<typeof formSchema>) {
   
    onSave(values.kioskname, facilityId); // Sparar kiosken
    setOpen(false); // Stänger dialogen
    form.reset(); // Återställer formuläret
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto"
          onClick={(e) => e.stopPropagation()} // Stoppa eventbubbling
        >
          Lägg till kiosk <PlusIcon className="w-4 h-4 place-self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation(); // Hindrar event från att bubbla upp till AccordionTrigger
        }}
      >
        <DialogHeader>
          <DialogTitle>Skapa Kiosk</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny kiosk
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="kioskname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn på kiosk</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv in kiosks namn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
              >
                Spara kiosk
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddKioskButton;
