import { Button } from "./ui/button";

const DashboardLink = () => {
  return (
    <div className="mt-10 flex flex-col items-center md:items-start ">
      <div className="flex w-1/2 gap-5">
      <Button>Inventera turneringsprodukter</Button>
      <Button>Qr-koder</Button>
        </div>
    </div>
  );
};

export default DashboardLink;
