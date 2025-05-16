
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { indianCities } from "@/utils/cityList";
import { ScrollArea } from "@/components/ui/scroll-area";

const MobileUsedCarsUI = () => {
  const [isCitiesExpanded, setIsCitiesExpanded] = useState(false);
  
  // Select a subset of cities for the grid
  const citiesForGrid = [
    "New Delhi", "Mumbai", "Hyderabad", 
    "Bangalore", "Chennai", "Pune", 
    "Jaipur", "Kolkata", "Ahmedabad",
    "Lucknow", "Chandigarh", "Kochi"
  ];

  // Get more cities for the sell section
  const sellCities = indianCities.slice(0, 24);
  
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#ff3700] to-[#ff5733] text-white p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Your Next Car, Just a Tap Away!</h1>
          <p className="text-sm mb-4">Find top deals on verified used cars across India.</p>
          <Button 
            className="bg-white text-[#ff3700] hover:bg-white/90 self-start"
            asChild
          >
            <Link to="/used-cars#explore">Explore Used Cars</Link>
          </Button>
        </div>
      </div>
      
      {/* Banner Cards */}
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden relative bg-[#0033ff] text-white">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Certified Cars, Better Than New</h3>
              <p className="text-sm mb-3">Backed by warranty, tested for quality.</p>
              <Button 
                variant="outline" 
                className="text-[#0033ff] bg-white hover:bg-white/90 hover:text-[#0033ff]"
                asChild
              >
                <Link to="/used-cars">Know More</Link>
              </Button>
            </div>
          </Card>
          
          <Card className="overflow-hidden relative bg-[#ff3700] text-white">
            <div className="p-4">
              <h3 className="text-lg font-semibold">First-Time Car Buyer?</h3>
              <p className="text-sm mb-3">Get special offers and financing options.</p>
              <Button 
                variant="outline" 
                className="text-[#ff3700] bg-white hover:bg-white/90 hover:text-[#ff3700]"
                asChild
              >
                <Link to="/used-cars">Check Listings</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Used Cars by Cities */}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Used Cars by Cities</h2>
        <div className="grid grid-cols-3 gap-4">
          {citiesForGrid.map((city) => (
            <Link 
              key={city} 
              to={`/used-cars/${city.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <img 
                  src={`/resource-uploads/cb1ea988-cfec-473f-94a0-d9f67613bc1e.png`}
                  alt={`${city} icon`}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-xs text-center">{`Used Cars in ${city}`}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Second Hand Cars Info Block */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/20">
        <h2 className="text-xl font-semibold mb-2">Second Hand Cars</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Discover thousands of quality-assured used cars at unbeatable prices. 
          Apply filters to refine by budget, fuel, brand, and more. 
          Everything you need, in one place.
        </p>
      </div>
      
      {/* Sell Your Car in Cities */}
      <div className="p-4">
        <div 
          className="flex justify-between items-center mb-4 cursor-pointer"
          onClick={() => setIsCitiesExpanded(!isCitiesExpanded)}
        >
          <h2 className="text-xl font-semibold">Sell Your Car in Cities</h2>
          {isCitiesExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </div>
        
        {isCitiesExpanded && (
          <div className="grid grid-cols-2 gap-2">
            {sellCities.map((city) => (
              <Link 
                key={city}
                to={`/sell-car/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline py-1"
              >
                Sell car in {city}
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-100 dark:bg-gray-800 p-4 mt-6">
        <div className="flex justify-center gap-4 mb-4">
          {/* Social media icons */}
          <a href="#" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a href="#" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
            </svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
            </svg>
          </a>
        </div>
        
        <p className="text-center text-sm text-gray-500 mb-4">support@vahaanxchange.com</p>
        
        {/* Dropdown sections */}
        <div className="space-y-2 mb-4">
          {["About VahaanXchange", "Connect With Us", "Others", "VahaanXchange Group Ventures"].map((section) => (
            <div key={section} className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">{section}</h3>
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
        
        {/* App download badges */}
        <div className="flex justify-center gap-4 mb-4">
          <a href="#" className="bg-black text-white px-3 py-1 rounded text-xs flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <circle cx="18" cy="18" r="3"></circle>
              <path d="M18 15v3"></path>
            </svg>
            Google Play
          </a>
          <a href="#" className="bg-black text-white px-3 py-1 rounded text-xs flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 4-2.5 4-2.5-1.5 0-2 0-3.5-1s-2.5-2-4-2-3 1-4.5 1-2 0-3.5 1-2.5 2-4 2c0 0 1 2.5 4 2.5 1.25 0 2.5-1.06 4-1.06Z"></path>
              <path d="M12 16c1.5 0 2.75 1.06 4 1.06 3 0 4-2.5 4-2.5-1.5 0-2 0-3.5-1s-2.5-2-4-2-3 1-4.5 1-2 0-3.5 1-2.5 2-4 2c0 0 1 2.5 4 2.5 1.25 0 2.5-1.06 4-1.06Z"></path>
              <path d="M19.5 2.65c-1 0-2 .25-3 .75-1.5.75-2 .75-3.5.75s-2-.25-3.5-.75c-1-.5-2-.75-3-.75-4 0-5 3-5 8 0 4 2.25 10 4 10 1.25 0 2-1 4-1s2.75 1 4 1c1.75 0 4-6 4-10 0-5-1-8-5-8Z"></path>
            </svg>
            App Store
          </a>
        </div>
        
        {/* Copyright */}
        <p className="text-center text-xs text-gray-500">
          © 2025 VahaanXchange Software Pvt. Ltd.
        </p>
      </div>
    </div>
  );
};

export default MobileUsedCarsUI;
