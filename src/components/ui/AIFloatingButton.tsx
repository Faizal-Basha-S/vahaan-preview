
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bot } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const AIFloatingButton = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Only show the AI button on homepage
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (!isHomePage) {
      setVisible(false);
      return;
    }
    
    // Show the button after 3 seconds
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isHomePage]);

  const handleClick = () => {
    navigate("/ai");
  };

  if (!visible) return null;

  // Adjust position for mobile to avoid overlapping with bottom navigation
  const mobileBottomPosition = isMobile ? "bottom-20" : "bottom-6";

  return (
    <button
      onClick={handleClick}
      className={`fixed ${mobileBottomPosition} left-6 z-50 bg-[#2E5BFF] text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 animate-fade-in`}
      aria-label="AI Assistant"
    >
      <Bot size={20} />
      <span>Ask AI</span>
    </button>
  );
};

export default AIFloatingButton;
