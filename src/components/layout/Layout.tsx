
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "../ui/ScrollToTopButton";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileHeader from "../mobile/MobileHeader";
import MobileBottomNav from "../mobile/MobileBottomNav";
import FloatingWhatsappButton from "@/components/appointment/FloatingWhatsappButton";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = ({ children, mobilePadding = true }) => {
  // This useEffect ensures scroll is reset when Layout is mounted (which happens on each page change)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isMobile = useIsMobile();

  // Don't render anything until we know if it's mobile or not
  if (isMobile === undefined) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        {/* Show desktop header on non-mobile, mobile header on mobile */}
        <div className="hidden md:block">
          <Header />
        </div>
        <div className="block md:hidden">
          <MobileHeader />
        </div>
        
        <main className="flex-1">
          {/* Content with paddings adjusted for mobile */}
          <div className={`w-full mx-auto ${isMobile && mobilePadding ? 'pt-14' : ''}`}>  
            {children}
          </div>
        </main>
        
        {/* Show desktop footer on non-mobile */}
        <div className={`${isMobile ? 'pb-16' : ''}`}>
          <Footer />
        </div>
        
        {/* Show mobile bottom nav on mobile */}
        <MobileBottomNav />
        
        <ScrollToTopButton />
        
        {/* Global FloatingWhatsappButton - appears on all pages */}
        <FloatingWhatsappButton />
      </div>
    </TooltipProvider>
  );
};

export default Layout;
