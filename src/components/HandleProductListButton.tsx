import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'

import { DialogHeader } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { ReaderIcon } from '@radix-ui/react-icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'


const formSchema = z.object({
    productlistname: z.string().min(2, {
      message: "Produktlistnamn måste ha minst 2 bokstäver",
    }),
  })

  


function HandleProductListButton() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          productlistname: "",
        },
      });
    
      function onSubmit(values: z.infer<typeof formSchema>) {
       
        console.log(values);
        form.reset();
      }
  return (
    <Dialog>
    <DialogTrigger asChild>
      <button className="flex flex-col p-2 justify-between rounded-xl border-2 border-dashed bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32">
        <ReaderIcon className=" w-32 h-32 mx-auto" />
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
          name="productlistname"
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
       
        <div className="flex justify-end">
          <button type="submit" className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow">Spara Produkt</button>
        </div>
     
      </form>
      </Form>
    </DialogContent>
  </Dialog>
)
}

export default HandleProductListButton