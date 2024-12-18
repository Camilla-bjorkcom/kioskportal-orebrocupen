


import React from 'react'
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const formSchema = z.object({
    productname: z.string().min(2, {
      message: "Produktnamn måste ha minst 2 bokstäver",
    }),
    
    amountPerPackage: 
    z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
    z
    .number({ message:"Antal per paket måste anges med siffror"})
    .positive({ message:"Antal per paket måste vara positivt"}) // Direkt felmeddelande för positiva värden
    .optional()
    ), 
     
    id: z.string().min(1, { message: "Id måste vara en giltig sträng" }),
     
});

interface UpdateProductButtonProps {
    onUpdate: (id: string, productName: string , amountPerPackage: number ) => void;
    product: { id: string; productname: string; amountPerPackage: number }; // Callback för att spara produktnamn
  }

  

function UpdateProductButton({onUpdate, product} : UpdateProductButtonProps) {

    const [updateMessage, setUpdateMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: product.id,
            productname: product.productname,
            amountPerPackage : product.amountPerPackage ?? 0,
        },
      });
    
      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Formulärvärden (innan konvertering):", values);
       

        onUpdate(values.id, values.productname ,  values.amountPerPackage ?? 0)
      
        console.log("Uppdaterade värden:",values);
        setUpdateMessage("Produkten har uppdaterats!");
       
      }


  return (
    <Dialog>
    <DialogTrigger asChild>
      <button className="flex flex-col  hover:text-orange-n">
        <Pencil2Icon className="w-8 h-6"  />
      </button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Redigera Produkt</DialogTitle>
        <DialogDescription className="sr-only">
          Uppdatera informationen för redigera Produkt</DialogDescription>
      </DialogHeader>
      <Form {...form}>
      <form
  onSubmit={form.handleSubmit(
    (values) => {
      console.log("Formuläret är giltigt:", values);
      onSubmit(values);
    },
    (errors) => {
      console.error("Valideringsfel:", errors);
    }
  )}
  className="space-y-8"
>
        <FormField
          control={form.control}
          name="productname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produktnamn</FormLabel>
              <FormControl>
                <Input placeholder={product.productname} {...field} />
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
              <Input 
                    type="number" 
                      
                    {...field} 
                    value={field.value ?? ""}
                    />
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
          />   
            {updateMessage && (
            <div className="text-green-600 text-sm mt-4">{updateMessage}</div>
            )}
        <div className="flex justify-end">
          <button  onClick={(e) => {
                e.stopPropagation();
                
                }} 
            type="submit" className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"  >Spara ändringar</button>
        </div>         
      </form>
      </Form>
    </DialogContent>
  </Dialog>
)
}
  


export default UpdateProductButton