
import { PlusIcon } from "@radix-ui/react-icons";

import React from "react";

function ProductHandler() {
  return (
    <section>
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="font-bold text-4xl my-4">Produkthantering</h2>

    <button className="rounded-xl border bg-card text-card-foreground shadow aspect-video h-32 flex p-3">
      <h3 className="font-extrabold text-left">Lägg till produkt</h3>
      <PlusIcon className="self-end h-20 w-20"></PlusIcon>
      </button>

      </div>
    </section>
  );
}

export default ProductHandler;
