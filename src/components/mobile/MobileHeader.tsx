
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useAuth } from "@/context/AuthContext";
import AuthButtons from "../auth/AuthButtons";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "../ui/separator";

const MobileHeader = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { currentUser, logout } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState<{
    cars: boolean;
    bikes: boolean;
  }>({
    cars: false,
    bikes: false,
  });

  const toggleDropdown = (dropdown: 'cars' | 'bikes') => {
    setOpenDropdowns({
      ...openDropdowns,
      [dropdown]: !openDropdowns[dropdown],
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo and brand name side-by-side */}
        <Link to="/" className="flex items-center">
          <img 
            src="/resource-uploads/a47ef4ec-4126-4237-8391-444437db8ec1.png" 
            alt="VahaanXchange Logo" 
            className="h-8 w-auto"
          />
          <span className="inline-block bg-gradient-to-r from-orange-600 via-[#552277] to-blue-700 bg-clip-text text-transparent font-bold ml-2 text-sm">VahaanXchange</span>
        </Link>

        {/* Search and Menu */}
        <div className="flex items-center space-x-2">
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
            <SheetContent side="right" className="w-[85vw] max-w-[350px] p-0 pt-6">
              <ScrollArea className="h-full pt-2 pb-16">
                <div className="flex flex-col h-full px-4">
                  <div className="mb-6 flex justify-center">
                    {currentUser ? (
                      <div className="flex items-center space-x-2 py-4">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium">{currentUser.displayName || "User"}</p>
                          <p className="text-xs text-gray-500">{currentUser.phoneNumber}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full py-4">
                        <AuthButtons className="w-full justify-center" />
                      </div>
                    )}
                  </div>

                  <nav className="space-y-1">
                    <Link to="/" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      Home
                    </Link>
                    
                    {/* Cars Dropdown */}
                    <Collapsible
                      open={openDropdowns.cars}
                      onOpenChange={() => toggleDropdown('cars')}
                      className="w-full"
                    >
                      <CollapsibleTrigger asChild>
                        <button className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-left">
                          <span>Cars</span>
                          {openDropdowns.cars ? (
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-2 animate-accordion-down">
                        <Link to="/used-cars" className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                          Buy Car
                        </Link>
                        <Link to="/sell?mode=car" className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                          Sell Car
                        </Link>
                      </CollapsibleContent>
                    </Collapsible>
                    
                    {/* Bikes Dropdown */}
                    <Collapsible
                      open={openDropdowns.bikes}
                      onOpenChange={() => toggleDropdown('bikes')}
                      className="w-full"
                    >
                      <CollapsibleTrigger asChild>
                        <button className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-left">
                          <span>Bikes</span>
                          {openDropdowns.bikes ? (
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 space-y-2 animate-accordion-down">
                        <Link to="/bike-buy-section" className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                          Buy Bike
                        </Link>
                        <Link to="/sell?mode=bike" className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                          Sell Bike
                        </Link>
                      </CollapsibleContent>
                    </Collapsible>

                    <Separator className="my-2" />

                    <Link to="/favourites" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      Favourites
                    </Link>
                    <Link to="/appointments" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      My Appointments
                    </Link>
                    <Link to="/bookings" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      My Bookings
                    </Link>
                    <Link to="/partner" className="block px-2 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                      Become a Partner
                    </Link>
                  </nav>

                  {currentUser && (
                    <div className="mt-auto pt-4 pb-6">
                      <Button
                        variant="destructive"
                        className="w-full flex items-center justify-center"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
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
