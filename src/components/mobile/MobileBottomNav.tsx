
import React from "react";
import { Link } from "react-router-dom";
import { Home, Car, PlusCircle, Bike, Phone } from "lucide-react";
import { useLocation } from "react-router-dom";

const MobileBottomNav = () => {
  const location = useLocation();
  const { pathname } = location;

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.includes(path)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("/") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link 
          to="/used-cars" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("cars") || isActive("used-cars") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Car className="h-5 w-5 mb-1" />
          <span className="text-xs">Cars</span>
        </Link>
        
        <Link 
          to="/sell" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("sell") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <PlusCircle className="h-6 w-6 mb-1 text-orange-500" />
          <span className="text-xs font-medium">Post Ad</span>
        </Link>
        
        <Link 
          to="/bike-buy-section" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("bike") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Bike className="h-5 w-5 mb-1" />
          <span className="text-xs">Bikes</span>
        </Link>
        
        <Link 
          to="/contact" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("contact") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Phone className="h-5 w-5 mb-1" />
          <span className="text-xs">Contact</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
