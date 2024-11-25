import CreateTournamentBtn from "@/components/CreateTournamentBtn"
import TournamentBtn from "@/components/tournamentBtn"


function Home() {
  return (
    <div className="container mx-64">
      <h1 className="font-bold text-5xl mb-24">Välkommen tillbaka</h1>
      <CreateTournamentBtn />
      <p>-------------------------------------------------------------------</p>
      <TournamentBtn />
    </div>
  )
}

export default Home