import { useEffect, useState } from "react";
import { Kiosk } from "@/interfaces";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Pencil } from "lucide-react";
import { updateKiosk } from "@/api/functions/updateKiosk";
import { NoResponseError } from "@/api/functions/apiErrors";
import { okToast, badToast } from "@/utils/toasts";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  kioskName: z.string().min(2, {
    message: "Kiosk namn måste ha minst 2 bokstäver",
  }),
});

interface UpdateKioskKioskButtonProps {
  tournamentId: string;
  kioskForEdit: Kiosk;
}
function UpdateKioskKioskButton({
  kioskForEdit,
  tournamentId,
}: UpdateKioskKioskButtonProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kioskName: kioskForEdit.kioskName,
    },
  });
  useEffect(() => {
    if (kioskForEdit) {
      form.reset({ kioskName: kioskForEdit.kioskName });
    }
  }, [kioskForEdit, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
     
      const updatedKioskResult = await updateKiosk({tournamentId:tournamentId!, facilityId:kioskForEdit.facilityId, kioskId:kioskForEdit.id, kioskName:values.kioskName});
      queryClient.invalidateQueries({ queryKey: [tournamentId, "facilities"] });

      if (!updatedKioskResult) throw new Error("Misslyckades med att uppdatera kiosknamn");
      okToast("Kiosknamn har uppdaterats");
    } catch (error) {
      if (error instanceof NoResponseError) {
        badToast("Misslyckades med att uppdatera kiosknamn");
      } else {
        badToast("Misslyckades med att uppdatera kiosknamn");
      }
    }

    setOpen(false);
    form.reset();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button variant={"outline"} size={"icon"}>
            <Pencil className="w-5 h-5 hover:text-orange-n" />
          </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Vald kiosk:{" "}
            {kioskForEdit ? kioskForEdit.kioskName : "Ingen kiosk vald"}
          </DialogTitle>
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
                  className=" border border-solid hover:bg-slate-800 hover:text-white p-2  shadow"
                >
                  Uppdatera kiosknamn
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateKioskKioskButton;
