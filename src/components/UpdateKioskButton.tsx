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

const formSchema = z.object({
    kioskName: z.string().min(2, {
      message: "Kiosk namn måste ha minst 2 bokstäver",
    }),
  });
  
interface Kiosk {
    id: number;
    kioskName: string;
  }

interface UpdateKioskButtonProps {
  kiosk: Kiosk;
  onSave: (kiosk: Kiosk) => void;
}



const UpdateKioskButton = ({ kiosk, onSave }: UpdateKioskButtonProps) => {


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
    const updatedKiosk = { ...kiosk, kioskName: values.kioskName };
    onSave(updatedKiosk); 
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Pencil className="w-5 h-5 hover:text-orange-n" />
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
              <button
                type="submit"
                className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
              >
                Spara
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateKioskButton;
