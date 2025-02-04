import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/components/ui/form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { useParams } from "react-router-dom";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { useEffect, useState } from "react";


type StorageInventory = {
  inventoryDate: string;
  products: TournamentProducts[];
};

interface TournamentProducts {
  id: string;
  productName: string;
  amountPackages: number;
  amountPerPackage: number;
}

function InventoryStorage() {
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    products: z.array(
      z.object({
        productName: z.string().min(1, "Produktnamn är obligatoriskt"),
        amountPackages: z.coerce
          .number()
          .min(0, "Antal paket måste vara större än eller lika med 0"),
        id: z.string(),
        amountPerPackage: z.number(),
      })
    ),
  });

  const { isLoading, error, data, isSuccess } = useQuery<StorageInventory>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      const response = await fetchWithAuth(`products/${tournamentId}`);
      if (!response) {
        throw new Error("Failed to fetch products");
      }
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      return data;
    },
  });

  const [formValues, setFormValues] = useState<TournamentProducts[] | null>();

  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        products: formValues || [],
      },
    });
  
    useEffect(() => {
      if (isSuccess && data?.products) {  
        setFormValues(data.products.map((product) => ({
          id: product.id,
          productName: product.productName,
          amountPackages: product.amountPackages,
          amountPerPackage: product.amountPerPackage,
        })));
      }
    }, [isSuccess, data]); 

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("I onSubmit" + values);
      const response = await fetchWithAuth(
        `tournaments/${tournamentId}/inventories`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values.products),
        }
      );
      if (!response) {
        throw new Error("Failed to update list");
      }
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error("Failed to update list");
      }
      queryClient.invalidateQueries({ queryKey: ["inventoryList"] });
      toast({
        className: "bg-green-200",
        title: "Lyckat!",
        description: "Inventering skickades iväg",
      });
     
      form.reset();
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        className: "bg-red-200",
        title: "Misslyckat!",
        description: "Inventering misslyckades",
      });
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

 

  return (
    <>
      <Toaster />
      <div className="container mx-auto p-3">
        <div className="rounded-xl border border-black border-solid text-black aspect-video dark:border-slate-500">
          <h2 className="text-lg lg:text-2xl text-center w-full mt-10 font-semibold dark:text-gray-200">
            Inventera huvudlager
          </h2>
          <div className="w-full place-items-center mt-5 gap-3 mb-16">
            <p className="text-sm  dark:text-gray-200">
              Senast inventering gjord:
            </p>
            <h3 className="text-sm font-semibold dark:text-gray-200">
              {new Date(data?.inventoryDate ?? "").toLocaleString("sv-SE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </h3>
          </div>

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
              className="w-fit mx-auto mb-20"
            >
              {data?.products.map((product, index) => (
                <div
                  key={product.id}
                  className={`space-y-4 lg:flex ${
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-slate-900 rounded-lg p-5"
                      : "bg-white dark:bg-slate-800 rounded-lg p-5"
                  }`}
                >
                  <FormField
                    key={product.id}
                    control={form.control}
                    name={`products.${index}.productName`}
                    render={() => (
                      <FormItem className="place-content-center">
                        <FormLabel>
                          <p className="w-[280px] lg:w-[300px] text-lg dark:text-gray-200">
                            {product.productName}
                          </p>
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-5 dark:border:solid dark:border-gray-500">
                    <FormField
                      key={product.id}
                      control={form.control}
                      name={`products.${index}.amountPackages`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-gray-200">
                            Antal förpackningar
                          </FormLabel>
                          <FormControl className="dark:text-gray-200 dark:border-gray-500">
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              <div className="w-1/2 place-self-center">
                <Button type="submit" className="w-full mt-10">
                  Skicka in inventering
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}


export default InventoryStorage;
