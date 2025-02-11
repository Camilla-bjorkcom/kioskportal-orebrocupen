import { inventoryURL } from "@/api/functions/baseInventoryURL";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { KioskForQr } from "@/interfaces";
import { Button } from "./ui/button";

interface QrCodeAllBtnProps {
  kiosksForQr: KioskForQr[];
}

const QrCodeAllBtn: React.FC<QrCodeAllBtnProps> = ({ kiosksForQr }) => {
  if (!kiosksForQr || kiosksForQr.length === 0) {
    return null; // Om listan är tom, visa inget
  }

  const handleOpenQRCode = () => {
    const qrWindow = window.open("", "_blank");

    if (qrWindow) {
      qrWindow.document.write(`
        <html>
          <head>
            <title>QR Koder</title>
            <style>
              @media print {
           .noprint {
              visibility: hidden;
           }
            </style>
          </head>
          
          <body style="justify-content: center; align-items: center; height: 90vh; margin:0; padding:0; font-family: Poppins, sans-serif; ">

            <button class="noprint" style="position: fixed; top: 10px; right: 10px; padding: 10px; background-color: #333; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="window.print()">Skriv ut</button>
            <div >
              ${kiosksForQr
                .map(
                  (kiosk) => `
                  <div style="text-align:center; width:100vw; height:80vh; display:grid; place-items:center;  page-break-after: always; ">
                    <h2>${kiosk.kioskName} (${kiosk.facility})</h2>
                    <div style="display: flex; justify-content: center; ">
                     
                        ${ReactDOMServer.renderToString(
                          <QRCodeSVG
                            value={inventoryURL(kiosk.inventoryKey)}
                            size={300}
                          />
                        )}
                      
                    </div>
                    <p style="font-size: 16px; color: #555;">Skanna för att inventera</p>
                  </div>`
                )
                .join("")}
            </div>

          </body>
        </html>
      `);
    }
  };

  return (
    <Button
      className="flex items-center px-4 py-2 rounded-lg mr-2 dark:hover:bg-slate-600"
      onClick={handleOpenQRCode}
    >
      Skriv ut alla QR-koder <QrCodeIcon className="h-5 w-5 ml-2" />
    </Button>
  );
};

export default QrCodeAllBtn;
