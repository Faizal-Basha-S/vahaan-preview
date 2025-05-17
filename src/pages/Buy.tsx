
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Bike } from "lucide-react";

const Buy = () => {
  const navigate = useNavigate();
  
  // Function to detect if we're on mobile
  const isMobile = () => window.innerWidth < 1024;
  
  // Redirect to home if not on mobile
  useEffect(() => {
    if (!isMobile()) {
      navigate("/");
    }
    
    // Add resize listener to redirect if screen size changes
    const handleResize = () => {
      if (!isMobile()) {
        navigate("/");
      }
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  // If not mobile, don't render anything (will redirect)
  if (!isMobile()) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-[#fff9fc] pt-16 pb-24 px-5">
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.h1 
          className="text-2xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Dream Ride Awaits
        </motion.h1>
        <motion.p 
          className="text-gray-600 text-sm px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Choose from a wide range of trusted cars and bikes
        </motion.p>
      </div>
      
      {/* Illustration */}
      <motion.div 
        className="flex justify-center mb-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <img
          src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Mobile/buy_page_illustration.png"
          alt="Find your perfect vehicle"
          className="w-64 h-auto"
          loading="lazy"
        />
      </motion.div>
      
      {/* Instruction */}
      <motion.p 
        className="text-center text-gray-600 mb-8 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Select your category below to get started
      </motion.p>
      
      {/* Buttons */}
      <div className="space-y-5 px-3">
        <motion.button
          className="w-full py-4 px-5 bg-white rounded-xl shadow-lg border border-gray-50 flex items-center justify-between"
          onClick={() => navigate("/used-cars")}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">Buy Used Cars</h3>
              <p className="text-xs text-gray-500">Find your perfect car</p>
            </div>
          </div>
          <div className="text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.button>
        
        <motion.button
          className="w-full py-4 px-5 bg-white rounded-xl shadow-lg border border-gray-50 flex items-center justify-between"
          onClick={() => navigate("/bike-buy-section")}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Bike className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-800">Buy Used Bikes</h3>
              <p className="text-xs text-gray-500">Explore bikes near you</p>
            </div>
          </div>
          <div className="text-gray-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </motion.button>
      </div>
      
      {/* Footer Note */}
      <motion.div 
        className="mt-auto pt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="text-xs text-gray-500">
          All vehicles on our platform are verified and trusted
        </p>
      </motion.div>
    </div>
  );
};

export default Buy;
