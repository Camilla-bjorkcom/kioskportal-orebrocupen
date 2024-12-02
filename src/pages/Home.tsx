import Header from "@/components/header";
import { useAuth } from "react-oidc-context";
import { ChevronRight } from "lucide-react";

function Home() {
  const auth = useAuth();


  return (
    <div>
      <Header />
      <div>
        <h1 className="text-5xl font-bold py-5 text-center text-slate-800">
          Välkommen tillbaka
        </h1>
        <div className="container mx-auto ">
          <h2 className="text-2xl lg:text-3xl pt-5 text-slate-800">Logga in eller skapa ny användare </h2>
          <button
            className="flex text-center justify-center items-center border border-solid text-slate-800 hover:bg-slate-800 hover:text-white rounded-xl p-2 mt-8 shadow w-2/3 lg:w-1/3"
            onClick={() => auth.signinRedirect()}
          >
            Fortsätt 
            
            <ChevronRight className="w-4 h-4 ml-3" />{" "}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;


