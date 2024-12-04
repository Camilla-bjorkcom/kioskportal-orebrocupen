
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ReaderIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PropsWithChildren, ReactNode, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "./ui/checkbox";

interface ProductList {
  id: number;
  productlistname: string;
  products: [];
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

function HandleProductListButton({ children }: PropsWithChildren) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productlistname: "",
    },
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const UpdateProductListButton = async (
    productlistname: string,
    id: number
  ) => {
    try {
      const response = await fetch("http://localhost:3000/productlists", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productlistname: productlistname,
          id: id,
          products: selectedProducts,
        }),
      });
      if (!response.ok) {
        throw new Error("failed to update list");
      }
      const data = await response.json();
      setSelectedProducts(data);
      return data;
    } catch (error) {
      console.error(error);
    }
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

  const handleSubmit = form.handleSubmit((values) => {
    console.log(values);
    form.reset();
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col p-2 justify-between bg-card text-card-foreground hover:text-white text-black aspect-video h-32">
          {children}
          <ReaderIcon className=" w-32 h-32 mx-auto" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa Produkt</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny Produkt
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="productlistname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produktlistnamn</FormLabel>
                  <FormControl>
                    <Input placeholder="skriv in produktlistnamn" {...field} />
                  </FormControl>
                  <Collapsible>
                    <CollapsibleTrigger>
                      Lägg till produkter i din lista
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-4 grid-cols-3 gap-2">
                        {products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`product-${product.id}`}
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedProducts((prev) => [
                                    ...prev,
                                    product.id,
                                  ]);
                                } else {
                                  setSelectedProducts((prev) =>
                                    prev.filter((id) => id !== product.id)
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={`product-${product.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {product.productname}
                            </label>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default HandleProductListButton;
