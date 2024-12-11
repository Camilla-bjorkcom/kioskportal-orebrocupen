import ContactPerson from "@/components/ContactPersonComponent";
import { useQuery } from "@tanstack/react-query";

interface ContactPerson {
    id: number;
    name: string;
    facility: string;
    phone: string;
}

const ContactPersons = () => {
    const { data: contactPerson = [], isLoading, error, refetch } = useQuery<ContactPerson[]>({
        queryKey: ["contactPerson"],
        queryFn: async () => {
            const response = await fetch("http://localhost:3000/contactPersons");
            if (!response.ok) throw new Error("Failed to fetch contactPersons");
            return response.json();
        },
    });

    const SaveContactPerson = async (name: string, facility: string, phone: string) => {
      console.log(name, facility, phone);
        try {
            const response = await fetch("http://localhost:3000/contactPersons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, facility, phone }),
            });
            if (!response.ok) throw new Error("Failed to save contactPerson");
            refetch(); 
        } catch (error) {
            console.error(error);
        }
    };

    const DeleteContactPerson = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/contactPersons/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete contactPerson");
            refetch();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {String(error)}</div>;

    return (
        <div className="container mx-auto">
            <h3 className="mt-8 text-2xl pb-2">Kontaktpersoner</h3>
            <ContactPerson
                contactPersons={contactPerson}
                onSave={SaveContactPerson}
                onDelete={DeleteContactPerson}
            />
        </div>
    );
};

export default ContactPersons;
