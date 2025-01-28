import { Kiosk } from './kiosk';
import { ContactPerson } from './contactperson';

export interface Facility {
    facilityName: string;
    id: string;
    kiosks: Kiosk[] | [];  
    contactPersons: ContactPerson[] | [];  
}