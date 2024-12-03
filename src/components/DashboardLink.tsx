import { Button } from "./ui/button";

const DashboardLink = () => {
  return (
    <div className="mt-10 flex flex-col items-center md:items-start ">
      <div className="flex w-1/2 gap-5">
      <Button className="w-full p-7">Inventera turneringsprodukter</Button>
      <Button className="w-full p-7">Qr-koder</Button>
        </div>
    </div>
  );
};

export default DashboardLink;
