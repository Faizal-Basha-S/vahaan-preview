
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Index from "@/pages/Index";
import BuyCar from "@/pages/BuyCar";
import CarDetail from "@/pages/CarDetail";
import BikeDetail from "@/pages/BikeDetail";
import BuyBikes from "@/pages/BuyBikes";
import UsedCars from "@/pages/UsedCars";
import Sell from "@/pages/Sell";
import SellCity from "@/pages/SellCity";
import Partner from "@/pages/Partner";
import Services from "@/pages/Services";
import Favourites from "@/pages/Favourites";
import Appointments from "@/pages/Appointments";
import Appointment from "./pages/appointment"; // Changed casing to match actual file
import Bookings from "@/pages/Bookings";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import FAQs from "@/pages/FAQs";
import Contact from "@/pages/Contact";
import AI from "@/pages/AI";
import AdminUploads from "@/pages/AdminUploads";
import NotFound from "@/pages/NotFound";
import ScrollToTop from "@/components/layout/ScrollToTop"; // Fixed import path
import { ThemeProvider } from "./components/ui/theme-provider"; // Fixed import path
import { AuthProvider } from "./context/AuthContext";
import { VehicleProvider } from "./context/VehicleContext";
import SignInModal from "./components/auth/SignInModal"; // Fixed import path
import AboutUs from "@/pages/AboutUs";

function App() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenSignInModal = () => {
      setIsSignInModalOpen(true);
    };

    window.addEventListener('openSignInModal', handleOpenSignInModal);

    return () => {
      window.removeEventListener('openSignInModal', handleOpenSignInModal);
    };
  }, []);

  const closeSignInModal = () => {
    setIsSignInModalOpen(false);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <VehicleProvider>
            <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<BuyCar />} />
              <Route path="/cars/:id" element={<CarDetail />} />
              <Route path="/bikes/:id" element={<BikeDetail />} />
              <Route path="/bikes" element={<BuyBikes />} />
              <Route path="/used-cars" element={<UsedCars />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/sell/:city" element={<SellCity />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/services" element={<Services />} />
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/admin-uploads" element={<AdminUploads />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </VehicleProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
