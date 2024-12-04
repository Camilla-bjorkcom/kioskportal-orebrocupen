import CreateTournamentBtn from "@/components/CreateTournamentBtn";
import Header from "@/components/header";
import { useState } from "react";

function CreateTournament() {
  const [tournaments, setTournaments] = useState<
    { tournamentName: string; startDate: Date; endDate: Date }[]
  >([]);

  const datetime = new Date().toLocaleDateString();

  const handleSaveTournament = (data: {
    tournamentName: string;
    startDate: Date;
    endDate: Date;
  }) => {
    setTournaments((prev) => [...prev, data]);
  };

  return (
    <>
      <Header />

      <div className="container mx-auto ">
        <h2 className="font-bold text-4xl mb-24">Dina turneringar</h2>
        <CreateTournamentBtn onSave={handleSaveTournament} />
        <div className="mt-8">
          <h3 className="font-bold">Skapade turneringar</h3>
          <div className="mt-4 flex flex-wrap gap-4">
            {tournaments.map((tournament, index) => (
              <button
                key={index}
                className="flex flex-col p-2 justify-between rounded-xl border bg-card text-card-foreground shadow hover:bg-slate-800 hover:text-white text-black aspect-video h-32 relative"
              >
                <p className="font-bold">{tournament.tournamentName}</p>
                <p className="text-xs font-bold absolute bottom-2 right-2">
                  Skapad: {datetime}
                </p>
              </button>
            ))}
          </div>
        </div>
        <p className="pt-64 font-bold">Avslutade turneringar</p>
      </div>
    </>
  );
}

export default CreateTournament;
