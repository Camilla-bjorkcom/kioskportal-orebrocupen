import { useAuth } from "react-oidc-context";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/images/tempLogo.svg";

function Home() {
  const auth = useAuth();

  return (
    <section className="flex flex-col items-center h-full container mx-auto">
      <img
        className="h-20 mb-4 place-self-start"
        src={logo}
        alt="Kiosk Portalen"
      />
      <div className="dark:bg-slate-800 bg-gray-200 p-8 rounded-2xl flex flex-col gap-4 items-center justify-center w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-center text-slate-900 dark:text-gray-200">
          Välkommen tillbaka
        </h1>

        <h2 className="text-2xl font-semibold text-slate-900 dark:text-gray-200">
          Logga in
        </h2>
        <Button
          className="flex items-center justify-center w-full max-w-sm mt-6 rounded-lg border:none text-lg font-medium dark:text-gray-200 dark:bg-slate-700 hover:bg-slate-600 "
          onClick={() => auth.signinRedirect()}
        >
          Fortsätt
          <ChevronRight className="w-5 h-5 ml-3" />
        </Button>
      </div>
    </section>
  );
}

export default Home;
