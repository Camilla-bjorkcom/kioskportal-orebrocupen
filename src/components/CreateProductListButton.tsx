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
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { createProductlist } from "@/api/functions/createProductlist";
import { useQueryClient } from "@tanstack/react-query";
import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";
import { badToast, okToast } from "@/utils/toasts";

const formSchema = z.object({
  productlistName: z.string().min(2, {
    message: "Produktlistnamnet måste ha minst 2 bokstäver",
  }),
});

interface CreateProductListButtonProps {
  tournamentId: string;
}

function CreateProductListButton({
  tournamentId,
}: CreateProductListButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productlistName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const productlistCreated = await createProductlist(
        values.productlistName,
        tournamentId!,
      );
      if (!productlistCreated) {
        throw new NoResponseError("No response from server");
      }

      queryClient.invalidateQueries({ queryKey: [tournamentId, "productlists"] });

      okToast(`Produktlista ${values.productlistName} skapades`);
    } catch (error) {
      if (error instanceof DuplicateError) {
        badToast(
          `Produktlista med namnet ${values.productlistName} finns redan.`
        );
      } else if (error instanceof NoResponseError) {
        badToast("Misslyckades med att skapa produktlista.");
      } else {
        badToast("Misslyckades med att skapa produktlista.");
      }
    }
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-md">
          Skapa Produktlista <Plus />
        </Button>
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
              name="productlistName"
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
              <Button
                type="submit"
                className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
              >
                Spara Produktlista
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProductListButton;
