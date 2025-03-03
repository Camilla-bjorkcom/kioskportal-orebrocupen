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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";
import { createContactPerson } from "@/api/functions/createContactPerson";
import { useQueryClient } from "@tanstack/react-query";
import { badToast, okToast } from "@/utils/toasts";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Kontaktpersonens namn måste ha minst 2 bokstäver",
  }),
  phone: z.string().min(2, {
    message: "Telefonnummer måste finnas",
  }),
  role: z.string().min(2, {
    message: "Roll måste finnas",
  }),
});

interface AddContactPersonButtonProps {
  tournamentId: string;
  facilityId: string;
  onFacilityAdded?: (facilityId: string) => void;
}

function AddContactPersonButton({
  tournamentId,
  facilityId,
  onFacilityAdded,
}: AddContactPersonButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const contactPersonCreated = await createContactPerson(
        values.name,
        values.phone,
        values.role,
        facilityId,
        tournamentId!
      );
      if (!contactPersonCreated) {
        throw new NoResponseError("No response from server");
      }
      queryClient.invalidateQueries({ queryKey: [tournamentId, "facilities"] });

      onFacilityAdded?.(facilityId);

      okToast(`Kontaktperson ${values.name} skapades`);
    } catch (error) {
      if (error instanceof DuplicateError) {
        badToast(`Kiosk med namnet ${values.name} finns redan.`);
      } else if (error instanceof NoResponseError) {
        badToast("Misslyckades med att skapa kontaktperson.");
      } else {
        badToast("Misslyckades med att skapa kontaktperson.");
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
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto dark:hover:bg-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          Lägg till kontaktperson{" "}
          <PlusIcon className="w-4 h-4 place-self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>Skapa Kontaktperson</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny kontaktperson
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Skriv in kontaktpersonens namn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv in telefonnummer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roll</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Välj en roll" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Planansvarig">
                            Planansvarig
                          </SelectItem>
                          <SelectItem value="Kiosk">Kiosk</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                className="border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
              >
                Spara kontaktperson
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddContactPersonButton;
