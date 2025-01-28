// import CreateProductListButton from "@/components/CreateProductListButton";
// import HandleProductListButton from "@/components/HandleProductListButton";
// import { TrashIcon } from "@radix-ui/react-icons";
// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import{Product, ProductList} from "@/interfaces/index";
// import { useParams } from "react-router-dom";



// function ProductListHandler() {
//   const [productlists, setProductLists] = useState<ProductList[]>([]);
//   const { id } = useParams<{ id: string }>();
//   const tournamentId = id;

//   const { isLoading, error } = useQuery<ProductList[]>({
//     queryKey: ["productslists"],
//     queryFn: async () => {
//       const response = await fetch("http://localhost:3000/productslists");
//       if (!response.ok) {
//         throw new Error("Failed to fetch product lists");
//       }
//       const data = await response.json();
//       console.log(data);
//       setProductLists(data);

//       return data;
//     },
//   });

//   const updateProductList = (updatedList: ProductList) => {
//     setProductLists((prev) =>
//       prev.map((list) => (list.id === updatedList.id ? updatedList : list))
//     );
//   };

//   // Spara ny produktlista (POST)
//   const SaveProductList = async (productListName: string, tournamentId: string) => {
//     try {
//       const response = await fetch("http://localhost:3000/productslists", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           productlistname: productListName,
//           tournamentId: tournamentId,
//           products: [],
//         }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to save product list");
//       }
//       const newProductList = await response.json();
//       setProductLists((prev) => [...prev, newProductList]); // Lägg till ny lista i state
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Ta bort produktlista (DELETE)
//   const DeleteProductsList = async (id: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3000/productslists/${id}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to delete product list");
//       }
//       setProductLists((prev) => prev.filter((list) => list.id !== id)); // Uppdatera state lokalt
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (isLoading) {
//     return <div>Loading productlists...</div>;
//   }

//   if (error) {
//     return <div>Error: {String(error)}</div>;
//   }


//   const productListsByTournament = productlists.filter((productlist) => productlist.tournamentId === tournamentId);

  
//   return (
//     <section>
//       <div className="container mx-auto px-4 flex-row items-center">
//         <h2 className="mt-8 text-2xl pb-2 mb-4">Produktlistor</h2>
//         <CreateProductListButton onSave={(productlistName, tournamentId) =>{
//           SaveProductList(productListName,tournamentId)
//         }}
//         tournamentId={tournamentId ||""} />
//         <div className="mt-8 w-3/4">
//           <h3 className="text-lg">Sparade produktlistor:</h3>
//           <div className="mt-4 gap-3 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {productListsByTournament.map((productlist) => (
//               <HandleProductListButton
//                 key={productlist.id}
//                 productlist={productlist}
//                 onUpdate={updateProductList}
               
//               >
//                 <div
//                   className="relative p-2 rounded-xl border-2 cursor-pointer aspect-video h-40 md:h-full
//                  shadow hover:bg-slate-800 hover:text-white text-black"
//                 >
//                   <div className="flex justify-between">
//                     <p className="text-md flex">
//                       {productlist.productlistname}
//                     </p>
//                     <div
//                       className="hover:text-red-500"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <AlertDialog>
//                       <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <AlertDialogTrigger>
//                             <TrashIcon className="w-8 h-6 hover:text-red-500" />
//                           </AlertDialogTrigger>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Radera produktlista</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
                        
//                         <AlertDialogContent>
//                           <AlertDialogHeader>
//                             <AlertDialogTitle>
//                               Vill du radera listan?
//                             </AlertDialogTitle>
//                             <AlertDialogDescription>
//                               Den här åtgärden kan inte ångras. Listan kommer
//                               att tas bort permanent.
//                             </AlertDialogDescription>
//                           </AlertDialogHeader>
//                           <AlertDialogFooter>
//                             <AlertDialogCancel>Avbryt</AlertDialogCancel>
//                             <AlertDialogAction
//                               onClick={() => DeleteProductsList(productlist.id)}
//                             >
//                               Radera
//                             </AlertDialogAction>
//                           </AlertDialogFooter>
//                         </AlertDialogContent>
//                       </AlertDialog>
//                     </div>
                    
//                   </div>
//                   <p className='absolute bottom-2 left-2 text-sm"  lg:block lg:min-w-36 2xl:ml-auto'>
//                      Antal produkter:{' '}
//                       {Array.isArray(productlist.products) ? productlist.products.length : 0}
//                        </p>
//                 </div>
                
//               </HandleProductListButton>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default ProductListHandler;
