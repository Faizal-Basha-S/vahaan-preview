
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    
    // Add event listener
    window.addEventListener("scroll", toggleVisibility);
    
    // Initialize visibility based on current scroll position
    toggleVisibility();
    
    // Cleanup
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

    // Adjust position for mobile to prevent overlap with bottom navigation
  const mobileBottomPosition = isMobile ? "bottom-24" : "bottom-6 md:bottom-8";

  return (
    <button
      onClick={scrollToTop}
      className={`fixed right-6 md:right-8 z-50 px-4 py-2 
        rounded-full bg-black text-white dark:bg-white dark:text-black
        shadow-md hover:shadow-lg hover:bg-primary/10 dark:hover:bg-gray-700 
        transition-all duration-300 flex items-center gap-2 text-sm font-medium
        ${mobileBottomPosition}
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label="Back to top"
    >
      <ChevronUp size={16} />
      Reach top
    </button>
  );
};

export default ScrollToTopButton;
