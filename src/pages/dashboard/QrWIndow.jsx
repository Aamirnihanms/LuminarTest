import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { XMarkIcon } from '@heroicons/react/24/solid';

const QrDisplayPage = ({ name, id, onClose }) => {
  const [qrData, setQrData] = useState({});
  // const [countdown, setCountdown] = useState(7);

  const generateQrData = () => {
    const startTime = new Date(Date.now());
    const endTime = new Date(startTime.getTime() + 10 * 1000);

    const data = {
      batchId: id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      timestamp: Date.now()
    };

    setQrData(data);
    // setCountdown(7);
  };

  useEffect(() => {
    generateQrData();

    const interval = setInterval(() => {
      generateQrData();
    }, 7000);

    // const countdownInterval = setInterval(() => {
    //   setCountdown(prev => (prev > 0 ? prev - 1 : 7));
    // }, 1000);

    // return () => {
    //   clearInterval(interval);
    //   clearInterval(countdownInterval);
    // };
  }, [id]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <div className="bg-purple-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Luminar Attendance Manager</h1>
        <div className="flex items-center gap-4">
          <button 
            className="text-white hover:text-purple-200 transition-colors "
            onClick={onClose}
            aria-label="Close"
          >
            <XMarkIcon  className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* QR Code Display - Full Screen */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-purple-900 mb-6">{name}</h2>
          
          <div className="relative">
            <QRCodeCanvas
              value={Object.keys(qrData).length > 0 ? JSON.stringify(qrData) : "Generating..."}
              size={Math.min(window.innerWidth * 0.8, 500)}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={true}
            />
            
            {/* QR Code refresh indicator */}
            {/* <div className="absolute top-2 right-2 bg-purple-900 text-white rounded-full w-8 h-8 flex items-center justify-center">
              {countdown}
            </div> */}
          </div>
          
          <p className="mt-6 text-gray-600">
            Scan the QR code to mark your attendance
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Code refreshes automatically every 7 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default QrDisplayPage;