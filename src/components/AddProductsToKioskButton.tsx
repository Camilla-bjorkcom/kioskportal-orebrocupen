import { updateKiosk } from "@/api/functions/updateKiosk";
import { Kiosk } from "@/interfaces/kiosk";
import { Product } from "@/interfaces/product";
import { Productlist } from "@/interfaces/productlist";
import { badToast, okToast } from "@/utils/toasts";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddProductsToKioskButtonProps {
  kioskForEdit: Kiosk;
  productlists: Productlist[];
  products: Product[];
  onKioskUpdated: (updatedkiosk: Kiosk) => void;
  onEditClick: (kiosk: Kiosk) => void;
}

function AddProductsToKioskButton({
  kioskForEdit,
  productlists,
  products,
}: AddProductsToKioskButtonProps) {
  const tournamentId = useParams().id as string;
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [selectedProductListId, setSelectedProductListId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(
    kioskForEdit.products
  );

  const handleProductListChange = (value: string) => {
    const selectedList = productlists.find((list) => list.id === value);
    if (selectedList) {
      setSelectedProductListId(value);
      setSelectedProducts(selectedList.products);
    } else {
      setSelectedProductListId("");
      setSelectedProducts([]);
    }
  };

  const toggleSelectAll = () => {
    if (
      products.every((product) =>
        selectedProducts.some((p) => p.id === product.id)
      )
    ) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products);
    }
  };

  const allSelected =
    products.length > 0 &&
    products.every((product) =>
      selectedProducts.some((p) => p.id === product.id)
    );

  const addProductsToKiosk = async (kioskForEdit: Kiosk) => {
    try {
      await updateKiosk({
        tournamentId: tournamentId!,
        facilityId: kioskForEdit.facilityId,
        kioskId: kioskForEdit.id,
        products: selectedProducts,
      });
      queryClient.invalidateQueries({ queryKey: ["facilities"] });

      okToast(`Produkterna har sparats i kiosken!`);

      setOpen(false);
    } catch (error) {
      console.error("Failed to update kiosk:", error);
      badToast(`Kunde inte spara produkterna till kiosken`);
    }
  };

  const handleReset = () => {
    setSelectedProducts(kioskForEdit.products);
  };

  if (!kioskForEdit || !productlists || !products) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          variant="ghost"
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          {kioskForEdit.products.length > 0
            ? "Redigera produkter"
            : "Lägg till produkter"}
          <PlusIcon className="w-4 h-4 place-self-center" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl">
        <DialogTitle className="text-lg">
          Vald kiosk:{" "}
          {kioskForEdit ? kioskForEdit.kioskName : "Ingen kiosk vald"}
        </DialogTitle>
        <Select
          value={selectedProductListId}
          onValueChange={handleProductListChange}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Lägg till produkter från produktlista" />
          </SelectTrigger>
          {productlists.length > 0 ? (
            <SelectContent>
              {productlists.map((productlists) => (
                <SelectItem key={productlists.id} value={productlists.id}>
                  {productlists.productlistName}
                </SelectItem>
              ))}
            </SelectContent>
          ) : (
            <SelectContent>
              <SelectItem value="empty">
                Inga produktlistor är skapade i turneringen
              </SelectItem>
            </SelectContent>
          )}
        </Select>
        {products.length > 0 ? (
          <>
            <div className="mb-4 space-x-2 text-right">
              <Button type="button" onClick={toggleSelectAll}>
                {allSelected ? "Avmarkera alla" : "Markera alla"}
              </Button>
              <Button onClick={handleReset}>Återställ</Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {products
                .slice()
                .sort((a, b) => a.productName.localeCompare(b.productName))
                .map((product) => (
                  <div key={product.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={selectedProducts.some(
                        (p) => p.id === product.id
                      )}
                      onCheckedChange={(checked) =>
                        setSelectedProducts((prev) =>
                          checked
                            ? [...prev, product]
                            : prev.filter((p) => p.id !== product.id)
                        )
                      }
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className="font-medium hover:text-slate-800 dark:hover:text-gray-300 cursor-pointer"
                    >
                      {product.productName}
                    </label>
                  </div>
                ))}
            </div>
            {selectedProducts.length > 0 ? (
              <Button
                type="submit"
                onClick={() => addProductsToKiosk(kioskForEdit)}
              >
                Spara valda produkter till valda kiosker
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={() => addProductsToKiosk(kioskForEdit)}
                disabled
              >
                Spara valda produkter till valda kiosker
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-5">
            <p>Inga produkter är skapade i turneringen</p>
            <Button type="button">
              <Link
                to={`/producthandler/${tournamentId}`}
                className="flex items-center gap-4"
              >
                Produkthanterare <ArrowRight />
              </Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddProductsToKioskButton;
