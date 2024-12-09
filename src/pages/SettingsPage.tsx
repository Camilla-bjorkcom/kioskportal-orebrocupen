
import { useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import ChangePassword from "@/components/ChangePassword";
import ContactPerson from "@/components/ContactPerson";


const SettingsPage = () => {
  const { pathname } = useLocation();
  const auth = useAuth();
  return (
    <>
     
      <div className="container mx-auto">
        <h2 className="font-bold text-4xl mb-24 pl-5">Inställningar</h2>
        <h3 className=" text-2xl pb-2 border-b border-b-slate-300">
          Din profil
        </h3>
        <div className="flex mt-4">
          <p className="font-semibold mr-2 mb-2">Email:</p>
          <span>{auth.user?.profile.email}</span>
        </div>
        <div>
          <ChangePassword />
        </div>
        <h3 className=" mt-8 text-2xl pb-2 border-b border-b-slate-300">
          Kontaktpersoner
        </h3>
        <div>
          <ContactPerson />
        </div>
      </div>
    </>
  );
};

export default SettingsPage;