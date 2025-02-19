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
              att populera kioskerna snabbare med produkter.
            </p>
          </div>
          <div>
            <h4 className=" font-semibold">Kontaktpersoner</h4>
            <p className="text-sm mt-1">
              Du kan skapa kontaktpersoner kopplade till en anläggning.
              Kontaktpersoner med rollen "planansvarig" kan notifieras i vyn
              "Visa kioskernas inventering" om kiosker behöver påminnas om
              att göra sin inventering.
            </p>
          </div>
          <div>
            <h4 className=" font-semibold">QR koder</h4>
            <p className="text-sm mt-1">
             QR-koder används ute i kioskerna för att komma till inventeringsvyn. Du har möjlighet att skriva ut alla QR-koder på en gång eller var för sig för varje kiosk. Alla QR-koder är unika och ska placeras i rätt kiosk för att inventering av kioskens produkter ska bli så tillförlitlig som möjligt. 
            </p>       
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FacilityProductInfoComponent;
