


import React from 'react'
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { PlusIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


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
     
});

interface UpdateProductButtonProps {
    onUpdate: ( productName: string , amountPerPackage: number ) => void; // Callback för att spara produktnamn
  }

  

function UpdateProductButton({onUpdate} : UpdateProductButtonProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          productname: "",
          amountPerPackage : 0,
        },
      });
    
      function onSubmit(values: z.infer<typeof formSchema>) {
        onUpdate(values.productname ,  values.amountPerPackage ?? 0)
        console.log(values);
        form.reset();
      }


  return (
    <Dialog>
    <DialogTrigger asChild>
      <button className="flex flex-col p-2 justify-between rounded-xl border-2 border-dashed bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32">
        <PlusIcon className=" w-32 h-32 mx-auto" />
        <p className="text-center w-full mb-4 ">Redigera Produkt</p>
      </button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Redigera Produkt</DialogTitle>
        <DialogDescription className="sr-only">
          Uppdatera informationen för redigera Produkt</DialogDescription>
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
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage /> 
            </FormItem>
          )}
          />   
        
        <div className="flex justify-end">
          <button type="submit" className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow">Spara ändringar</button>
        </div>         
      </form>
      </Form>
    </DialogContent>
  </Dialog>
)
}
  


export default UpdateProductButton