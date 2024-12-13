import InventoryStatusList from "@/components/InventoryStatusList";

import { useLocation } from "react-router-dom";

const InventoryStatus = () => {
    const {pathname} = useLocation();
  return (
    <>
  
    <div className="container mx-auto">
        <h2 className="mt-8 text-2xl pb-2 ml-2">Inventeringar</h2>
        <InventoryStatusList />
    </div>
    </>
  )
}

export default InventoryStatus;