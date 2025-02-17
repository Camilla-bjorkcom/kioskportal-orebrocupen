import { toast } from "@/hooks/use-toast";

export const okToast = (description: string) =>
  toast({
    title: "Lyckat",
    description,
    className: "bg-green-200 dark:bg-green-400 dark:text-black",
  });

export const badToast = (description: string) =>
  toast({
    title: "Fel",
    description,
    className: "bg-red-200 dark:bg-red-400 dark:text-black",
  });
