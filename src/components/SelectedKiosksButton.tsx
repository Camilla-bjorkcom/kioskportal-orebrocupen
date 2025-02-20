import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Kiosk, Product, Productlist } from "@/interfaces";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useParams } from "react-router-dom";
import { okToast } from "@/utils/toasts";
import { updateKiosk } from "@/api/functions/updateKiosk";

interface SelectedKiosksButtonProps {
  selectedKiosks: Kiosk[]; 
  productlists: Productlist[]; 
  products: Product[]; 
  onClick: (open: boolean) => void;
  onKiosksUpdated: (updatedKiosks: Kiosk[]) => void;
  onClearSelected: () => void;
}

function SelectedKiosksButton({
  selectedKiosks,
  productlists,
  products,
  onKiosksUpdated,
  onClearSelected,
}: SelectedKiosksButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductListId, setSelectedProductListId] =
    useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;
  const queryClient = useQueryClient();

  const handleDialogOpenChange = async (isOpen: boolean) => {
    if (isOpen && selectedKiosks.length === 0) {
      alert("Du måste välja minst en kiosk!");
      return;
    }
    setOpen(isOpen);
    setSelectedProducts([]);
  };

  const handleProductListChange = (value: string) => {
    setSelectedProductListId(value);
    const selectedList = productlists.find((list) => list.id === value);

    if (selectedList) {
      setSelectedProducts(selectedList.products);
    } else {
      setSelectedProducts([]);
    }
  };

  const allSelected =
    products.length > 0 &&
    products.every((product) =>
      selectedProducts.some((p) => p.id === product.id)
    );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products);
    }
  };

  const saveProductsToKiosks = async () => {
    if (selectedProducts.length === 0) {
      alert("Du måste välja minst en produkt!");
      return;
    }
    const updatedKioskList = [];

    for (const kiosk of selectedKiosks) {
      const updatedKiosk = await updateKiosk({ tournamentId: tournamentId!, facilityId: kiosk.facilityId, kioskId: kiosk.id, products: selectedProducts });
      console.log(updatedKiosk);

      updatedKioskList.push(updatedKiosk);
      onKiosksUpdated(updatedKioskList);
      onClearSelected();
      setOpen(false);
    }
    queryClient.invalidateQueries({ queryKey: ["facilities"] });
    okToast(
      `Valda kiosker populerades med ${selectedProducts.length} produkter`
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="" disabled={selectedKiosks.length === 0}>
          Valda kiosker att lägga till produkter i (
          {selectedKiosks.length > 0 ? selectedKiosks.length : ""})
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle className="text-lg">Valda kiosker:</DialogTitle>
          <ul className="mt-4 list-disc list-inside">
            {selectedKiosks.map((kiosk) => (
              <li key={kiosk.id}>{kiosk.kioskName}</li>
            ))}
          </ul>
        </DialogHeader>

        <Select
          value={selectedProductListId}
          onValueChange={handleProductListChange}
        >
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Lägg till produkter från produktlista" />
          </SelectTrigger>
          {productlists.length > 0 ? (
            <SelectContent>
              {productlists.map((productlist) => (
                <SelectItem key={productlist.id} value={productlist.id}>
                  {productlist.productlistName}
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

        <div className="mb-4 text-right">
          <Button type="button" onClick={toggleSelectAll}>
            {allSelected ? "Avmarkera alla" : "Markera alla"}
          </Button>
        </div>

      
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-2">
              <Checkbox
                id={`product-${product.id}`}
                checked={selectedProducts.some((p) => p.id === product.id)}
                onCheckedChange={(checked) => {
                  setSelectedProducts((prev) =>
                    checked
                      ? [...prev, product]
                      : prev.filter((p) => p.id !== product.id)
                  );
                }}
              />
              <label
                htmlFor={`product-${product.id}`}
                className="font-medium cursor-pointer"
              >
                {product.productName}
              </label>
            </div>
          ))}
        </div>
        <Button type="submit" onClick={saveProductsToKiosks}>
          Spara valda produkter till valda kiosker
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default SelectedKiosksButton;
