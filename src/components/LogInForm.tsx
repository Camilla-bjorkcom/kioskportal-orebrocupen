"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email({ message: "Ange en giltig e-postadress." }),
  password: z.string().min(8, { message: "Lösenordet måste vara minst 8 tecken." }),
});

export function LogInForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "", // Standardvärde
      password: "", // Standardvärde

    },
  });

  const navigate = useNavigate();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    navigate("/tournaments"); // Logga värden
    form.reset(); // Återställ formuläret
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-8 space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="w-3/4 lg:w-1/3" placeholder="Ange din mailadress" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                Ange din e-postadress för att logga in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lösenord</FormLabel>
              <FormControl>
                <Input className="w-3/4 lg:w-1/3" placeholder="Ange ditt lösenord" {...field} />
              </FormControl>
              <FormDescription className="sr-only">
                Ange ditt lösenord för att logga in.
              </FormDescription>
              <FormMessage />
              <p className="pt-3">Har du inget konto?<a className="font-bold hover:text-neutral-400" href="/signup"> Skapa ett här</a></p>
            </FormItem>
          )}
        />
        <Button type="submit">Logga in</Button>
      </form>
    </Form>
  );
}
