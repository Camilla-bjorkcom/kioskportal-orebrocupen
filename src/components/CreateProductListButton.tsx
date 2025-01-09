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

const formSchema = z.object({
  productlistname: z.string().min(2, {
    message: "Produktlistnamnet måste ha minst 2 bokstäver",
  }),
  tournamentId: z.string().min(2, {
    message: "TurneringsId måste finnas",
  }),
});

interface CreateProductListButtonProps {
  onSave: (productListName: string ,tournamentId:string) => void; // Callback för att spara produktnamn
  tournamentId:string;
}

function CreateProductListButton({ onSave,tournamentId }: CreateProductListButtonProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productlistname: "",
      tournamentId
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values.productlistname, values.tournamentId);
    setOpen(false);
    console.log(values);
    form.reset();
  }
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col p-2 justify-between rounded-xl border-2 border-dashed bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32">
          <PlusIcon className=" w-32 h-32 mx-auto" />
          <p className="text-center w-full mb-4 ">Skapa Produktlista</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa Produktlista</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny produktlista
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productlistname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produktlistnamn</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv in produktlistnamn" {...field} />
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
                Spara Produktlista
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductListButton;
