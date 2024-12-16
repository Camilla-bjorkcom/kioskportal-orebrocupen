import { useState } from "react";
import { BellRing, PlusIcon, Trash, UserPenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


type ContactPerson = {
  id: number;
  name: string;
  phone: string;
  role: string;
  facility: string;
};

type Props = {
  contactPersons: ContactPerson[];
  onSave: (
    name: string,
    facility: string,
    phone: string,
    role: string
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (
    id: number,
    name: string,
    facility: string,
    phone: string,
    role: string
  ) => Promise<void>;
};

const ContactPersonComponent = ({
  contactPersons,
  onSave,
  onUpdate,
  onDelete,
}: Props) => {
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [editingPerson, setEditingPerson] = useState<ContactPerson | null>(
    null
  );
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [facility, setFacility] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const startEditing = (person: ContactPerson) => {
    setEditingPerson(person);
    setName(person.name);
    setPhone(person.phone);
    setRole(person.role);
    setFacility(person.facility);
  };

  const addContactPerson = async () => {
    if (!name.trim() || !phone.trim() || !facility.trim()) {
      alert("Alla fält måste fyllas i!");
      return;
    }

    await onSave(name, facility, phone, role);
    setName("");
    setPhone("");
    setRole("");
    setFacility("");
    setShowInputs(false);
  };

  const saveChanges = async () => {
    if (!editingPerson) return;

    if (!name.trim() || !phone.trim() || !facility.trim()) {
      alert("Alla fält måste fyllas i!");
      return;
    }

    await onUpdate(editingPerson.id, name, facility, phone, role);
    setEditingPerson(null);
    setName("");
    setPhone("");
    setRole("");
    setFacility("");
  };

  const cancelEditing = () => {
    setEditingPerson(null);
    setName("");
    setPhone("");
    setRole("");
    setFacility("");
  };

  const sortedContactPersons = [...contactPersons].sort((a, b) => {
    if (a.facility.toLowerCase() < b.facility.toLowerCase()) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a.facility.toLowerCase() > b.facility.toLowerCase()) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="container mx-auto">
      {editingPerson ? (
        <div className="mt-4">
          <h3>Redigera kontaktperson</h3>
          <input
            type="text"
            placeholder="Namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block border border-gray-300 rounded-md p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Telefonnummer"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block border border-gray-300 rounded-md p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Anläggning"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            className="block border border-gray-300 rounded-md p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Roll"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block border border-gray-300 rounded-md p-2 mb-2"
          />

          <Button
            className="text-white px-4 py-2 rounded mt-2"
            onClick={saveChanges}
          >
            Spara ändringar
          </Button>
          <Button
            className="text-white px-4 py-2 rounded mt-2 ml-2"
            onClick={cancelEditing}
          >
            Avbryt
          </Button>
        </div>
      ) : (
        <>
          <Button
            className="mt-4 text-white px-4 py-2 rounded mb-4 hover:bg-slate-700 hover:text-white"
            onClick={() => setShowInputs(true)}
          >
            Lägg till <PlusIcon className="w-4 h-4 place-self-center " />
          </Button>

          {showInputs && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Namn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block border border-gray-300 rounded-md p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Telefonnummer"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block border border-gray-300 rounded-md p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Anläggning"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="block border border-gray-300 rounded-md p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Roll"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block border border-gray-300 rounded-md p-2 mb-2"
              />

              <Button
                className="text-white px-4 py-2 rounded mt-2"
                onClick={addContactPerson}
              >
                Spara
              </Button>
              <Button
                className="text-white px-4 py-2 rounded mt-2 ml-2"
                onClick={() => setShowInputs(false)}
              >
                Avbryt
              </Button>
            </div>
          )}

          <div className="mt-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="text-white px-4 py-2 rounded hover:bg-slate-700 hover:text-white"
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                  >
                    {sortOrder === "asc" ? "A-Ö" : "Ö-A"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sortera på anläggningsnamn</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-5 gap-4 font-bold border-b border-gray-300 pb-2 mt-4">
            <span>Namn</span>
            <span>Telefonnummer</span>
            <span>Anläggning</span>
            <span>Roll</span>
            <span>Åtgärder</span>
          </div>
          {sortedContactPersons.length > 0 ? (
            <ul>
              {sortedContactPersons.map((person: ContactPerson) => (
                <li
                  key={person.id}
                  className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200 items-center"
                >
                  <span>{person.name}</span>
                  <span>{person.phone}</span>
                  <span>{person.facility}</span>
                  <span>{person.role}</span>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className=" w-fit text-white px-2 py-1 rounded hover:bg-slate-700 hover:text-white"
                            onClick={() => startEditing(person)}
                          >
                            <UserPenIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Redigera kontaktperson</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className=" w-fit text-white px-2 py-1 rounded hover:bg-slate-700 hover:text-white">
                            <BellRing />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Skicka notis: Dags att inventera kiosk!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className=" w-fit text-white px-2 py-1 rounded hover:bg-slate-700 hover:text-white"
                            onClick={() => person.id && onDelete(person.id)}
                          >
                            <Trash />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ta bort kontaktperson</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4">Inga kontaktpersoner tillagda ännu.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ContactPersonComponent;
