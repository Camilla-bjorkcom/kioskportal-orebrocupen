import CreateTournamentBtn from "@/components/CreateTournamentBtn"
import Header from "@/components/header";



function CreateTournament() {

  return (
    <>
    <Header />
    
    <div className="container mx-auto ">  
      <h2 className="font-bold text-4xl mb-24">Dina turneringar</h2>
      <CreateTournamentBtn />
      <p className="pt-64 font-bold">Avslutade turneringar</p>     
    </div>
    </>
  )
}

export default CreateTournament;