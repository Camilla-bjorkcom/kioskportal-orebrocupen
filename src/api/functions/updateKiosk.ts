import fetchWithAuth from "./fetchWithAuth";
import { NoResponseError } from "./apiErrors";
import { Product } from "@/interfaces/product";

export interface UpdateKioskProps {
  tournamentId: string;
  facilityId: string;
  kioskId: string;
  kioskName?: string;
  products?: Product[];
}

export const updateKiosk = async (updateKioskProps: UpdateKioskProps) => {
  if (!updateKioskProps.kioskName && !updateKioskProps.products) {
    throw new Error("Missing kioskName or products");
  }

  let body: any = {};
  if (updateKioskProps.kioskName) {
    body.kioskName = updateKioskProps.kioskName;
  }

  if (updateKioskProps.products) {
    body.products = updateKioskProps.products;
  }
  console.log("updateKioskProps:", updateKioskProps);
  console.log("Request body:", JSON.stringify(body));

  const response = await fetchWithAuth(
    `facilities/${updateKioskProps.tournamentId}/${updateKioskProps.facilityId}/kiosks/${updateKioskProps.kioskId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!response) throw new NoResponseError("No response from server");

  return response.json();
};
