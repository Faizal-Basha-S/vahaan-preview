
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PhoneAuthModal from "../auth/PhoneAuthModal";

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const { currentUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!currentUser) {
      e.preventDefault();
      setShowAuthModal(true);
    }
    // If user is logged in, navigate normally via the Link component
  };

  const handleFavouritesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    navigate("/favourites");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
      <div className="flex justify-around items-center h-16 px-2 relative">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("/") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <img 
            src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Mobile/navbar_home.png" 
            alt="Home" 
            className="h-6 w-6 mb-1" 
          />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link 
          to="/buy" 
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("/buy") || isActive("/used-cars") || isActive("/bikes") || isActive("/search") ? 
            "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <img 
            src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Mobile/buy.png" 
            alt="Buy" 
            className="h-6 w-6 mb-1" 
          />
          <span className="text-xs">Buy</span>
        </Link>
        
        <Link 
          to="/sell" 
          className="flex flex-col items-center justify-center w-1/5 h-full"
        >
          <div className="relative -top-4 bg-white dark:bg-gray-900 rounded-full p-2 shadow-lg">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-l from-pink-400 via-purple-500 to-orange-400">
              <img 
                src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Mobile/postad_plus_icon.png"
                alt="Post Ad"
                className="w-6 h-6"
              />
            </div>
          </div>
          <span className="text-xs font-medium">Post Ad</span>
        </Link>
        
        {/* Modified: Using onClick handler instead of just Link */}
        <a 
          href="#"
          onClick={handleFavouritesClick}
          className={`flex flex-col items-center justify-center w-1/5 h-full ${
            isActive("/favourites") ? "text-primary" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <img 
            src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Mobile/favourites.png" 
            alt="My Favourites" 
            className="h-6 w-6 mb-1" 
          />
          <span className="text-xs">Favourites</span>
        </a>
        
        <div onClick={handleProfileClick} className="w-1/5">
          <Link 
            to={currentUser ? "/profile" : "#"} 
            className={`flex flex-col items-center justify-center w-full h-full ${
              isActive("/profile") || isActive("/contact") ? "text-primary" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <img 
              src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Mobile/profile.png" 
              alt="Profile" 
              className="h-6 w-6 mb-1" 
            />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>

      {/* Auth Modal for mobile sign-in */}
      <PhoneAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
};

export default MobileBottomNav;
