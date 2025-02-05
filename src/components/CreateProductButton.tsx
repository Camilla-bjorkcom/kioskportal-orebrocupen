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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Produktnamn måste ha minst 2 bokstäver",
  }),

  amountPerPackage: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({ message: "Antal per paket måste anges med siffror" })
      .refine((val) => val >= 0, {
        message: "Antal per paket måste vara 0 eller större",
      })
      .optional() // Gör det till ett valfritt fält
  ),
});

interface CreateProductButtonProps {
  onSave: (productName: string, amountPerPackage: number) => Promise<number>;
}

function CreateProductButton({ onSave }: CreateProductButtonProps) {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      amountPerPackage: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);

    if (!values.productName) {
      console.error("Produktnamn saknas!");
      return;
    }

    const result = await onSave(
      values.productName,
      values.amountPerPackage ?? 0
    );

    if (result === 201) {
      setSavedMessage("Produkten har sparats ✅"); // ✅ Om det gick bra
    } else if (result === 409) {
      setSavedMessage("❌ Produkten finns redan!"); // ❌ Om det var en konflikt
    } else {
      setSavedMessage("❌ Något gick fel!"); // ❌ Om det något gick fel
    }

    setTimeout(() => {
      setSavedMessage(null);
    }, 3000);

    form.reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-md">
          Skapa Produkt <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa Produkt</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny Produkt
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produktnamn</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv in produktnamn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amountPerPackage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ange antal per förpackning (Valfritt)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {savedMessage && (
              <div
                className={`text-sm mt-4 ${
                  savedMessage.includes("redan")
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {savedMessage}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
              >
                Spara Produkt
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductButton;
