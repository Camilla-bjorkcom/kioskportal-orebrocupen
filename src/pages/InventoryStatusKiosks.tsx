import InventoryStatusList from "@/components/InventoryStatusList";
import ScrolltoTopBtn from "@/components/ScrollToTopBtn";

const InventoryStatusKiosks = () => {
  return (
    <>
    <div className="container mx-auto">
      <ScrolltoTopBtn />
        <h2 className="mt-8 text-2xl pb-2 ml-2">Kioskernas inventeringar</h2>
        <InventoryStatusList />
    </div>
    </>
  )
}

export default InventoryStatusKiosks;