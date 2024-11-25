import CreateTournamentBtn from "@/components/CreateTournamentBtn"
import TournamentBtn from "@/components/TournamentBtn"



function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-5xl mb-24">Välkommen tillbaka</h1>
      <CreateTournamentBtn />
      <p className="pt-64 font-bold">Avslutade turneringar</p>
    </div>
  )
}

export default Home