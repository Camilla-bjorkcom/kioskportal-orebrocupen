import { Button } from "./ui/button";


const DashboardLink = () => {
  return (
    <div className="mt-10 flex w-1/2 flex-col items-center md:items-start ">
      <Button className="w-3/4 p-10 mb-5">Inventera turneringsprodukter</Button>
      <Button className="w-3/4 p-10">Qr-koder</Button>
    </div>
  );
};

export default DashboardLink;
