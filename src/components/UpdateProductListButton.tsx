import { z } from "zod";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Checkbox } from "./ui/checkbox";
import { useQuery } from "@tanstack/react-query";

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
    productlistId: ProductList["id"];
    onClose: () => void;
  }

// const saveChangesToProductList(productlist: ProductList) {
//     const url = `http://localhost:3000/productslists/${productlist.id}`;
//     const sanitizedProductList = {
//         id: Number(productlist.id),
//         productlistname: productlist.productlistname,
//         products: productlist.products.map((product) => ({
//             id: product.id || "temp-id", 
//             productname: product.productname,
//         })),
//     };

//     try {
//         const response = await fetch(url, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(sanitizedProductList),
//         });
//         if (!response.ok) {
//             const errorText = await response.text();
//             console.error("Server response error:", errorText);
//             throw new Error("Failed to update list");
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error("Update failed:", error);
//         throw error;
//     }
// }



function UpdateProductListButton({
    productlistId,
    onClose,
}:UpdateProductListButtonProps ) 
{
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productlistname: productlist.productlistname,
        },
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [productlistForUpdate, setProductlistforUpdate] = useState<ProductList["id"]>();

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
                id: product.id || "temp-id", // Använd ett temporärt ID om inget finns
                productname: product.productname,
            })),
        };
    
        try {
            // Utför API-anropet för att uppdatera produktlistan
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
            return data;
        } catch (error) {
            console.error("Update failed:", error);
            throw error;
        }
    };


    const handleSubmit = form.handleSubmit(async (values) => {
        if (productlistForUpdate) {
            try {
                const updatedList = await saveChangesToProductList({
                    ...productlistForUpdate,
                    productlistname: values.productlistname,
                });
                setProductlistforUpdate(updatedList);
                onClose(); // Optionally close the dialog after saving
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
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex flex-col p-2 justify-between bg-card text-card-foreground hover:text-white text-black aspect-video h-32">
                    {/* Trigger content */}
                </div>
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
                        <Collapsible>
                            <CollapsibleTrigger>
                                Lägg till produkter i din lista
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
                                <button type="button" onClick={() => saveChangesToProductList(productlistForUpdate)}>
                                    Uppdatera Listan
                                </button>
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
