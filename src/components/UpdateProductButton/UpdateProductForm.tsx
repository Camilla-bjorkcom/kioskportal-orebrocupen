import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TournamentProduct } from "@/interfaces";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { badToast, okToast } from "@/utils/toasts";

import { updateProduct } from "@/api/functions/updateProduct";
import { deleteProduct } from "@/api/functions/deleteProduct";
import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";
import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";

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
  id: z.string().min(1, { message: "Id måste vara en giltig sträng" }),
});

interface UpdateProductButtonProps {
  product: TournamentProduct;
  tournamentId: string;
  onDialogClosed?: () => void;
}

function UpdateProductForm({
  product,
  tournamentId,
  onDialogClosed,
}: UpdateProductButtonProps) {
  
  const queryClient = useQueryClient();
   
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: product.id,
      productName: product.productName,
      amountPerPackage: product.amountPerPackage ?? 1,
    },
  });
  const { reset } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const correctedAmount =
        values.amountPerPackage && values.amountPerPackage >= 0
          ? values.amountPerPackage
          : 1;
      const updatedProduct: TournamentProduct = {
        id: values.id,
        productName: values.productName.trim(),
        amountPerPackage: correctedAmount,
      };
      console.log(updatedProduct);
      const updatedNewProduct = await updateProduct(
        updatedProduct,
        tournamentId
      );
      if (!updatedNewProduct)
        throw new NoResponseError("No response from server");

      queryClient.invalidateQueries({ queryKey: [tournamentId, "products"] });
      queryClient.invalidateQueries({ queryKey: [tournamentId, "productlists"] });

      okToast("Produkten har uppdaterats!");
      if (onDialogClosed) {
        onDialogClosed(); 
    }
    } catch (error) {
      if (error instanceof DuplicateError) {
        badToast(`Produkten "${values.productName}" finns redan!`);
        reset(product);
      } else {
        badToast("Något gick fel!");
      }
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProduct(product.id, tournamentId);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productlists"] });
      okToast("Produkt har raderats");

      if (onDialogClosed) {
        onDialogClosed(); 
    }
    } catch (error) {
      console.error(error);
      badToast("Misslyckades med att radera produkt, försök igen.");
    }
  };
 

  return (
        <>
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
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produktnamn</FormLabel>
                    <FormControl>
                      <Input placeholder={product.productName} {...field} />
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
                      <Input type="number" {...field} value={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className=" border border-solid p-2 shadow w-full"
                variant="default"
                tabIndex={1}
              >
                Spara ändringar
              </Button>
            </form>
          </Form>
          <div className="flex justify-end mt-3">
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <div className="flex gap-3 p-2 shadow bg-red-800 hover:bg-red-600 rounded items-center text-sm w-full justify-center">
                  Radera produkt <TrashIcon className="w-4 h-4" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Vill du radera produkten?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Den här åtgärden kan inte ångras. Produkten kommer att tas
                    bort permanent.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Avbryt</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Radera
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
   
  );
}

export default UpdateProductForm;
