import fetchWithAuth from "@/api/functions/fetchWithAuth";
import { toast } from "@/hooks/use-toast";
import { Kiosk } from "@/interfaces/kiosk";
import { Product } from "@/interfaces/product";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { PlusIcon } from "lucide-react";
import { Toaster } from "./ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Productlist } from "@/interfaces/productlist";

interface AddProductsToKioskButtonProps {
  kioskForEdit: Kiosk;
  productLists: Productlist[];
  products: Product[];
  onKioskUpdated: (updatedkiosk: Kiosk) => void;
  onEditClick: (kiosk: Kiosk) => void;
}

function AddProductsToKioskButton({
  kioskForEdit,
  productLists,
  products,
  onKioskUpdated,
  onEditClick,
}: AddProductsToKioskButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedProductListId, setSelectedProductListId] =
    useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const { id } = useParams<{ id: string }>();
  const tournamentId = id;
  const queryClient = useQueryClient();

  // Synkronisera selectedProducts med kioskForEdit.products
  useEffect(() => {
    if (kioskForEdit && kioskForEdit.products) {
      setSelectedProducts(kioskForEdit.products);
    }
  }, [kioskForEdit]);

  const handleDialogOpen = async (isOpen: boolean) => {
    if (isOpen) {
      // Sätt initiala produkter
      await onEditClick(kioskForEdit); // Ladda kiosken
      console.log("HELA", kioskForEdit);
      console.log(kioskForEdit.products);

      setSelectedProducts(kioskForEdit.products);
      console.log(selectedProducts);
      setOpen(true);
    } else {
      setOpen(false);
      setSelectedProductListId("");
      setSelectedProducts([]);
    }
  };

  const handleProductListChange = (value: string) => {
    const selectedList = productLists.find((list) => list.id === value);
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
      setSelectedProducts([]); // Avmarkera alla
    } else {
      setSelectedProducts(products); // Markera alla
    }
  };

  const allSelected =
    products.length > 0 &&
    products.every((product) =>
      selectedProducts.some((p) => p.id === product.id)
    );

  const editKiosk = async (kioskForEdit: Kiosk) => {
    try {
      const response = await fetchWithAuth(
        `facilities/${tournamentId}/${kioskForEdit.facilityId}/kiosks/${kioskForEdit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products: selectedProducts,
          }),
        }
      );

      if (!response) {
        throw new Error("Failed to update kiosk");
      }
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
      const updatedKiosk = await response.json();
      toast({
        className: "bg-green-200 dark:bg-green-400 dark:text-black",
        title: "Lyckat",
        description: `Produkterna har sparats i kiosken!`,
      });

      onKioskUpdated(updatedKiosk); // Skicka tillbaka uppdaterad kiosk
      setOpen(false); // Stäng dialogen
    } catch (error) {
      console.error("Failed to update kiosk:", error);
      toast({
        className: "bg-red-200 dark:bg-red-400 dark:text-black",
        title: "Misslyckat",
        description: `Kunde inte spara produkterna till kiosken`,
      });
    }
  };

  if (!kioskForEdit || !productLists || !products) {
    return null; // Rendera inte om data saknas
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpen}>
      <Toaster />
      <DialogTrigger>
        <Button
          variant="ghost"
          className="m-3  ml-0 flex w-fit gap-2 cursor-pointer font-semibold xl:ml-auto"
          onClick={(e) => {
            e.stopPropagation(); // Stoppa eventbubbling
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
          {productLists.length > 0 ? (
            <SelectContent>
              {productLists.map((productList) => (
                <SelectItem key={productList.id} value={productList.id}>
                  {productList.productlistName}
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
            <div className="mb-4 text-right">
              <Button type="button" onClick={toggleSelectAll}>
                {allSelected ? "Avmarkera alla" : "Markera alla"}
              </Button>
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
                      className="font-medium cursor-pointer"
                    >
                      {product.productName}
                    </label>
                  </div>
                ))}
            </div>
            {selectedProducts.length > 0 ? (
              <Button type="submit" onClick={() => editKiosk(kioskForEdit)}>
                Spara valda produkter till valda kiosker
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={() => editKiosk(kioskForEdit)}
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
                Produkthanterare
              </Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddProductsToKioskButton;
