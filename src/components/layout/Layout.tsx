
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "../ui/ScrollToTopButton";
import { TooltipProvider } from "@/components/ui/tooltip";

const Layout = ({ children }) => {
  // This useEffect ensures scroll is reset when Layout is mounted (which happens on each page change)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pt-16">
          <div className="w-full px-4 mx-auto">  
            {children}
          </div>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </TooltipProvider>
  );
};

export default Layout;
