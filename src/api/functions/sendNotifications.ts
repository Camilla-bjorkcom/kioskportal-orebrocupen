import { NotifyItem } from "@/interfaces/notifyInfoItem";
import fetchWithAuth from "./fetchWithAuth";
import { NoResponseError } from "./apiErrors";

export const sendNotifications = async (notifyContactPerson: NotifyItem[]) => {
  try {
    const response = await fetchWithAuth(`send-sns-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notifications: notifyContactPerson.map((item) => ({
          kioskName: item.kioskName,
          facilityName: item.facilityName,
          contactPersons: item.contactPersons.map((contact) => {
            let phone = contact.phone;

            if (phone.startsWith("00")) {
              phone = phone.replace(/^00/, "+46");
            }

            if (phone.startsWith("+46")) {
              return { name: contact.name, phone };
            }

            return { name: contact.name, phone: `+46${phone}` };
          }),
        })),
      }),
    });

    if (!response) throw new NoResponseError("No response from server");

    return response.json();
  } catch (error) {
    throw new NoResponseError("No response from server");
  }
};
