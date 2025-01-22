import React, { useEffect, useState } from "react";
import { Kiosk, Product, ProductList } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Toaster } from "./ui/toaster";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  kioskName: z.string().min(2, {
    message: "Kiosk namn måste ha minst 2 bokstäver",
  }),
});

interface EditSelectedKioskButtonProps {
  kioskForEdit: Kiosk;
  productLists: ProductList[];
  products: Product[];
  onKioskUpdated: (updatedkiosk: Kiosk) => void;

  onEditClick: (kiosk: Kiosk) => void;
  onSave: (kiosk: Kiosk) => void;
  onUpdateKioskClick: () => void;
}
function EditSelectedKioskButton({
  kioskForEdit,
  productLists,
  products,
  onKioskUpdated,
  onEditClick,
  onSave,
  onUpdateKioskClick,
}: EditSelectedKioskButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductListId, setSelectedProductListId] =
    useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleDialogOpen = async (isOpen: boolean) => {
    if (isOpen) {
      await onEditClick(kioskForEdit); // Ladda kiosken
      setSelectedProducts(kioskForEdit.products || []); // Sätt initiala produkter
      setOpen(true);
    } else {
      setOpen(false);
      setSelectedProductListId("");
      setSelectedProducts([]);
    }
  };

  const handleProductListChange = (value: string) => {
    const selectedList = productLists.find((list) => list.id === value);
    if (selectedList) {
      setSelectedProductListId(value);
      setSelectedProducts(selectedList.products);
    } else {
      setSelectedProductListId("");
      setSelectedProducts([]);
    }
  };

  const toggleSelectAll = () => {
    if (
      products.every((product) =>
        selectedProducts.some((p) => p.id === product.id)
      )
    ) {
      setSelectedProducts([]); // Avmarkera alla
    } else {
      setSelectedProducts(products); // Markera alla
    }
  };

  const allSelected =
    products.length > 0 &&
    products.every((product) =>
      selectedProducts.some((p) => p.id === product.id)
    );

  const editKiosk = async (kioskForEdit: Kiosk) => {
    try {
      const response = await fetch(
        `http://localhost:3000/kiosks/${kioskForEdit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: kioskForEdit.id,
            products: selectedProducts,
            kioskName: kioskForEdit.kioskName,
            facilityId: kioskForEdit.facilityId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update kiosk");
      }

      const updatedKiosk = await response.json();
      alert("Produkter har sparats!");
      onKioskUpdated(updatedKiosk); // Skicka tillbaka uppdaterad kiosk
      setOpen(false); // Stäng dialogen
    } catch (error) {
      console.error("Failed to update kiosk:", error);
      alert("Kunde inte uppdatera produkterna. Försök igen.");
    }
  };

  if (!kioskForEdit || !productLists || !products) {
    return null; // Rendera inte om data saknas
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kioskName: kioskForEdit.kioskName,
    },
  });
  useEffect(() => {
    if (kioskForEdit) {
      form.reset({ kioskName: kioskForEdit.kioskName });
    }
  }, [kioskForEdit, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdateKioskClick();
    const updatedKiosk = { ...kioskForEdit, kioskName: values.kioskName };
    onSave(updatedKiosk);
    setOpen(false);
    form.reset();
  }
  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <Toaster />
      <DialogTrigger>
        <div
          className="flex flex-col place-self-center hover:text-orange-n"
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
        >
          <Pencil2Icon className="mr-0.5 2xl:mr-5 w-[20px] h-[20px] items-center mt-1" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Vald kiosk:{" "}
            {kioskForEdit ? kioskForEdit.kioskName : "Ingen kiosk vald"}
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="kioskName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Namn på kiosk</FormLabel>
                    <FormControl>
                      <Input placeholder="Skriv in kiosks namn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className=" border border-solid hover:bg-slate-800 hover:text-white p-2  shadow"
                >
                  Uppdatera kiosknamn
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>

        <Select
          value={selectedProductListId}
          onValueChange={handleProductListChange}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Lägg till produkter från produktlista" />
          </SelectTrigger>
          <SelectContent>
            {productLists.map((productList) => (
              <SelectItem key={productList.id} value={productList.id}>
                {productList.productlistname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mb-4 text-right">
          <Button type="button" onClick={toggleSelectAll}>
            {allSelected ? "Avmarkera alla" : "Markera alla"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-2">
              <Checkbox
                id={`product-${product.id}`}
                checked={selectedProducts.some((p) => p.id === product.id)}
                onCheckedChange={(checked) =>
                  setSelectedProducts((prev) =>
                    checked
                      ? [...prev, product]
                      : prev.filter((p) => p.id !== product.id)
                  )
                }
              />
              <label
                htmlFor={`product-${product.id}`}
                className="font-medium cursor-pointer"
              >
                {product.productName}
              </label>
            </div>
          ))}
        </div>

        <Button type="submit" onClick={() => editKiosk(kioskForEdit)}>
          Spara valda produkter till valda kiosker
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default EditSelectedKioskButton;
