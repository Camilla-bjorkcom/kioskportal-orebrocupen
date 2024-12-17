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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { Pencil, Plus } from "lucide-react";

interface ProductList {
  id: number;
  productlistname: string;
  products: Product[];
}

interface Product {
  id: number;
  productname: string;
}

const formSchema = z.object({
  productlistname: z.string().min(2, {
    message: "Produktlistnamn måste ha minst 2 bokstäver",
  }),
});

interface UpdateProductListButtonProps {
  productlist: ProductList;
}

function UpdateProductListButton({
  productlist,
  onUpdate,
}: {
  productlist: ProductList;
  onUpdate: (updatedList: ProductList) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productlistname: productlist.productlistname,
    },
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [productlistForUpdate, setProductlistforUpdate] =
    useState<ProductList>(productlist);
  const [open, setOpen] = useState(false);
 
  const allSelected:boolean = products.length > 0 && products.every((product) =>
    productlistForUpdate?.products.some((p) => p.id === product.id)
  );

  const toggleSelectAll = () => {
    const allSelected = products.length > 0 && products.every((product) =>
      productlistForUpdate?.products.some((p) => p.id === product.id)
    );
  
    setProductlistforUpdate((prev) =>
      prev
        ? {
            ...prev,
            products: allSelected ? [] : products,
          }
        : prev
    );
  };

  const { isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
      return data;
    },
  });

  const saveChangesToProductList = async (productlist: ProductList) => {
    const url = `http://localhost:3000/productslists/${productlist.id}`;

    // Skapa en sanerad version av produktlistan
    const sanitizedProductList = {
      id: productlist.id,
      productlistname: productlist.productlistname,
      products: productlist.products.map((product) => ({
        id: product.id,
        productname: product.productname,
      })),
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedProductList),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error("Failed to update list");
      }
      
      const data = await response.json();
      onUpdate(data);
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (productlistForUpdate) {
      try {
        // Sätt produktlistan med de nya värdena
        const updatedList = await saveChangesToProductList({
          ...productlistForUpdate,
          productlistname: values.productlistname,
        });

        console.log("Updated list:", updatedList);
        setOpen(false);
      } catch (error) {
        console.error("Failed to save changes", error);
      }
    }
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      {productlist.products.length === 0 && (
        <DialogTrigger asChild>
          <Button>
            Lägg till produkter <Plus />
          </Button>
        </DialogTrigger>
      )}
      {productlist.products.length >= 1 && (
        <DialogTrigger asChild>
          <Button>
            Redigera produktlista <Pencil />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uppdatera produktlista</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny Produkt
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
                      defaultValue={productlistForUpdate?.productlistname}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setProductlistforUpdate((prev) =>
                          prev
                            ? { ...prev, productlistname: e.target.value }
                            : prev
                        );
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div>
              <div className="mb-4 text-right">
                <Button type="button" onClick={toggleSelectAll}>
               {allSelected ? "Avmarkera alla" : "Markera alla"}
                </Button>
              </div>
              {products.map((product) => (
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
                    {product.productname}
                  </label>
                </div>
              ))}
            </div>
            <Button
              className="mx-auto w-full"
              onClick={() => saveChangesToProductList(productlistForUpdate)}
            >
              Spara
            </Button>

            <FormMessage />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateProductListButton;
