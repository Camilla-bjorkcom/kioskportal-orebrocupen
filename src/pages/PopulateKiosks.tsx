import SelectedKiosksButton from '@/components/SelectedKiosksButton';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Kiosk } from '@/interfaces';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';



function PopulateKiosks() {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  
  const [kiosksForUpdate, setKiosksforUpdate] = useState<Kiosk[]>([]);

  // Fetch Kiosks
  useQuery<Kiosk[]>({
    queryKey: ['kiosks'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/kiosks');
      if (!response.ok) throw new Error('Failed to fetch kiosks');
      const data = await response.json();
      setKiosks(data);
      return data;
    },
  });

  

  const handleSubmit = () => {
    if (kiosksForUpdate.length === 0) {
      alert('Du måste välja minst en kiosk!');
      return;
    }
    console.log('Valda kiosker:', kiosksForUpdate);
    // Här kan du öppna en dialog eller skicka datan till en API-endpoint
    alert(`Du har valt ${kiosksForUpdate.length} kiosker.`);
  };

  return (
    <section>
      <div className="container mx-auto px-4 flex-row items-center">
        <h2 className="mt-8 text-2xl pb-2 mb-4">Lägg till produktutbud i kiosker</h2>
        <div className="mt-8">
          <h3 className="text-lg">Skapade kiosker</h3>
          <div className="flex justify-between w-3/4">
            <h5 className="text-base">Välj kiosker att lägga till produkter till:</h5>
            <SelectedKiosksButton selectedKiosks={kiosksForUpdate}
                                 onClick={handleSubmit}/>
          </div>

          <div className="mt-4 space-y-2 mb-10">
            {kiosks.map((kiosk) => (
              <div
                key={kiosk.id}
                className="p-4 border border-gray-200 rounded-md shadow w-3/4 hover:bg-gray-50"
              >
                <div className="flex flex-row justify-between">
                  <label
                    htmlFor={`kiosk-${kiosk.id}`}
                    className="basis-1/4 font-medium hover:text-slate-800 cursor-pointer"
                  >
                    {kiosk.kioskName}
                  </label>
                  <Checkbox
                    id={`kiosk-${kiosk.id}`}
                    checked={kiosksForUpdate.some((k) => k.id === kiosk.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        // Lägg till kiosk i listan
                        setKiosksforUpdate((prev) => [...prev, kiosk]);
                      } else {
                        // Ta bort kiosk från listan
                        setKiosksforUpdate((prev) => prev.filter((k) => k.id !== kiosk.id));
                      }
                    }}
                  />
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PopulateKiosks;
