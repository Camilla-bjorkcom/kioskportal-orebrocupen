"use client";

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
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

const formSchema = z.object({
  facilityName: z.string().min(2, {
    message: "Anläggnings namn måste ha minst 2 bokstäver",
  }),
});

interface UpdateFacilityButtonProps {
  facility: Facility;
  onSave: (facility: Facility) => void;
}

interface Facility {
  id: number;
  facilityname: string;
}

const UpdateFacilityButton = ({
  facility,
  onSave,
}: UpdateFacilityButtonProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityName: facility.facilityname,
    },
  });

  useEffect(() => {
    if (facility) {
      form.reset({ facilityName: facility.facilityname });
    }
  }, [facility, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedFacility = { ...facility, facilityname: values.facilityName };
    onSave(updatedFacility);
    setOpen(false);
    form.reset();
  }

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Pencil className="w-5 h-5 hover:text-orange-n" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redigera Anläggning</DialogTitle>
            <DialogDescription className="sr-only">
              Redigera anläggningsnamn
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
                      <Input
                        placeholder="Skriv in anläggnings namn"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow"
                  onClick={() => {
                    toast({
                      className: "bg-orange-200",
                      title: "Ändringen sparades",
                      description: "Anläggningen har uppdaterats",
                    });
                  }}
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

export default UpdateFacilityButton;
