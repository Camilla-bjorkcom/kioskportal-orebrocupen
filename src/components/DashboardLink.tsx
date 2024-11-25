import { CopyIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";

const DashboardLink = () => {
  return (
    <div className="mt-10 flex flex-col items-center md:items-start ">
      <div className="flex w-1/2 justify-between ">
        <h3 className="font-bold text-xl mt-10 mb-4">
          Länk till kioskapplikation
        </h3>
        <CopyIcon className="w-8 h-8 place-self-center" />
      </div>

      <Input className="md:w-1/2 w-3/4" />
    </div>
  );
};

export default DashboardLink;
