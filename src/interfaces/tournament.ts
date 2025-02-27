export interface Tournament {
  sk: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  id: string;
  created: string;
  logoUrl:string;
}

export interface UpdateTournament {
  tournamentName: string;
  startDate: Date;
  endDate: Date;
  logoUrl: string;
}
