import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Pencil, Plus } from "lucide-react";
import { Productlist, Product } from "@/interfaces";
import { updateProductlist } from "@/api/functions/updateProductlist";
import { useQueryClient } from "@tanstack/react-query";
import { badToast, okToast } from "@/utils/toasts";
import { NoResponseError, DuplicateError } from "@/api/functions/apiErrors";

const formSchema = z.object({
  productlistName: z.string().min(2, {
    message: "Produktlistnamn måste ha minst 2 bokstäver",
  }),
});

interface UpdateProductListButtonProps {
  productlist: Productlist;
  tournamentId: string;
  tournamentProducts: Product[];
}

function UpdateProductListButton({
  productlist,
  tournamentId,
  tournamentProducts,
}: UpdateProductListButtonProps) {
  const queryClient = useQueryClient();
  const [productlistForUpdate, setProductlistforUpdate] =
    useState<Productlist>(productlist);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productlistName: productlist.productlistName,
    },
  });

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
          productlistName: values.productlistName,
        };
        const updatedProductlist = await updateProductlist(
          updatedList,
          tournamentId
        );

        if (!updatedProductlist)
          throw new NoResponseError("No response from server");

        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["productlists"] });

        okToast(`Produktlista  ${updatedProductlist.productlistName} uppdaterades`);
      }
    } catch (error) {
      if (error instanceof DuplicateError) {
        badToast(`Produktlista med namnet ${values.productlistName}  finns redan.`);
      } else {
        badToast("Misslyckades med att uppdatera produktlista.");
      }
    }

    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      {productlist.products.length === 0 && (
        <DialogTrigger asChild>
          <Button
          variant="outline"
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto dark:hover:bg-slate-600 dark:hover:text-gray-200"
          onClick={(e) => e.stopPropagation()} 
        >
          Lägg till produkter <Plus />
          </Button>
        </DialogTrigger>
      )}
      {productlist.products.length >= 1 && (
        <DialogTrigger asChild>
             <Button
          variant="outline"
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto dark:hover:bg-slate-600 dark:hover:text-gray-200"
          onClick={(e) => e.stopPropagation()} 
        >
            Redigera produktlista <Pencil />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Uppdatera produktlista</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny produktlista.
          </DialogDescription>
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
              name="productlistName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produktlistnamn</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setProductlistforUpdate((prev) =>
                          prev
                            ? { ...prev, productlistName: e.target.value }
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
                <Button type="button" onClick={toggleSelectAll} disabled={tournamentProducts.length === 0}>
                  {allSelected ? "Avmarkera alla" : "Markera alla"}
                </Button>
              </div>
             
                {tournamentProducts.length > 0 ? (
                  tournamentProducts.slice()
                  .sort((a, b) => a.productName.localeCompare(b.productName))
                  .map((product) => (
                    <div className="grid grid-cols-3 gap-4">
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
                        className="font-medium hover:text-slate-800 cursor-pointer"
                      >
                        {product.productName}
                      </label>
                    </div>
                    </div>
                  ))) : (<p className="w-full">Inga produkter tillagda i turneringen</p>)}
              
            </div>
            <Button className="mx-auto w-full" type="submit">
              Spara
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProductListButton;
