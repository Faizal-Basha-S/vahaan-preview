
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AppDownloadSection = () => {
  return (
    <Card className="w-full mb-8 overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20">
      <div className="p-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/3 mb-4 md:mb-0 flex justify-center">
          <div className="relative w-24 h-24">
            <img
              src="/resource-uploads/a47ef4ec-4126-4237-8391-444437db8ec1.png"
              alt="App Logo"
              className="w-full h-full object-contain"
            />
            <div className="absolute -right-2 -bottom-2 bg-orange-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
              New!
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <h3 className="text-lg font-semibold mb-2 text-center md:text-left">Download Our App</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center md:text-left">
            Faster access. Instant updates. Smooth experience.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex items-center justify-center bg-black hover:bg-gray-800 text-white border-black">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.9,19.2c-0.1,0.1-0.2,0.3-0.3,0.4c-0.7,0.7-1.7,0.8-2.6,0.3c-0.2-0.1-0.4-0.2-0.5-0.3c-0.5-0.3-1.1-0.6-1.6-0.9 c-0.6-0.3-1.2-0.3-1.8,0c-0.5,0.3-1.1,0.6-1.6,0.9C8.9,19.9,8.1,20,7.4,19.8c-0.9-0.3-1.5-1-1.7-2c-0.1-0.5-0.2-1.1-0.2-1.6 c0-3.1,0-6.2,0-9.3c0-0.6,0.1-1.2,0.2-1.7C6,4.2,6.7,3.5,7.8,3.3C8.1,3.2,8.3,3.2,8.6,3.2C8.9,3.1,9.2,3,9.5,3 c0.8,0,1.5,0.2,2.1,0.7c0.6,0.5,1.1,0.5,1.7,0C13.9,3.2,14.6,3,15.4,3c0.3,0,0.5,0,0.8,0.1c1.5,0.2,2.5,1.4,2.5,2.9 c0,3.8,0,7.5,0,11.3C18.8,18.1,18.5,18.7,17.9,19.2z"></path>
              </svg>
              App Store
            </Button>
            <Button variant="outline" className="flex items-center justify-center bg-black hover:bg-gray-800 text-white border-black">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.5,3.7C4.5,4.8,4,6.3,4,8c0,1.7,0.5,3.2,1.5,4.3C6.5,13.4,7.7,14,9.2,14c1.4,0,2.7-0.6,3.8-1.7 C11.6,10.9,10.6,9.2,9.9,7C9.3,5.1,9.2,4,9.2,4C7.7,4,6.4,4.6,5.5,3.7z M9.7,14.8c-0.2,0-0.3,0-0.5,0c0,0-0.1,0-0.1,0 c0,0,0,0,0,0c-0.2,0.1-0.4,0.2-0.5,0.4c-0.6,0.6-0.6,1.4,0,2.1c0.7,0.7,1.4,1.5,2.1,2.2c0.3,0.3,0.7,0.5,1.1,0.5 c0.5,0,0.9-0.2,1.2-0.5c0.7-0.7,1.4-1.5,2.1-2.2c0.6-0.7,0.6-1.4,0-2.1c-0.1-0.1-0.3-0.3-0.5-0.4c0,0-0.1,0-0.1,0c0,0,0,0-0.1,0 c-0.1,0-0.3,0-0.4,0c-0.7,0-1.2,0.9-1.9,0.9C11,15.7,10.5,14.8,9.7,14.8z M4,15.8c-0.3,0-0.5,0.1-0.7,0.3c-0.5,0.4-0.5,1,0,1.4 c1,0.9,2.1,1.9,3.1,2.8c0.4,0.3,0.9,0.4,1.3,0.2c0.5-0.2,0.8-0.8,0.6-1.4c-0.1-0.2-0.2-0.4-0.4-0.5c-1-0.9-2.1-1.9-3.1-2.8 C4.6,15.8,4.3,15.8,4,15.8z M20,15.8c-0.3,0-0.6,0.1-0.8,0.3c-1,0.9-2.1,1.9-3.1,2.8c-0.2,0.2-0.3,0.3-0.4,0.5 c-0.2,0.5,0.1,1.1,0.6,1.4c0.4,0.2,0.9,0.1,1.3-0.2c1-0.9,2.1-1.9,3.1-2.8c0.5-0.4,0.5-1.1,0-1.5C20.5,15.9,20.2,15.8,20,15.8z  M14.9,4c0,0-0.1,1.1-0.7,3c-0.6,2.2-1.7,3.9-3.2,5.3c1,1.1,2.4,1.7,3.8,1.7c1.5,0,2.8-0.6,3.7-1.7c1-1.2,1.5-2.6,1.5-4.3 c0-1.7-0.5-3.2-1.5-4.3C17.6,2.6,16.3,2,14.9,2C14.9,2,14.9,4,14.9,4z"></path>
              </svg>
              Google Play
            </Button>
          </div>
          
          <div className="mt-4 flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs text-center text-gray-500 dark:text-gray-400">QR Code</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppDownloadSection;
