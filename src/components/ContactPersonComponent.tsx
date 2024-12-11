import { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

type ContactPerson = {
  id: number;
  name: string;
  phone: string;
  facility: string;
};

type Props = {
  contactPersons: ContactPerson[];
  onSave: (name: string, email: string, phone: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

const ContactPersonComponent = ({
  contactPersons,
  onSave,
  onDelete,
}: Props) => {
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [facility, setFacility] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const addContactPerson = async () => {
    if (!name.trim() || !phone.trim() || !facility.trim()) {
      alert("Alla fält måste fyllas i!");
      return;
    }
    await onSave(name, facility, phone);
    setName("");
    setPhone("");
    setFacility("");
    setShowInputs(false);
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
      <Button
        className="mt-4 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowInputs(true)}
      >
        Lägg till <PlusIcon className="w-4 h-4 place-self-center" />
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
        <div className="flex justify-between items-center">
          <div className="font-semibold">Sortera på anläggning:</div>
          <Button
            className="text-white px-4 py-2 rounded"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "A-Ö" : "Ö-A"}
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 font-bold border-b border-gray-300 pb-2 mt-4">
          <span>Namn</span>
          <span>Telefonnummer</span>
          <span>Anläggning</span>
          <span>Åtgärder</span>
        </div>
        {sortedContactPersons.length > 0 ? (
          <ul>
            {sortedContactPersons.map((person: ContactPerson) => (
              <li
                key={person.id}
                className="grid grid-cols-4 gap-4 py-2 border-b border-gray-200"
              >
                <span>{person.name}</span>
                <span>{person.phone}</span>
                <span>{person.facility}</span>
                <Button
                  className=" w-1/2 text-white px-2 py-1 rounded"
                  onClick={() => person.id && onDelete(person.id)}
                >
                  Ta bort
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4">Inga kontaktpersoner tillagda ännu.</p>
        )}
      </div>
    </div>
  );
};

export default ContactPersonComponent;
