import { Facility } from "@/interfaces";
import { KioskInventory } from "@/interfaces/kioskInventory";

export const mapKioskInventoriesToFacility = (
  facility: Facility,
  kioskInventories: KioskInventory[]
): Facility => {
  return {
    ...facility, // Behåller original-fält
    kiosks: kioskInventories.map((inventory) => ({
      id: inventory?.kioskId,
      kioskName: facility?.kiosks.find((k) => k.id === inventory?.kioskId)?.kioskName || "Okänd kiosk",
      products: inventory?.products ?? [], // Säkerställ att produkter alltid är en array
      facilityId: facility?.id ?? "Unknown Facility", // Lägg till facilityId
      facility: facility?.facilityName ?? "Unknown Facility", // Lägg till facility
      inventoryDate: inventory?.inventoryDate ?? "", // Lägg till inventoryDate
      firstInventoryMade: true, // Default till true om okänt
      inventoryKey: inventory?.kioskInventoryId ?? "", // Använd ID eller tom sträng
    })),
  };
};
