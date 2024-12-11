import { z } from "zod";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Checkbox } from "./ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";


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
    productlist: ProductList,
    onUpdate: (updatedList:ProductList) =>void;
} )
{
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productlistname: productlist.productlistname,
        },
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [productlistForUpdate, setProductlistforUpdate] = useState<ProductList>(productlist);
    const [isOpen , setIsOpen] =useState(false);


    const handleToggle = (open: boolean) => {
        setIsOpen(open);
    }

    

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
    
            // Kolla om anropet lyckades
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server response error:", errorText);
                throw new Error("Failed to update list");
            }
    
            // Returnera den uppdaterade datan om allt gick bra
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
                setIsOpen(false);
                
    
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
        <Dialog  open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <Button >Redigera Produktlista</Button>
                
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Produktlista</DialogTitle>
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
                                                    prev ? { ...prev, productlistname: e.target.value } : prev
                                                );
                                            }}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Collapsible  open={isOpen} onOpenChange={handleToggle}>
                            <CollapsibleTrigger>
                            <Button style={{ display: isOpen ? "none" : "inline-block" }}> Lägg till produkter i din lista</Button>
                               
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="mt-4 grid-cols-3 gap-2">
                                    {products.map((product) => (
                                        <div key={product.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`product-${product.id}`}
                                                checked={productlistForUpdate?.products.some((p) => p.id === product.id) || false}
                                                onCheckedChange={(checked) => {
                                                    if (productlistForUpdate) {
                                                        const updatedProducts = checked
                                                            ? [...productlistForUpdate.products, product]
                                                            : productlistForUpdate.products.filter((p) => p.id !== product.id);
                                                        setProductlistforUpdate((prev) => prev && { ...prev, products: updatedProducts });
                                                    }
                                                }}
                                            />
                                            <label htmlFor={`product-${product.id}`} className="text-sm font-medium">
                                                {product.productname}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={() => saveChangesToProductList(productlistForUpdate)}>
                                    Uppdatera Listan
                                </Button>
                            </CollapsibleContent>
                        </Collapsible>
                        <FormMessage />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateProductListButton;
