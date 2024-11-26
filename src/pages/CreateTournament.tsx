import CreateTournamentBtn from "@/components/CreateTournamentBtn"
import Header from "@/components/header";



function CreateTournament() {

  return (
    <>
    <Header />
    
    <div className="container mx-auto ">  
      <h1 className="font-bold text-5xl mb-24">Dina turneringar</h1>
      <CreateTournamentBtn />
      <p className="pt-64 font-bold">Avslutade turneringar</p>     
    </div>
    </>
  )
}

export default CreateTournament;