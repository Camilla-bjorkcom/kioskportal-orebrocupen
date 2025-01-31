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
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../components/ui/toaster";
import { useParams } from "react-router-dom";
import fetchWithAuth from "@/api/functions/fetchWithAuth";

type StorageInventory = {
  inventoryDate: string;
  products: Products[];
};

interface Products {
  id: string;
  productName: string;
  amountPackages: number;
}

function InventoryStorage() {
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;
  const { toast } = useToast();

  const formSchema = z.object({
    products: z.array(
      z.object({
        productName: z.string().min(1, "Produktnamn är obligatoriskt"),
        amountPackages: z.coerce
          .number()
          .min(0, "Antal paket måste vara större än eller lika med 0"),
      })
    ),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    isLoading,
    error,
    data,
  } = useQuery<StorageInventory>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `products/${tournamentId}`
      );
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: [],
    },
  });

  const handleSubmit = form.handleSubmit(async (data: FormData) => {
    console.log("I handlesubmit");
    try {
      const updatedList = await saveChangesToInventoryList(data);
      console.log("Updated list:", updatedList);
    } catch (error) {
      console.error("Failed to save changes", error);
    }
  }, console.error);

  const saveChangesToInventoryList = async (data: FormData) => {
    const url = `tournaments/${tournamentId}/inventories`;
    try {
      const response = await fetchWithAuth(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error("Failed to update list");
      }
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response error:", errorText);
        throw new Error("Failed to update list");
      }
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
        <div className="rounded-xl border border-black border-solid text-black aspect-video">
          <h2 className="text-lg lg:text-2xl text-center w-full mt-10 font-semibold">
            Inventera lagret
          </h2>
          <div className="w-full place-items-center mt-5 gap-3 mb-16">
            {
              data?.inventoryDate
                ? <><p className="text-sm lg:text-lg">Senast inventering gjord:</p><h3 className="lg:text-lg font-semibold">{data?.inventoryDate}</h3></>   
                : <p className="text-sm lg:text-lg">Ingen inventering har gjorts än</p>
            }
          
            
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="w-fit mx-auto mb-20">
              {data?.products.map((product, index) => (
                <div
                  key={product.id}
                  className={`space-y-4 lg:flex ${
                    index % 2 === 0
                      ? "bg-gray-100 rounded-lg p-5"
                      : "bg-white rounded-lg p-5"
                  }`}
                >
                  <FormField
                    key={product.id}
                    control={form.control}
                    name={`products.${index}.productName`}
                    render={() => (
                      <FormItem className="place-content-center">
                        <FormLabel>
                          <p className="w-[280px] lg:w-[300px] text-lg">
                            {product.productName}
                          </p>
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-5">
                    <FormField
                      key={index}
                      control={form.control}
                      name={`products.${index}.amountPackages`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Antal i förpackningar</FormLabel>
                          <FormControl>
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
