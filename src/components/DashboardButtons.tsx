import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";

const DashboardButtons = () => {
  const {id} = useParams();
 
  return (
    <div className="mt-10 flex w-1/2 flex-col items-center md:items-start ">
      <Button className="w-3/4 p-10 mb-5">
        <Link to={`/inventorystorage/${id}`}>Inventera turneringsprodukter</Link>
      </Button>
      <Button className="w-3/4 p-10">
        <Link to={`/qr/${id}`}>Qr-koder</Link>
      </Button>
    </div>
  );
};

export default DashboardButtons;
