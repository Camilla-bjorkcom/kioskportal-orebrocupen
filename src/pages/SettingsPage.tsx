import ChangePassword from "@/components/ChangePassword";
import Topbar from "@/components/Topbar";
import { useAuth } from "react-oidc-context";

const SettingsPage = () => {
  const auth = useAuth();

  return (
    <>
      <Topbar tournamentName={""} />
      <div className="container mx-auto">
        <h2 className="text-2xl pb-5 mt-6">Inställningar</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h3 className="text-lg pb-2 border-b border-b-slate-300 w-3/4">
              Din profil:{" "}
              <span className="dark:text-orange-400 text-orange-600 ml-2">
                {auth.user?.profile["cognito:username"] as string}
              </span>
            </h3>
            <div className="mt-4">
              <ChangePassword />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
