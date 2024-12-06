
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
import { Button } from "./ui/button";
import UpdateProductListButton from "./UpdateProductListButton";

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

function HandleProductListButton({ children, productlist, onUpdate }: PropsWithChildren & {productlist : ProductList;  onUpdate: (updatedList: ProductList) => void;}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      
      productlistname: productlist.productlistname,
    
    },
  });

  console.log("Product List ID:", productlist.id);
  console.log("productname", productlist.productlistname);
  console.log("products", productlist.products);

  const [products, setProducts] = useState<Product[]>([]);
  const [productlistForUpdate, setProductlistforUpdate] = useState<ProductList>(productlist);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  

  const UpdateListButton = async (
    productlist: ProductList
   
  ) => {
    const url = `http://localhost:3000/productslists/${productlist.id}`;
  console.log("Request URL:", url);

    const sanitizedProductList = {
      id: Number(productlist.id),
      productlistname: productlist.productlistname,
      products: productlist.products.map((product) => ({
        id: product.id || "temp-id", // Fyll i ett temporärt id om saknas
        productname: product.productname,
      })),
    };
  
    console.log("Payload sent to server:", sanitizedProductList);
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
        productlist
        ),
      });
      if (!response.ok) {
        const errorText = await response.text();
      console.error("Server response error:", errorText);
        throw new Error("failed to update list");
      }
      const data = await response.json();
      console.log("Update successful:", data);
      setProductlistforUpdate(data);
      return data;
    } catch (error) {
      console.error("Update failed:", error);
    throw error;
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
          <DialogTitle>Produktlista</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny Produkt
          </DialogDescription>
          <h3 className="font-semibold text-xl">{productlist.productlistname}</h3>
          <div className="mt-4 grid-cols-3 gap-2">
            {productlist.products.map((product, index) => (
              <div className="flex items-center space-x-2"
                key= {index}>

                 <p className="font-semibold">{product.productname}</p> 
                </div>
                
            ))}
              </div>
        
          
          
        </DialogHeader>
        
        <UpdateProductListButton productlist={productlist} onUpdate={onUpdate}/>
        
        
        </DialogContent>
        </Dialog>

        // <Form {...form}>
        //   <form
        //     onSubmit={handleSubmit}
        //     className="space-y-8"
        //   >
        //     <FormField
        //       control={form.control}
        //       name="productlistname"
        //       render={({ field }) => (
        //         <FormItem>
        //           <FormLabel>Produktlistnamn</FormLabel>
        //           <FormControl>
        //             <Input defaultValue={productlistForUpdate?.productlistname}
        //                   {...field}
        //                   onChange={(e) => {
        //                     field.onChange(e); // Uppdatera React Hook Form state
        //                     setProductlistforUpdate((prev) =>
        //                       prev ? { ...prev, productlistname: e.target.value } : prev
        //                     ); 
        //                   }}
        //                 />
        //           </FormControl>
        //           <Collapsible>
        //             <CollapsibleTrigger>
        //               Lägg till produkter i din lista
        //             </CollapsibleTrigger>
        //             <CollapsibleContent>
        //               {/* <div className="mt-4 grid-cols-3 gap-2">
        //                 {products.map((product) => (
        //                   <div
        //                     key={product.id}
        //                     className="flex items-center space-x-2"
        //                   >
        //                     <Checkbox
        //                       id={`product-${product.id}`}
        //                       checked={productlistForUpdate?.products.some((p) => p.id === product.id) || false}
        //                       onCheckedChange={(checked) => {
        //                         if (productlistForUpdate) {
        //                           const updatedProducts = checked
        //                             ? [...productlistForUpdate.products, product]
        //                             : productlistForUpdate.products.filter((p) => p.id !== product.id);
        //                           setProductlistforUpdate((prev) => prev && { ...prev, products: updatedProducts });
        //                         }
        //                       }}
        //                     />
        //                     <label
        //                       htmlFor={`product-${product.id}`}
        //                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        //                     >
        //                       {product.productname}
        //                     </label>
        //                   </div>
        //                 ))}
        //               </div> */}
        //               <button type="button" onClick={() => {
        //                 UpdateProductListButton(productlistForUpdate);
        //               }}>Uppdatera Listan</button>
        //             </CollapsibleContent>
        //           </Collapsible>
        //           <FormMessage />
        //         </FormItem>
        //       )}
        //     />
        //   </form>
        // </Form>
    
  );
}

export default HandleProductListButton;
