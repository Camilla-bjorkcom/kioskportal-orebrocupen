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

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Förnamnet måste vara minst 2 tecken." }),
    lastName: z
      .string()
      .min(2, { message: "Efternamnet måste vara minst 2 tecken." }),
    email: z.string().email({ message: "Ange en giltig e-postadress." }),
    password: z
      .string()
      .min(8, { message: "Lösenordet måste vara minst 8 tecken." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Lösenordet måste vara minst 8 tecken." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden måste matcha.",
    path: ["confirmPassword"], // Placerar felet vid "confirmPassword"-fältet
  });

export function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "", // Standardvärde
      lastName: "", // Standardvärde
      email: "", // Standardvärde
      password: "", // Standardvärde
      confirmPassword: "", // Standardvärde
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
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Förnamn</FormLabel>
              <FormControl>
                <Input
                  className="w-3/4 lg:w-1/3"
                  placeholder="Ange din mailadress"
                  {...field}
                />
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
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Efternamn</FormLabel>
              <FormControl>
                <Input
                  className="w-3/4 lg:w-1/3"
                  placeholder="Ange din mailadress"
                  {...field}
                />
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="w-3/4 lg:w-1/3"
                  placeholder="Ange din mailadress"
                  {...field}
                />
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
                <Input
                  type="password"    
                  className="w-3/4 lg:w-1/3"
                  placeholder="Ange ditt lösenord"
                  {...field}
                />
              </FormControl>
              <FormDescription className="sr-only">
                Ange ditt lösenord för att logga in.
              </FormDescription>
              <FormMessage />             
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upprepa lösenord</FormLabel>
              <FormControl>
                <Input
                  type="password"  
                  className="w-3/4 lg:w-1/3"
                  placeholder="Ange ditt lösenord igen"
                  {...field}
                />
              </FormControl>
              <FormDescription className="sr-only">
                Ange din e-postadress för att logga in.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Skapa användare</Button>
      </form>
    </Form>
  );
}
