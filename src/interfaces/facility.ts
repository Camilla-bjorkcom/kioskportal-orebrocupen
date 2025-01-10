import { Kiosk } from './kiosk';
import { ContactPerson } from './contactperson';

export interface Facility {
    facilityname: string;
    id : string;
    tournamentId :string;
    kiosks: Kiosk[];
    contactPersons: ContactPerson[];
}