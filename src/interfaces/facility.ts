import { Kiosk } from './kiosk';

export interface Facility {
    facilityname: string;
    id : string;
    tournamentId :string;
    kiosks: Kiosk[];
}