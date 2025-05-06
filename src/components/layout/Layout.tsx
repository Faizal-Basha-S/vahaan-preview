
import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTopButton from "../ui/ScrollToTopButton";
import AdminButtons from "../admin/AdminButtons";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // This useEffect ensures scroll is reset when Layout is mounted (which happens on each page change)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
      <ScrollToTopButton />
      <AdminButtons />
    </div>
  );
};

export default Layout;
