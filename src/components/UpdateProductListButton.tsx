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

const formSchema = z.object({
  productlistname: z.string().min(2, {
    message: "Produktlistnamn måste ha minst 2 bokstäver",
  }),
});

interface UpdateProductListButtonProps {
  productlist: Productlist;
  onUpdate: (updatedList: Productlist) => void;
  tournamentProducts: Product[];
}

function UpdateProductListButton({
  productlist,
  onUpdate,
  tournamentProducts,
}: UpdateProductListButtonProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productlistname: productlist.productlistName,
    },
  });

  const [productlistForUpdate, setProductlistforUpdate] =
    useState<Productlist>(productlist);
  const [open, setOpen] = useState(false);

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

  const handleSubmit = form.handleSubmit((values) => {
    if (productlistForUpdate) {
      const updatedList = {
        ...productlistForUpdate,
        productlistName: values.productlistname,
      };
      onUpdate(updatedList); // Skickar tillbaka den uppdaterade listan
      setOpen(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      {productlist.products.length === 0 && (
        <DialogTrigger asChild>
          <Button className="dark:bg-black">
            Lägg till produkter <Plus />
          </Button>
        </DialogTrigger>
      )}
      {productlist.products.length >= 1 && (
        <DialogTrigger asChild>
          <Button className="dark:bg-black">
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
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="productlistname"
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
                <Button type="button" onClick={toggleSelectAll}>
                  {allSelected ? "Avmarkera alla" : "Markera alla"}
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {tournamentProducts.map((product) => (
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
                ))}
              </div>
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
