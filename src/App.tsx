
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import BuyCar from "./pages/BuyCar";
import BuyBikes from "./pages/BuyBikes";
import Sell from "./pages/Sell";
import UsedCars from "./pages/UsedCars";
import BikeBuySection from "./pages/BikeBuySection";
import AI from "./pages/AI";
import { createCSSVariables } from "./lib/utils";
import { VehicleProvider } from "./context/VehicleContext";
import { AuthProvider } from "./context/AuthContext";
import CarDetail from "./pages/CarDetail";
import BikeDetail from "./pages/BikeDetail";
import SellCity from "./pages/SellCity";
import Contact from "./pages/Contact";
import FAQs from "./pages/FAQs";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminUploads from "@/pages/AdminUploads";
import Appointment from "@/pages/appointment";
import AboutUs from "./pages/AboutUs"; // Import the new AboutUs page

// Import new pages
import Favourites from "./pages/Favourites";
import Appointments from "./pages/Appointments";
import Bookings from "./pages/Bookings";
import ServicesPage from "./pages/Services";
import Partner from "./pages/Partner";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Initialize CSS variables for animations
    createCSSVariables();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <VehicleProvider>
          <Toaster />
          <Sonner />
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} /> {/* Add new AboutUs route */}
              <Route path="/search" element={<BuyCar />} />
              <Route path="/bikes" element={<BuyBikes />} />
              <Route path="/sell-car" element={<Sell />} />
              <Route path="/sell" element={<Sell />} /> {/* Route alias */}
              <Route path="/sell/:city" element={<SellCity />} />
              <Route path="/used-cars" element={<UsedCars />} />
              <Route path="/bike-buy-section" element={<BikeBuySection />} />
              <Route path="/ai" element={<AI />} />
              <Route path="/buy/:id" element={<CarDetail />} /> {/* Car details route */}
              <Route path="/bike/:id" element={<BikeDetail />} /> {/* Bike details route */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin-uploads" element={<AdminUploads />} />
              <Route path="/appointment" element={<Appointment />} /> {/* New appointment route */}
              
              {/* New routes for authenticated user pages */}
              <Route path="/favourites" element={<Favourites />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/aboutus" element={<AboutUs />} /> {/* Alternative route for AboutUs */}
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </VehicleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
