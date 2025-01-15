// import { useState } from "react";
// import {
//   PlusIcon,
//   Trash,
//   UserPenIcon,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "@/hooks/use-toast";
// import { Toaster } from "./ui/toaster";
// import { ContactPerson, Facility } from "@/interfaces";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";


// type Props = {
//   contactPersons: ContactPerson[];
//   onSave: (
//     name: string,
//     facilityName: string,
//     phone: string,
//     role: string
//   ) => Promise<void>;
//   onDelete: (id: string) => Promise<void>;
//   onUpdate: (
//     id: string,
//     name: string,
//     facilityName: string,
//     phone: string,
//     role: string
//   ) => Promise<void>;
// };

// const ContactPersonComponent = ({
//   contactPersons,
//   onSave,
//   onUpdate,
//   onDelete,
// }: Props) => {
//   const [showInputs, setShowInputs] = useState<boolean>(false);
//   const [editingPerson, setEditingPerson] = useState<ContactPerson | null>(
//     null
//   );
//   const [name, setName] = useState<string>("");
//   const [phone, setPhone] = useState<string>("");
//   const [role, setRole] = useState<string>("");
//   const [facilityName, setFacilityName] = useState<string>("");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [facility, setFacility] = useState<Facility[]>([]);
//   const { id } = useParams<{ id: string }>();
//   const tournamentId = id;

//   useQuery<Facility[]>({
//     queryKey: ["facilities"],
//     queryFn: async () => {
//       const response = await fetch("http://localhost:3000/facilities");
//       if (!response.ok) {
//         throw new Error("Failed to fetch facilites");
//       }
//       const data = await response.json();
//       setFacility(data);
//       return data;
//     },
//   });

//   const facilitiesByTournament = facility.filter((facility) => facility.tournamentId === tournamentId);

//   const contactPersonByFacility = facilitiesByTournament.map((facility) => ({
//     ...facility,
//     contactPersons: contactPersons.filter((contactPerson) => contactPerson.facilityName === facility.facilityname),
//   }));

//   const startEditing = (person: ContactPerson) => {
//     setEditingPerson(person);
//     setName(person.name);
//     setPhone(person.phone);
//     setRole(person.role);
//     setFacilityName(person.facilityName);
//   };



//   const addContactPerson = async () => {
//     if (!name.trim() || !phone.trim() || !facilityName.trim()) {
//       toast({
//         className: "bg-red-200 text-black",
//         title: "Fel",
//         description: "Alla fält måste fyllas i!",
//         variant: "destructive",
//         duration: 5000,
//       });
//       return;
//     }

//     await onSave(name, facilityName, phone, role);
//     toast({
//       className: "bg-green-200",
//       title: "Kontaktperson tillagd",
//       description: `${name} är nu tillagd.`,
//       duration: 5000,
//     });
//     setName("");
//     setPhone("");
//     setRole("");
//     setFacilityName("");
//     setShowInputs(false);
//   };

//   const saveChanges = async () => {
//     if (!editingPerson) return;

//     if (!name.trim() || !phone.trim() || !facilityName.trim()) {
//       toast({
//         className: "bg-red-200 text-black",
//         title: "Fel",
//         description: "Alla fält måste fyllas i!",
//         variant: "destructive",
//         duration: 5000,
//       });
//       return;
//     }

//     await onUpdate(editingPerson.id, name, facilityName, phone, role);
//     toast({
//       className: "bg-orange-200",
//       title: "Ändringar sparade",
//       description: `${editingPerson.name} har uppdaterats.`,
//       duration: 5000,
//     });
//     setEditingPerson(null);
//     setName("");
//     setPhone("");
//     setRole("");
//     setFacilityName("");
//   };

//   const cancelEditing = () => {
//     setEditingPerson(null);
//     setName("");
//     setPhone("");
//     setRole("");
//     setFacilityName("");
//   };

//   const sortedContactPersons = [...contactPersons].sort((a, b) => {
//     if (a.facilityName.toLowerCase() < b.facilityName.toLowerCase()) {
//       return sortOrder === "asc" ? -1 : 1;
//     }
//     if (a.facilityName.toLowerCase() > b.facilityName.toLowerCase()) {
//       return sortOrder === "asc" ? 1 : -1;
//     }
//     return 0;
//   });

//   return (
//     <>
//       <Toaster />
//       <div className="container mx-auto md:ml-4 ml-1">
//         {editingPerson ? (
//           <div className="mt-4">
//             <h3>Redigera kontaktperson</h3>
//             <input
//               type="text"
//               placeholder="Namn"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="block border border-gray-300 rounded-md p-2 mb-2"
//             />
//             <input
//               type="text"
//               placeholder="Telefonnummer"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="block border border-gray-300 rounded-md p-2 mb-2"
//             />
//             <input
//               type="text"
//               placeholder="Anläggning"
//               value={facilityName}
//               onChange={(e) => setFacilityName(e.target.value)}
//               className="block border border-gray-300 rounded-md p-2 mb-2"
//             />
//             <Select onValueChange={(value) => setRole(value)}>
//               <SelectTrigger className="w-[213px] mb-4">
//                 <SelectValue placeholder="Välj en roll" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectGroup>
//                   <SelectLabel>Roll</SelectLabel>
//                   <SelectItem value="Huvudansvarig">Huvudansvarig</SelectItem>
//                   <SelectItem value="Planansvarig">Planansvarig</SelectItem>
//                   <SelectItem value="Kiosk">Kiosk</SelectItem>
//                 </SelectGroup>
//               </SelectContent>
//             </Select>

//             <Button
//               className="text-white px-4 py-2 rounded mt-2"
//               onClick={saveChanges}
//             >
//               Spara ändringar
//             </Button>
//             <Button
//               className="text-white px-4 py-2 rounded mt-2 ml-2"
//               onClick={cancelEditing}
//             >
//               Avbryt
//             </Button>
//           </div>
//         ) : (
//           <>
//             <Button
//               className="mt-4 text-white px-4 py-2 rounded mb-4 hover:bg-slate-700 hover:text-white"
//               onClick={() => setShowInputs(true)}
//             >
//               Lägg till <PlusIcon className="w-4 h-4 place-self-center" />
//             </Button>

//             {showInputs && (
//               <div className="mt-4">
//                 <input
//                   type="text"
//                   placeholder="Namn"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="block border border-gray-300 rounded-md p-2 mb-2"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Telefonnummer"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="block border border-gray-300 rounded-md p-2 mb-2"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Anläggning"
//                   value={facilityName}
//                   onChange={(e) => setFacilityName(e.target.value)}
//                   className="block border border-gray-300 rounded-md p-2 mb-2"
//                 />
//                 <Select onValueChange={(value) => setRole(value)}>
//                   <SelectTrigger className="w-[213px] mb-4">
//                     <SelectValue placeholder="Välj en roll" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectLabel>Roll</SelectLabel>
//                       <SelectItem value="Huvudansvarig">
//                         Huvudansvarig
//                       </SelectItem>
//                       <SelectItem value="Planansvarig">Planansvarig</SelectItem>
//                       <SelectItem value="Kiosk">Kiosk</SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>

//                 <Button
//                   className="text-white px-4 py-2 rounded mt-2"
//                   onClick={addContactPerson}
//                 >
//                   Spara
//                 </Button>
//                 <Button
//                   className="text-white px-4 py-2 rounded mt-2 ml-2"
//                   onClick={() => setShowInputs(false)}
//                 >
//                   Avbryt
//                 </Button>
//               </div>
//             )}

//             {/* Grid eller kortlayout baserat på skärmstorlek */}
//             <div className="mt-6 hidden sm:grid grid-cols-5 gap-4 font-bold border-b border-gray-300 pb-2">
//               <span>Namn</span>
//               <span>Telefon</span>
//               <span>Anläggning</span>
//               <span>Roll</span>
//               <span>Åtgärder</span>
//             </div>
//             <div className="mt-4 sm:hidden grid gap-4">
//               {sortedContactPersons.map((person) => (
//                 <div
//                   key={person.id}
//                   className="bg-white border border-gray-200 shadow-md rounded-md p-4"
//                 >
//                   <h4 className="font-bold text-lg mb-2">{person.name}</h4>
//                   <p className="text-gray-600 mb-1">
//                     <strong>Telefon:</strong> {person.phone}
//                   </p>
//                   <p className="text-gray-600 mb-1">
//                     <strong>Anläggning:</strong> {person.facilityName}
//                   </p>
//                   <p className="text-gray-600">
//                     <strong>Roll:</strong> {person.role}
//                   </p>
//                   <div className="flex justify-between mt-4">
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             className="w-fit text-white px-2 py-1 rounded hover:bg-slate-700"
//                             onClick={() => startEditing(person)}
//                           >
//                             <UserPenIcon />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Redigera kontaktperson</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             className="w-fit text-white px-2 py-1 rounded hover:bg-slate-700"
//                             onClick={async () => {
//                               await onDelete(person.id);
//                               toast({
//                                 className: "bg-red-200",
//                                 title: "Kontaktperson borttagen",
//                                 description: `${person.name} är nu borttagen.`,
//                                 duration: 5000,
//                               });
//                             }}
//                           >
//                             <Trash />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Ta bort kontaktperson</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Desktop-layout */}
//             <ul className="hidden sm:block">
//               {sortedContactPersons.map((person: ContactPerson) => (
//                 <li
//                   key={person.id}
//                   className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200 items-center"
//                 >
//                   <span>{person.name}</span>
//                   <span>{person.phone}</span>
//                   <span>{person.facilityName}</span>
//                   <span>{person.role}</span>
//                   <div className="flex gap-2">
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             className="w-fit text-white px-2 py-1 rounded hover:bg-slate-700"
//                             onClick={() => startEditing(person)}
//                           >
//                             <UserPenIcon />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Redigera kontaktperson</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger asChild>
//                           <Button
//                             className="w-fit text-white px-2 py-1 rounded hover:bg-slate-700"
//                             onClick={async () => {
//                               await onDelete(person.id);
//                               toast({
//                                 className: "bg-red-200",
//                                 title: "Kontaktperson borttagen",
//                                 description: `${person.name} är nu borttagen.`,
//                                 duration: 5000,
//                               });
//                             }}
//                           >
//                             <Trash />
//                           </Button>
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>Ta bort kontaktperson</p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default ContactPersonComponent;
