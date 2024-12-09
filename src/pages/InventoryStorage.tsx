import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  useFieldArray,
  FormProvider,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";




function InventoryStorage() {
  const inventoryDate = "2025-06-13 14:25";
  const {pathname} = useLocation();

  const formSchema = z.object({
    products: z.array(
      z.object({
        productName: z.string().min(1, "Produktnamn är obligatoriskt"),
        amountPieces: z
          .number()
          .min(0, "Antal stycken måste vara större än eller lika med 0"),
        amountPackages: z
          .number()
          .min(0, "Antal paket måste vara större än eller lika med 0"),
      })
    ),
  });

  type FormData = z.infer<typeof formSchema>;

  type Inventory = {
    productName: string;
    amountPieces: number;
    amountPackages: number;
  };

  const inventoryList: Inventory[] = [
    { productName: "Korv", amountPieces: 50, amountPackages: 5 },
    { productName: "Hamburgare", amountPieces: 100, amountPackages: 10 },
    { productName: "Coca-cola", amountPieces: 200, amountPackages: 20 },
    { productName: "Kexchoklad", amountPieces: 150, amountPackages: 15 },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      products: inventoryList,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  function Form({
    children,
    ...formProps
  }: UseFormReturn<any> & { children: React.ReactNode }) {
    return <FormProvider {...formProps}>{children}</FormProvider>;
  }

  return (
    <>

      <div className="container mx-auto">
        <h1 className="text-4xl font-bold w-full mb-10 mt-5">
          Inventering för lager
        </h1>
        <div className="rounded-xl border border-black border-solid text-black aspect-video">
          <div className="flex flex-col w-full place-items-center mt-5 gap-3 mb-16">
            <p className="text-lg">Senast inventering gjord:</p>
            <h3 className="text-lg font-semibold">{inventoryDate}</h3>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-fit mx-auto mb-20"
            >
              {fields.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`products.${index}.productName`}
                  render={() => (
                    <div
                      className={`space-y-4 ${
                        index % 2 === 0 ? "bg-gray-100 rounded-lg p-5" : "bg-white rounded-lg p-5"
                      }`}
                    >
                      <FormItem>
                        <div className="flex gap-20 mx-auto">
                          <FormLabel className="self-center w-[100px]">
                            {item.productName}
                          </FormLabel>

                          <div className="flex gap-5">
                            <FormField
                              control={form.control}
                              name={`products.${index}.amountPieces`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Antal i styck</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="text" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`products.${index}.amountPackages`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Antal i förpackningar</FormLabel>
                                  <FormControl>
                                    <Input {...field} type="text" />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </FormItem>
                    </div>
                  )}
                />
              ))}
              <div className="w-1/2 place-self-center">
                <Button type="submit" className="w-full mt-10">
                  Skicka inventering
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
