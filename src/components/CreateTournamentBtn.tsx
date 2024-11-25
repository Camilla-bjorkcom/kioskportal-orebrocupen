import { PlusIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { DatePicker } from "./DatePicker";
import { Label } from "./ui/label";

const CreateTournamentBtn = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex flex-col p-2 justify-between rounded-xl border-2 border-dashed bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32">
          <PlusIcon className=" w-32 h-32 mx-auto" />
          <p className="text-center w-full mb-4 ">Skapa turnering</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Skapa turnering</DialogTitle>
          <DialogDescription className="sr-only">
            Fyll i informationen för att skapa en ny turnering</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
              <Label>Turneringsnamn</Label>
              <Input />
          </div>
          <div className="flex flex-col space-y-2">
              <Label>Datum</Label>
              <DatePicker />
          </div>
          <div className="flex justify-end">
            <button className=" border border-solid hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow">Spara Turnering</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTournamentBtn;
