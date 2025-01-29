import { useAuth } from "react-oidc-context";
import { ChevronRight } from "lucide-react";

function Home() {
  const auth = useAuth();

  auth.user?.id_token;

  return (
    <section className="container mx-auto gap-5 h-screen w-screen">
      <div className="bg-orange-n p-5 rounded-xl relative w-full">
        <img
          className="h-24 absolute left-2"
          src="src\assets\images\tempLogo.svg"
          alt="Kiosk Portalen"
        ></img>
        <h1 className="text-5xl font-bold py-5 place-self-center text-black">
          Välkommen tillbaka
        </h1>
      </div>
      <div className="flex flex-col place-items-center mt-7">
        <h2 className="font-bold lg:text-3xl pt-5 text-slate-800 dark:text-gray-200">
          Logga in
        </h2>
        <button
          className="flex text-center justify-center items-center border border-solid text-slate-800 hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow w-2/3 lg:w-1/3 dark:bg-slate-900 dark:hover:bg-slate-600 dark:text-gray-200 dark:border-slate-500"
          onClick={() => auth.signinRedirect()}
        >
          Fortsätt
          <ChevronRight className="w-4 h-4 ml-3" />
        </button>
      </div>
    </section>
  );
}

export default Home;
