"use client";

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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  onSave: (
    name: string,
    facilityId: string,
    phone: string,
    role: string
  ) => void;
  facilityId: string;
}

function AddContactPersonButton({
  onSave,
  facilityId,
}: AddContactPersonButtonProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      role: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values.name, values.phone, values.role, facilityId);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto"
          onClick={(e) => e.stopPropagation()} // Stoppa eventbubbling
        >
          Lägg till kontaktperson{" "}
          <PlusIcon className="w-4 h-4 place-self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => {
          e.stopPropagation(); // Hindrar event från att bubbla upp till AccordionTrigger
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
            {/* Fält för namn */}
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

            {/* Fält för telefonnummer */}
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

            {/* Roll-select */}
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
