import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { PlusIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { Button } from "./ui/button";
import { createKiosk } from "@/api/functions/createKiosk";
import { badToast, okToast } from "@/utils/toasts";
import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  kioskName: z.string().min(2, {
    message: "Kiosk namn måste ha minst 2 bokstäver",
  }),
});

interface AddKioskButtonProps {
  tournamentId: string; 
  facilityId: string;
  onFacilityAdded?: (facilityId: string) => void;
}

function AddKioskButton({
  tournamentId,
  facilityId,
  onFacilityAdded,
}: AddKioskButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kioskName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const kioskCreated = await createKiosk(values.kioskName, facilityId, tournamentId!);
      if (!kioskCreated) throw new NoResponseError("No response from server");
      queryClient.invalidateQueries({ queryKey: [tournamentId, "facilities"] });

      onFacilityAdded?.(facilityId);

      okToast(`Anläggning ${values.kioskName} skapades`);
    } catch (error) {
      if (error instanceof DuplicateError) {
        badToast(`Kiosk med namnet ${values.kioskName} finns redan.`);
      } else if (error instanceof NoResponseError) {
        badToast("Misslyckades med att skapa kiosk.");
      } else {
        badToast("Misslyckades med att skapa kiosk.");
      }
    }

    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto dark:hover:bg-slate-600 dark:hover:text-gray-200"
          onClick={(e) => e.stopPropagation()} 
        >
          Lägg till kiosk <PlusIcon className="w-4 h-4 place-self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation(); 
        }}
      >
        <DialogHeader>
          <DialogTitle>Skapa Kiosk</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny kiosk
          </DialogDescription>
        </DialogHeader>
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
                className="border border-solid hover:bg-slate-800  hover:text-white rounded-xl p-2 mt-8 shadow"
              >
                Spara kiosk
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddKioskButton;
