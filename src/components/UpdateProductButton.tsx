import React from 'react'
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import {Button} from './ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import { Product } from '@/interfaces';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


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
    id: z.string().min(1, { message: "Id måste vara en giltig sträng" }),
    tournamentId: z.string().min(1, { message: "Id måste vara en giltig sträng" }),
     
});

interface UpdateProductButtonProps {
    onUpdate: (updatedProduct : Product ) => void;
    product: Product // Callback för att spara produktnamn
    onDelete: (id:string) => void;
  }

  

function UpdateProductButton({onUpdate, product, onDelete} : UpdateProductButtonProps) {

    const [updateMessage, setUpdateMessage] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const productName = product.productname

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: product.id,
            productname: product.productname,
            amountPerPackage : product.amountPerPackage ?? 0,
            tournamentId: product.tournamentId
        },
      });
    
      function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Formulärvärden (innan konvertering):", values);
        const updatedProduct: Product = {
          id: values.id,
          productname: values.productname,
          amountPerPackage: values.amountPerPackage ?? 0,
          tournamentId: values.tournamentId,
        };

        onUpdate(updatedProduct)
      
        console.log("Uppdaterade värden:",values);
        setUpdateMessage("Produkten har uppdaterats!");
       
      }
      const handleDelete = () => {
        onDelete(product.id); // Använd `onDelete` för att radera produkten
        setIsDialogOpen(false); // Stäng dialogen efter borttagning
      };


  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogTrigger asChild>
    

    <span className="flex border-2 border-transparent hover:border-solid hover:border-1 rounded-md  hover:text-white hover:bg-black">
    <p className='ml-2'>{productName}</p>
  </span>
 
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
        <div className="flex justify-between">
         
             <AlertDialog>
                          <AlertDialogTrigger>
                            <Button  className="border border-solid rounded-xl p-2 shadow hover:bg-red-600 hover:text-white">
                              <p>Radera produkt</p>
                              </Button>
                          </AlertDialogTrigger>
                        
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Vill du radera produkten?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Den här åtgärden kan inte ångras. Produkten kommer
                              att tas bort permanent.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Avbryt</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                            >
                              Radera
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button  onClick={(e) => {
                e.stopPropagation();
                
                }} 
            type="submit" className=" border border-solid hover:bg-secondary hover:text-black rounded-xl p-2 shadow" >Spara ändringar</Button>
        </div>         
      </form>
      </Form>
     
    </DialogContent>
  </Dialog>
)
}
  


export default UpdateProductButton