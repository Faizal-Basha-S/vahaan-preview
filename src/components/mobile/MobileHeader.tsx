
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useAuth } from "@/context/AuthContext";
import AuthButtons from "../auth/AuthButtons";

const MobileHeader = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { currentUser } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/resource-uploads/a47ef4ec-4126-4237-8391-444437db8ec1.png" 
            alt="VahaanXchange Logo" 
            className="h-8 w-auto"
          />
        </Link>

        {/* Search and Menu */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsSearchVisible(!isSearchVisible)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px] pt-10">
              <div className="flex flex-col h-full">
                <div className="mb-8 flex justify-center">
                  {currentUser ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">{currentUser.displayName || "User"}</p>
                        <p className="text-xs text-gray-500">{currentUser.phoneNumber}</p>
                      </div>
                    </div>
                  ) : (
                    <AuthButtons className="w-full" />
                  )}
                </div>

                <nav className="space-y-4">
                  <Link to="/" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Home
                  </Link>
                  <Link to="/used-cars" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Buy Cars
                  </Link>
                  <Link to="/bikes" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Buy Bikes 
                  </Link>
                  <Link to="/sell?mode=car" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Sell Car
                  </Link>
                  <Link to="/sell?mode=bike" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Sell Bike
                  </Link>
                </nav>

                <div className="mt-auto">
                  <Link to="/contact" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    Contact Us
                  </Link>
                  <Link to="/about" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                    About Us
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchVisible && (
        <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search cars, bikes..." 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsSearchVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
