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
import { Toaster } from "./ui/toaster";
import { Pencil } from "lucide-react";


const formSchema = z.object({
  kioskName: z.string().min(2, {
    message: "Kiosk namn måste ha minst 2 bokstäver",
  }),
});

interface EditSelectedKioskButtonProps {
  kioskForEdit: Kiosk;
  onKioskUpdated: (updatedkiosk: Kiosk) => void;
  onSave: (kiosk: Kiosk) => void;
  onUpdateKioskClick: () => void;
}
function EditSelectedKioskButton({
  kioskForEdit,
  onSave,
  onUpdateKioskClick,
}: EditSelectedKioskButtonProps) {

  const [open, setOpen] = useState(false);
 


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

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUpdateKioskClick();
    const updatedKiosk = { ...kioskForEdit, kioskName: values.kioskName };
    onSave(updatedKiosk);
    setOpen(false);
    form.reset();
  }
  return (
    <Dialog open={open}>
      <Toaster />
      <DialogTrigger>
        <div
          className="flex flex-col place-self-center hover:text-orange-n"
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
        >
          <Pencil className="mr-0.5 2xl:mr-5 w-[20px] h-[20px] items-center mt-1" />
        </div>
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

export default EditSelectedKioskButton;
