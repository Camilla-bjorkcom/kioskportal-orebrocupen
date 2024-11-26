import CreateTournamentBtn from "@/components/CreateTournamentBtn"
import PagesHeader from "@/components/PagesHeader";
import { useLocation } from "react-router-dom";


function CreateTournament() {
  const {pathname} = useLocation();
  return (
    <>
    <PagesHeader pathname={pathname} />
    
    <div className="container mx-auto ">  
      <h1 className="font-bold text-5xl mb-24">Skapa dina turneringar</h1>
      <CreateTournamentBtn />
      <p className="pt-64 font-bold">Avslutade turneringar</p>     
    </div>
    </>
  )
}

export default CreateTournament;