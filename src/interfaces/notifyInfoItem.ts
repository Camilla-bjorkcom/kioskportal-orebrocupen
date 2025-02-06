import { ContactPerson } from "./contactperson";

  export type NotifyItem = {
    kioskId: string;
    facilityName: string;
    kioskName: string;
    contactPersons: ContactPerson[];
  };