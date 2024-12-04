import { useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

type ContactPerson = {
  name: string;
  phone: string;
  facility: string;
};

const ContactPersonComponent = () => {
  const [showInputs, setShowInputs] = useState<boolean>(false);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [facility, setFacility] = useState<string>("");


  const addContactPerson = () => {
    if (!name.trim() || !phone.trim() || !facility.trim()) {
      alert("Alla fält måste fyllas i!");
      return;
    }

    const newContact: ContactPerson = { name, phone, facility };
    setContactPersons((prev) => [...prev, newContact]);

    setName("");
    setPhone("");
    setFacility("");
    setShowInputs(false);
  };

  const removeContactPerson = (indexToRemove: number) => {
    setContactPersons((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

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
        <div className="grid grid-cols-4 gap-4 font-bold border-b border-gray-300 pb-2">
          <span>Namn</span>
          <span>Telefonnummer</span>
          <span>Anläggning</span>
          <span>Åtgärder</span>
        </div>
        {contactPersons.length > 0 ? (
          <ul>
            {contactPersons.map((person, index) => (
              <li
                key={index}
                className="grid grid-cols-4 gap-4 py-2 border-b border-gray-200"
              >
                <span>{person.name}</span>
                <span>{person.phone}</span>
                <span>{person.facility}</span>
                <Button
                  className=" w-1/2 text-white px-2 py-1 rounded"
                  onClick={() => removeContactPerson(index)}
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
