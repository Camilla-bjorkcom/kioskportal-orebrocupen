import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { Info } from "lucide-react";
import { DialogHeader } from "./ui/dialog";

const FacilityProductInfoComponent = () => {
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
            <DialogTitle>Information om anläggningshantering</DialogTitle>
          </DialogHeader>
          <div>
            <h4 className=" font-semibold">Anläggningar</h4>
            <p className="text-sm mt-1">
              Skapa upp anläggningar där turneringen kommer att spelas t.ex.
              Rosta Gärde.
            </p>
          </div>
          <div>
            <h4 className=" font-semibold">Kiosker</h4>
            <p className="text-sm mt-1">
              Skapa en eller flera kiosker i din anläggning som du sedan
              poulerar med dina skapade produkter. Detta behövs för att
              kioskerna ska kunna göra sina inventeringar.
            </p>
            <p className="text-sm mt-1">
              Du kan välja fler kiosker med hjälp av checkboxarna till höger för
              att populera kioskerna snabbare med produkter
            </p>
          </div>
          <div>
            <h4 className=" font-semibold">Kontaktpersoner</h4>
            <p className="text-sm mt-1">
              Du kan skapa kontaktpersoner för att koppla till en anläggning.
              Kontaktpersoner med rollen "planansvarig kan notifieras i vyn
              "Visa kioskernas inventering" om kiosker behöver påminnas om
              inventering.
            </p>
          </div>
          <div>
            <h4 className=" font-semibold">QR koder</h4>
            <p className="text-sm mt-1">
              Överst på sidan hittar du en knapp för att skriva ut samtliga
              QR-koder till dina skapade kiosker. Dessa används i kioskerna för
              att komma till en inventeringsvy.
            </p>
            <p className="text-sm mt-1">
              Varje kiosk har även möjlighet att skriva ut sin egen QR-kod som
              går till inventeringsvyn.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FacilityProductInfoComponent;
