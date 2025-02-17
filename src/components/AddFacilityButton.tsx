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
import { DuplicateError, NoResponseError } from "@/api/functions/apiErrors";
import { createFacility } from "@/api/functions/createFacility";
import { toast } from "@/hooks/use-toast";
import { okToast, badToast } from "@/utils/toasts";
import { useQueryClient } from "@tanstack/react-query";
import { Facility } from "@/interfaces";

const formSchema = z.object({
  facilityName: z.string().min(2, {
    message: "Anläggnings namn måste ha minst 2 bokstäver",
  }),
});

interface AddFacilityButtonProps {
  id: string;
}

function AddFacilityButton({ id }: AddFacilityButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const facilityCreated = await createFacility(id!, values.facilityName);
      if (!facilityCreated) {
        throw new NoResponseError("No response from server");
      }

      queryClient.invalidateQueries({ queryKey: ["facilities"] });

      okToast(`Anläggning ${values.facilityName} skapades`);
    } catch (error) {
      if (error instanceof DuplicateError) {
        badToast(`Anläggning med namnet ${values.facilityName} finns redan.`);
      } else if (error instanceof NoResponseError) {
        badToast("Misslyckades med att skapa anläggning.");
      } else {
        badToast("Misslyckades med att skapa anläggning.");
      }
    }

    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className=" flex w-fit gap-2 cursor-pointer">
          Lägg till anläggning{" "}
          <PlusIcon className="w-4 h-4 place-self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa Anläggning</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny anläggning
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="facilityName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Namn på anläggning</FormLabel>
                  <FormControl>
                    <Input placeholder="Skriv in anläggnings namn" {...field} />
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
                Spara anläggning
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddFacilityButton;
