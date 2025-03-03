import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";
import { updateProductlist } from "@/api/functions/updateProductlist";
import { Product, Productlist } from "@/interfaces";
import { badToast, okToast } from "@/utils/toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";

const formSchema = z.object({
  productlistName: z.string().min(2, {
    message: "Produktlistnamn måste ha minst 2 bokstäver",
  }),
});

interface Props {
  productlist: Productlist;
  tournamentId: string;
  tournamentProducts: Product[];
  onDialogClosed?: () => void;
}

export default function UpdateProductListForm({
  productlist,
  tournamentId,
  tournamentProducts,
  onDialogClosed,
}: Props) {
  const queryClient = useQueryClient();
  const [productlistForUpdate, setProductlistforUpdate] =
    useState<Productlist>(productlist);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productlistName: productlistForUpdate?.productlistName,
    },
  });

  console.log("befire thisnidsns");

  const allSelected: boolean =
    tournamentProducts.length > 0 &&
    tournamentProducts.every((product) =>
      productlistForUpdate?.products.some((p) => p.id === product.id)
    );

  const toggleSelectAll = () => {
    const allSelected =
      tournamentProducts.length > 0 &&
      tournamentProducts.every((product) =>
        productlistForUpdate?.products.some((p) => p.id === product.id)
      );
    setProductlistforUpdate((prev) =>
      prev
        ? {
            ...prev,
            products: allSelected ? [] : tournamentProducts,
          }
        : prev
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (productlistForUpdate) {
        const updatedList = {
          ...productlistForUpdate,
          productlistName:
            values.productlistName?.trim() ||
            productlistForUpdate.productlistName,
        };

        console.log(updatedList.productlistName);
        const updatedProductlist = await updateProductlist(
          updatedList,
          tournamentId
        );
        setProductlistforUpdate(updatedProductlist);

        if (!updatedProductlist)
          throw new NoResponseError("No response from server");

        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["productlists"] });

        okToast(
          `Produktlista  ${updatedProductlist.productlistName} uppdaterades`
        );
      }
    } catch (error) {
      if (error instanceof DuplicateError) {
        badToast(
          `Produktlista med namnet ${values.productlistName}  finns redan.`
        );
      } else {
        badToast("Misslyckades med att uppdatera produktlista.");
      }
    }

    onDialogClosed?.();
  }

  return (
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
          name="productlistName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produktlistnamn</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={productlist.productlistName}
                  onChange={(e) => {
                    field.onChange(e);
                    setProductlistforUpdate((prev) =>
                      prev
                        ? {
                            ...prev,
                            productlistName:
                              e.target.value ?? productlist.productlistName,
                          }
                        : prev
                    );
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="font-semibold">Välj produkter att lägga till:</p>
            <Button
              type="button"
              onClick={toggleSelectAll}
              disabled={tournamentProducts.length === 0}
            >
              {allSelected ? "Avmarkera alla" : "Markera alla"}
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {tournamentProducts.length > 0 ? (
              tournamentProducts
                .slice()
                .sort((a, b) => a.productName.localeCompare(b.productName))
                .map((product) => (
                  <div key={product.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={
                        productlistForUpdate?.products.some(
                          (p) => p.id === product.id
                        ) || false
                      }
                      onCheckedChange={(checked) => {
                        if (productlistForUpdate) {
                          const updatedProducts = checked
                            ? [...productlistForUpdate.products, product]
                            : productlistForUpdate.products.filter(
                                (p) => p.id !== product.id
                              );
                          setProductlistforUpdate(
                            (prev) =>
                              prev && { ...prev, products: updatedProducts }
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="font-medium hover:text-slate-800 dark:hover:text-gray-300 cursor-pointer"
                    >
                      {product.productName}
                    </label>
                  </div>
                ))
            ) : (
              <p className="w-full">Inga produkter tillagda i turneringen</p>
            )}
          </div>
        </div>
        <Button className="mx-auto w-full" type="submit">
          Spara
        </Button>
      </form>
    </Form>
  );
}
