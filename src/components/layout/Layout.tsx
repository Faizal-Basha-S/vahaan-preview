
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "../ui/ScrollToTopButton";

const Layout = ({ children }) => {
  // This useEffect ensures scroll is reset when Layout is mounted (which happens on each page change)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
