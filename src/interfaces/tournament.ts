export interface Tournament {
  sk: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  id: string;
  created: string;
}

export interface UpdateTournament {
  tournamentName: string;
  startDate: Date;
  endDate: Date;
}
