import { useQuery } from "@tanstack/react-query";

type KioskInventory = {
  id: number;
  products: Products[];
};

interface Products {
  id: number;
  productName: string;
  amountPackages: number;
}
const InventoryStatusStorage = () => {
  const id = "3395";
  const inventoryDate = "2025-06-13 14:25";

  const { data, isLoading, error } = useQuery<Products[]>({
    queryKey: ["inventoryList"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/inventoryList/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data: KioskInventory = await response.json();
      return data.products;
    },
  });

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {String(error)}</div>;
  }
  <h3 className="lg:text-lg font-semibold">{inventoryDate}</h3>;
  return (
    <div className="container mx-auto ">
      <h2 className="mt-8 text-2xl pb-2 ml-2">Lagrets inventering</h2>
      <div className="lg:w-3/4 mt-5 gap-3 ml-2">
        <p className="font-semibold">
          Senast inventering gjord: {inventoryDate}
        </p>
      </div>
      <div className="lg:w-3/4 w-full ml-2">
        <div className="w-full border-t border-gray-300 mt-2">
          <div className="grid grid-cols-3 gap-4 font-bold text-gray-600 py-2 px-4">
            <p>Namn</p>
            <p>Obrutna förpackningar</p>
            <p>Totalt antal</p>
          </div>
          {data?.map((item, index) => (
            <div
              key={index}
              className={`px-4 grid grid-cols-3 gap-4 py-2 text-gray-700 border-b border-gray-200 ${
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              }`}
            >
              <p>{item.productName}</p>
              <p>{item.amountPackages}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryStatusStorage;
