import ContactPersonComponent from "@/components/ContactPersonComponent";
import { useQuery } from "@tanstack/react-query";
import { ContactPerson } from "@/interfaces";


const ContactPersons = () => {
  
  const {
    data: contactPerson = [],
    isLoading,
    error,
    refetch,
  } = useQuery<ContactPerson[]>({
    queryKey: ["contactPerson"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/contactPersons");
      if (!response.ok) throw new Error("Failed to fetch contactPersons");
      return response.json();
    },
  });

  const SaveContactPerson = async (
    name: string,
    facilityName: string,
    phone: string,
    role: string
  ) => {
    console.log(name, facilityName, phone);
    try {
      const response = await fetch("http://localhost:3000/contactPersons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, facilityName, phone, role }),
      });
      if (!response.ok) throw new Error("Failed to save contactPerson");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const UpdateContactPerson = async (
    id: string,
    name: string,
    facilityName: string,
    phone: string,
    role: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/contactPersons/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, facilityName, phone, role }),
        }
      );
      if (!response.ok) throw new Error("Failed to update contactPerson");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const DeleteContactPerson = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/contactPersons/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete contactPerson");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  const validContactPersons = contactPerson.filter(
    (person) => person.name && person.facilityName && person.phone && person.role
  );

  if (validContactPersons.length === 0) {
    return <div>Inga kontaktpersoner hittades.</div>;
  }

  return (
    <div className="container mx-auto">
      <h3 className="mt-8 text-2xl pb-2 md:ml-4 ml-1">Kontaktpersoner</h3>
      <ContactPersonComponent
        contactPersons={validContactPersons}
        onSave={SaveContactPerson}
        onDelete={DeleteContactPerson}
        onUpdate={UpdateContactPerson}
      />
    </div>
  );
};

export default ContactPersons;
