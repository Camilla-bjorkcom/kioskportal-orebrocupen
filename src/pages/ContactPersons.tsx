import ContactPerson from "@/components/ContactPerson";

const ContactPersons = () => {
  return (
    <>
      <div className="container mx-auto">
        <h3 className=" mt-8 text-2xl pb-2">
          Kontaktpersoner
        </h3>
        <div>
          <ContactPerson />
        </div>
      </div>
    </>
  );
};

export default ContactPersons;
