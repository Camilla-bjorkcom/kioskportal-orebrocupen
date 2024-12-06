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


import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";

const formSchema = z.object({
    productlistname: z.string().min(2, {
      message: "Produktlistnamnet måste ha minst 2 bokstäver",
    }),
  })

  
  interface CreateProductListButtonProps {
    onSave: (productListName: string) => void; // Callback för att spara produktnamn
  }



  
  function CreateProductListButton({onSave}: CreateProductListButtonProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          productlistname: "",
        },
      });
    
      function onSubmit(values: z.infer<typeof formSchema>) {
        onSave(values.productlistname)
        console.log(values);
        form.reset();
      }
    return (
        <Dialog>
        <DialogTrigger asChild>
          <button className="flex flex-col p-2 justify-between rounded-xl border-2 border-dashed bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32">
            <PlusIcon className=" w-32 h-32 mx-auto" />
            <p className="text-center w-full mb-4 ">Skapa Produkt-Lista</p>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skapa Produkt-Lista</DialogTitle>
            <DialogDescription className="sr-only">
              Fyll i informationen för att skapa en ny Produkt-List</DialogDescription>
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
              <button type="submit" className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow">Spara Produkt-Lista</button>
            </div>
         
          </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }
  
  export default CreateProductListButton;
