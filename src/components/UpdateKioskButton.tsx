"use client";

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
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Toaster } from "./ui/toaster";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Kiosk } from '@/interfaces';
const formSchema = z.object({
    kioskName: z.string().min(2, {
      message: "Kiosk namn måste ha minst 2 bokstäver",
    }),
  });
  


interface UpdateKioskButtonProps {
  kiosk: Kiosk;
  onSave: (kiosk: Kiosk) => void;
  onUpdateKioskClick: () => void;
}



const UpdateKioskButton = ({ kiosk, onSave, onUpdateKioskClick }: UpdateKioskButtonProps) => {


  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kioskName: kiosk.kioskName,
    },
  });
  
  useEffect(() => {
    if (kiosk) {
      form.reset({ kioskName: kiosk.kioskName });
    }
  }, [kiosk, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdateKioskClick();
    const updatedKiosk = { ...kiosk, kioskName: values.kioskName };
    onSave(updatedKiosk); 
    setOpen(false);
    form.reset();
  }

  return (
    <>
    <Toaster />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="w-5 h-5 hover:text-orange-n place-self-center" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redigera Kiosk</DialogTitle>
          <DialogDescription className="sr-only">
            Redigera kiosknamn
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="kioskName"
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
                className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow" onClick={() => {
                  toast({
                    className: "bg-orange-200",
                    title: "Ändringen sparades",
                    description: "Kiosken har uppdaterats",
                  });
                }}
              >
                Spara
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default UpdateKioskButton;
