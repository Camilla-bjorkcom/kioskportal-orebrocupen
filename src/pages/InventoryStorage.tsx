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
import { useQueryClient } from "@tanstack/react-query";

import { useParams } from "react-router-dom";
import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { useEffect } from "react";

import { InventoryStorageProducts } from "@/interfaces/product";
import { badToast, okToast } from "@/utils/toasts";
import { useGetAllStorageProducts } from "@/hooks/use-query";
import ScrolltoTopBtn from "@/components/ScrollToTopBtn";

function InventoryStorage() {
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;
  const queryClient = useQueryClient();

  const formSchema = z.object({
    amountPackages: z.array(
      z
        .union([z.number(), z.nan()])
        .transform((val) => (isNaN(val) ? 0 : val))
        .refine((val) => val >= 0, {
          message: "Antal paket måste vara minst 0",
        })
    ),
  });

  const { isLoading, error, data, isSuccess } = useGetAllStorageProducts(
    tournamentId!
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { amountPackages: [] },
    mode: "onChange",
  });

  const { reset, formState } = form;

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      form.reset({ amountPackages: [] });
    }
  }, [formState, reset]);

  const onSubmit = async (values: { amountPackages: number[] }) => {
    const inventoryData = data?.products.map(
      (product, index) =>
        ({
          id: product.id,
          productName: product.productName,
          amountPerPackage: product.amountPerPackage,
          amountPackages: values.amountPackages[index],
        }) satisfies InventoryStorageProducts
    );
    try {
      const response = await fetchWithAuth(
        `tournaments/${tournamentId}/inventories`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(inventoryData),
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

      okToast("Inventeringen har skickats in");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["storageProducts"] });
    } catch (error) {
      console.error("Update failed:", error);
      badToast("Misslyckades med att skicka in inventering");

      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-5 py-10 flex justify-center items-center">
        <div className="text-center">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          ></div>
          <p className="mt-4 text-gray-500">Laddar turneringsdata...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }

  return (
    <>
      <div className="container mx-auto p-3">
        <ScrolltoTopBtn />
        <div className="rounded-xl border border-black border-solid text-black aspect-video dark:border-slate-500">
          <h2 className="text-lg lg:text-2xl text-center w-full mt-10 font-semibold dark:text-gray-200">
            Inventera huvudlager
          </h2>
          <div className="w-full place-items-center mt-5 gap-3 mb-16">
            <p className="text-sm dark:text-gray-200">
              Senast inventering gjord:
            </p>
            <h3 className="text-sm font-semibold dark:text-gray-200">
              {data?.inventoryDate === "ingen inventering gjord"
                ? data?.inventoryDate
                : new Date(data!.inventoryDate).toLocaleString("sv-SE", {
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
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-fit mx-auto mb-20"
            >
              {isSuccess && data.products && data.products.length > 0 ? (
                data.products
                  .toSorted((a, b) =>
                    a.productName.localeCompare(b.productName)
                  )
                  .map((product, index) => (
                    <div
                      key={product.id}
                      className="space-y-4 lg:flex odd:bg-gray-200 dark:bg-slate-800  bg-white odd:dark:bg-slate-700 rounded-lg p-5"
                    >
                      <FormItem className="place-content-center">
                        <FormLabel>
                          <p className="w-[280px] lg:w-[300px] text-lg dark:text-gray-200">
                            {product.productName}
                          </p>
                        </FormLabel>
                      </FormItem>

                      <div className="flex gap-5 dark:border:solid dark:border-gray-500">
                        <FormField
                          control={form.control}
                          name={`amountPackages.${index}`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <FormLabel className="dark:text-gray-200">
                                Antal förpackningar
                              </FormLabel>
                              <FormControl className="dark:text-gray-200 dark:border-gray-500">
                                <Input
                                  {...field}
                                  value={
                                    field.value === undefined ||
                                    isNaN(field.value)
                                      ? ""
                                      : field.value
                                  }
                                  placeholder="Ange antal"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d+$/.test(val)) {
                                      field.onChange(
                                        val === "" ? undefined : Number(val)
                                      );
                                    }
                                  }}
                                  onBlur={(e) => {
                                    if (e.target.value === "") {
                                      field.onChange(0);
                                    }
                                  }}
                                />
                              </FormControl>
                              {fieldState.error && (
                                <p className="text-red-500 text-sm">
                                  Fältet måste fyllas i
                                </p>
                              )}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <p className="dark:text-white">
                  Inga produkter tillagda i turneringen
                </p>
              )}
              <div className="w-1/2 place-self-center">
                <Button
                  type="submit"
                  className="w-full mt-10"
                  disabled={!formState.isValid}
                >
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
