
import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, Car, Bike, User } from "lucide-react";
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
            isActive("cars") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Car className="h-5 w-5 mb-1" />
          <span className="text-xs">Cars</span>
        </Link>
        
        <Link 
          to="/bikes" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("bike") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Bike className="h-5 w-5 mb-1" />
          <span className="text-xs">Bikes</span>
        </Link>
        
        <Link 
          to="/sell" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("sell") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Search className="h-5 w-5 mb-1" />
          <span className="text-xs">Search</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("profile") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
