
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Calendar, Star, Car, MessageSquare, Bell, FileText, CircleDollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import PhoneAuthModal from "./PhoneAuthModal";

interface AuthButtonsProps {
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ className }) => {
  const { currentUser, userProfile, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleShowAuthModal = () => {
    setShowAuthModal(true);
    // Hide the dropdown after triggering the modal
    setShowDropdown(false);
  };
  
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    // Set timeout to hide dropdown after 1 second
    hoverTimeoutRef.current = window.setTimeout(() => {
      setShowDropdown(false);
    }, 250);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current !== null) {
        window.clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (currentUser && userProfile) {
    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={userProfile.photoURL || undefined} 
                  alt={userProfile.displayName || "User"}
                />
                <AvatarFallback>
                  {userProfile.displayName
                    ? userProfile.displayName.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">Profile</Link>
              <Link to="/profile" className="cursor-pointer">Favourites</Link>
              <Link to="/profile" className="cursor-pointer">My Appointments</Link>
              <Link to="/profile" className="cursor-pointer">My Bookings</Link>
              <Link to="/profile" className="cursor-pointer">Become a Partner</Link>
              
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={signOut}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`relative ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Button 
          variant="default"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-full transition-colors duration-300"
        >
          Sign In
        </Button>
        
        {showDropdown && (
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 p-4">
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Favourites</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">My Appointments</span>
                </div>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">SELL</span>
              </div>
              
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">My Bookings</span>
                </div>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">BUY</span>
              </div>
              
              <div className="flex items-center justify-between py-1 border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Requested Services</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">Become a Partner</span>
                </div>
              </div>
              
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 mb-4 py-6 text-lg"
              onClick={handleShowAuthModal}
            >
              SIGN IN/SIGN UP
            </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Auth Modal */}
      <PhoneAuthModal isOpen={showAuthModal} onClose={handleCloseAuthModal} />
    </>
  );
};

export default AuthButtons;
