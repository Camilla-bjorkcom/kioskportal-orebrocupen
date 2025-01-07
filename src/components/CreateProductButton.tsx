"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
  import { Input } from "./ui/input";
  import { PlusIcon } from "@radix-ui/react-icons";
  import { zodResolver } from "@hookform/resolvers/zod"
  import { useForm } from "react-hook-form"
  import { useState } from "react";


import {  z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const formSchema = z.object({
    productname: z.string().min(2, {
      message: "Produktnamn måste ha minst 2 bokstäver",
    }),
    
    amountPerPackage: z
  .preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number({ message: "Antal per paket måste anges med siffror" })
    .refine(val => val >= 0, { message: "Antal per paket måste vara 0 eller större" })
      .optional() // Gör det till ett valfritt fält
  ),

    tournamentId: z.string().min(2, {
      message: "TurneringsId måste finnas",
    }),
     
});
  

  
interface CreateProductButtonProps {
  tournamentId: string; // Lägg till id här
  onSave: (productName: string, amountPerPackage: number, tournamentId: string) => void;
}


  
  function CreateProductButton({onSave, tournamentId }: CreateProductButtonProps) {

    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        productname: "",
        amountPerPackage: 0,
        tournamentId, // Använd id från props
      },
    });
    
      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Form values:", values);
        if (!values.tournamentId) {
          console.error("Tournament ID saknas!");
          return;
        }
        onSave(values.productname, values.amountPerPackage ?? 0, values.tournamentId); // Skicka vidare `id`
        console.log(values);
        form.reset();
        setSavedMessage("Produkten har sparats");
        setTimeout(() => {
          setSavedMessage(null);
        }, 3000);
      
      }
    return (
        <Dialog>
        <DialogTrigger asChild>
          <button className="flex flex-col p-2 justify-between rounded-xl border-2 border-dashed bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32">
            <PlusIcon className=" w-32 h-32 mx-auto" />
            <p className="text-center w-full mb-4 ">Skapa Produkt</p>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa Produkt</DialogTitle>
            <DialogDescription className="sr-only">
              Fyll i informationen för att skapa en ny Produkt</DialogDescription>
          </DialogHeader>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="productname"
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
                    <Input type="number" {...field} 
                      value={field.value ?? 0}/>
                  </FormControl>
                  <FormMessage /> 
                </FormItem>
              )}
              />
                
                  {savedMessage && (
                  <div className="text-green-600 text-sm mt-4">{savedMessage}</div>
                   )}  
            
            <div className="flex justify-end">
              <button type="submit" className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow">Spara Produkt</button>
            </div>         
          </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default CreateProductButton;
