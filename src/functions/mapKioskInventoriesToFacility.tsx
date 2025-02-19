import { Facility } from "@/interfaces";
import { KioskInventory } from "@/interfaces/kioskInventory";

export const mapKioskInventoriesToFacility = (
  facility: Facility,
  kioskInventories: KioskInventory[]
): Facility => {
  return {
    ...facility, 
    kiosks: kioskInventories.map((inventory) => ({
      id: inventory?.kioskId,
      kioskName: facility?.kiosks.find((k) => k.id === inventory?.kioskId)?.kioskName || "Okänd kiosk",
      products: inventory?.products ?? [], 
      facilityId: facility?.id ?? "Unknown Facility", 
      facility: facility?.facilityName ?? "Unknown Facility", 
      inventoryDate: inventory?.inventoryDate ?? "",
      firstInventoryMade: true, 
      inventoryKey: inventory?.kioskInventoryId ?? "",
    })),
  };
};
