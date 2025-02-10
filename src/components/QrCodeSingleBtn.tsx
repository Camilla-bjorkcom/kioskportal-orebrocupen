import { inventoryURL } from "@/api/functions/baseInventoryURL";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface QrCodeSingleBtnProps {
  kioskName: string;
  facility: string;
  inventoryKey: string;
}

const QrCodeSingleBtn: React.FC<QrCodeSingleBtnProps> = ({
  kioskName,
  facility,
  inventoryKey,
}) => {
  const qrUrl = inventoryURL(inventoryKey);

  const handleOpenQRCode = () => {
    const qrWindow = window.open("", "_blank");
    if (qrWindow) {
      qrWindow.document.write(`
                <html>
                    <head>
                        <title>QR Code - ${kioskName}</title>
                    </head>
                    <body style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 90vh; font-family: Arial, sans-serif;">
                        <h2 style="text-align: center; margin-bottom: 3rem;">${kioskName} (${facility})</h2>
                        <div style="display: flex; justify-content: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                            <svg viewBox="0 0 100 100" width="300" height="300">
                                ${ReactDOMServer.renderToString(
                                  <QRCodeSVG value={qrUrl} size={100} />
                                )}
                            </svg>
                        </div>
                        <p style="text-align: center; margin-top: 10px;"><strong>Skanna för att inventera</strong></p>
                    </body>
                </html>
            `);
    }
  };

  return (
    <button
      className="flex  dark:hover:bg-slate-900 hover:bg-slate-200"
      onClick={handleOpenQRCode}
    >
      QR kod <QrCodeIcon className="h-5 w-5 ml-2" />
    </button>
  );
};

export default QrCodeSingleBtn;
