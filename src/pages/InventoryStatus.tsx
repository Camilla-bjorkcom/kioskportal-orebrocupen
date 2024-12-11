import InventoryStatusList from "@/components/InventoryStatusList";

import { useLocation } from "react-router-dom";

const InventoryStatus = () => {
    const {pathname} = useLocation();
  return (
    <>
  
    <div className="container mx-auto">
        <h2 className="font-bold text-4xl mb-24 pl-5">Inventeringar</h2>
        <InventoryStatusList />
    </div>
    </>
  )
}

export default InventoryStatus;