import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Toaster } from "./ui/toaster";
import { Button } from "./ui/button";
import { ContactPerson } from "@/interfaces";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { updateContactPerson } from "@/api/functions/updateContactPerson";
import { badToast, okToast } from "@/utils/toasts";
import { NoResponseError } from "@/api/functions/apiErrors";

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

interface UpdateContactPersonButtonProps {
  id: string;
  contactPerson: ContactPerson;
}

const UpdadeContactPersonButton = ({
  id,
  contactPerson,
}: UpdateContactPersonButtonProps) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contactPerson.name,
      phone: contactPerson.phone,
      role: contactPerson.role,
    },
  });

  useEffect(() => {
    if (contactPerson) {
      form.reset({
        name: contactPerson.name,
        phone: contactPerson.phone,
        role: contactPerson.role,
      });
    }
  }, [contactPerson, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const updatedContactPerson = await updateContactPerson(
        {
          id: contactPerson.id,
          name: values.name,
          phone: values.phone,
          role: values.role,
          facilityId: contactPerson.facilityId,
        },
        id!
      );
      queryClient.invalidateQueries({ queryKey: ["facilities"] });

      if (!updatedContactPerson) throw new Error("No contact person found");
      okToast("Kontaktpersonen har uppdaterats");
    } catch (error) {
      if (error instanceof NoResponseError) {
        badToast("Misslyckades med att uppdatera kontaktperson");
      } else {
        badToast("Misslyckades med att uppdatera kontaktperson");
      }
    }

    setOpen(false);
    form.reset();
  }

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Pencil className="w-5 h-5 hover:text-orange-n place-self-center" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redigera kontaktperson</DialogTitle>
            <DialogDescription className="sr-only">
              Redigera kontaktperson
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Namn på kontaktperson</FormLabel>
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
                            <SelectLabel>Roller</SelectLabel>
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
                  className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
                >
                  Spara
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdadeContactPersonButton;
