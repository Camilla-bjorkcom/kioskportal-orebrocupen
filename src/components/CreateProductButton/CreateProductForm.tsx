import { createProduct } from "@/api/functions/createProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";
import { badToast, okToast } from "@/utils/toasts";

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
  onDialogClosed?: () => void;
}



export default function CreateProductForm({ tournamentId }: CreateProductProps) {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    productName: "",
    amountPerPackage: 1,
  },
});

const productNameInputRef = useRef<HTMLInputElement | null>(null);

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
  if(productNameInputRef.current) {
    productNameInputRef.current.focus();
  }
}

return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="productName"
        
        render={({ field }) => (
          <FormItem>
            <FormLabel>Produktnamn</FormLabel>
            <FormControl>
              <Input placeholder="Skriv in produktnamn"  {...field} ref={(e) => {
                          field.ref(e);
                          productNameInputRef.current = e;
                      }} />
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

    );
}