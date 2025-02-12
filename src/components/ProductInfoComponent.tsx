import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Info } from "lucide-react";

const ProductInfoComponent = () => {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex items-center dark:hover:bg-slate-600 p-1 rounded-md hover:bg-gray-100">
            <Info className="h-4 w-4 mr-2" />
            <span className="text-xs font-semibold ">Info</span>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Information om produkthantering</DialogTitle>
          </DialogHeader>
          <div>
            <h4 className=" font-semibold">Turneringsprodukt</h4>
            <p className="text-sm mt-1">
              Skapa upp produkter som ska användas i turneringen.
            </p>
            <p className="text-sm mt-1">
              Fältet "Ange antal per förpackning (Valfritt)" hjälper dig att
              hålla koll på uträkningar för hur många produkter det finns totalt
              i inventeringsvyn.
            </p>
          </div>
          <div>
            <h4 className=" font-semibold">Produktlista</h4>
            <p className="text-sm mt-1">
              Skapa upp en eller flera produktlistor och lägg till dina skapade
              produkter för att enklare populera kiosker.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductInfoComponent;
