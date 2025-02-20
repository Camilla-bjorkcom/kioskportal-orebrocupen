import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
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
import { createProduct } from "@/api/functions/createProduct";
import { badToast, okToast } from "@/utils/toasts";
import { useQueryClient } from "@tanstack/react-query";
import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Produktnamn måste ha minst 2 bokstäver",
  }),

  amountPerPackage: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({ message: "Antal per paket måste anges med siffror" })
      .refine((val) => Number.isInteger(val), {
        message: "Antal per paket måste vara ett heltal",
      })
      .refine((val) => val >= 0, {
        message: "Antal per paket måste vara 0 eller större",
      })
      .optional()
  ),
});
interface CreateProductProps {
  tournamentId: string;
}

function CreateProductButton({ tournamentId }: CreateProductProps) {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      amountPerPackage: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const correctedAmount =
        values.amountPerPackage && values.amountPerPackage > 0
          ? values.amountPerPackage
          : 1;

      const productCreated = await createProduct(
        values.productName,
        correctedAmount,
        tournamentId!
      );
      if (!productCreated) throw new NoResponseError("No response from server");
      queryClient.invalidateQueries({ queryKey: ["products"] });

      setSavedMessage("Produkten har sparats ✅");
      okToast(`Produkt ${values.productName} skapades`);
    } catch (error) {
      if (error instanceof DuplicateError) {
        badToast(`Produkt med namnet ${values.productName} finns redan.`);
        setSavedMessage("❌ Produkten finns redan!");
      } else if (error instanceof NoResponseError) {
        badToast("Misslyckades med att skapa produkt.");
        setSavedMessage("❌ Något gick fel!");
      } else {
        badToast("Misslyckades med att skapa produkt.");
        setSavedMessage("❌ Något gick fel!");
      }
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
      <DialogOverlay className="backdrop-blur-0" />
      <DialogContent blur={false}>
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
                  <FormLabel>
                    Ange antal per förpackning (Minsta värde 1)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? 1} />
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
