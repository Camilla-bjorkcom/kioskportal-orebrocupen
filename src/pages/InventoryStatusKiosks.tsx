import InventoryStatusListKiosks from "@/components/InventoryStatusListKiosks";
import ScrolltoTopBtn from "@/components/ScrollToTopBtn";

const InventoryStatusKiosks = () => {
  return (
    <>
    <div className="container mx-auto">
      <ScrolltoTopBtn />
        <h2 className="mt-8 text-2xl pb-2 ml-2 dark:text-gray-200">Kioskernas inventeringar</h2>
        <InventoryStatusListKiosks />
    </div>
    </>
  )
}

export default InventoryStatusKiosks;