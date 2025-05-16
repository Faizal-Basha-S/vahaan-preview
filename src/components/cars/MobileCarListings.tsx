
import React, { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Pagination } from "@/components/ui/pagination";
import { PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MobileCarListingsProps {
  cars: any[];
}

// Helper function to determine price badge color and text
const getPriceBadge = (car: any) => {
  const priceLabels: Record<string, { text: string, color: string }> = {
    great: { text: "GREAT PRICE", color: "bg-green-500" },
    good: { text: "GOOD PRICE", color: "bg-green-600" },
    fair: { text: "FAIR PRICE", color: "bg-yellow-500" },
  };
  
  // Determine price category based on car data
  let priceCategory = "fair";
  if (car.id % 3 === 0) {
    priceCategory = "great";
  } else if (car.id % 3 === 1) {
    priceCategory = "good";
  }
  
  return priceLabels[priceCategory];
};

const CarCard = ({ car }: { car: any }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const priceBadge = getPriceBadge(car);
  
  // Simplify numbers for display
  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} lakh`;
    }
    return `₹${price}`;
  };
  
  // Calculate EMI (just for display purposes)
  const calculateEMI = (price: number) => {
    // Simple EMI calculation (price / 36 months + some interest)
    const emi = (price / 36) * 1.08;
    return `₹${Math.round(emi).toLocaleString('en-IN')}/m`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="relative">
        <img 
          src={car.imageUrl || "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/placeholders/car-placeholder.jpg"} 
          alt={car.title}
          className="w-full h-48 object-contain bg-gray-50 p-2"
        />
        
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow"
        >
          <Heart fill={isFavorited ? "#ff3700" : "none"} stroke={isFavorited ? "#ff3700" : "currentColor"} className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        <Link to={`/car-detail/${car.id}`}>
          <h3 className="text-lg font-bold mb-1">{car.year} {car.brand} {car.model}</h3>
        </Link>
        
        <div className="flex justify-between text-xs text-gray-600 mb-3">
          <span>{car.mileage.toLocaleString('en-IN')} km</span>
          <span>{car.fuelType || car.fuel}</span>
          <span>{car.transmission || "Manual"}</span>
          <span>{car.owners || 1}{car.owners === 1 ? "st" : car.owners === 2 ? "nd" : car.owners === 3 ? "rd" : "th"} owner</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-gray-600 text-sm">EMI {calculateEMI(car.price)}</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{formatPrice(car.price)}</div>
          </div>
        </div>
        
        {/* Badges row */}
        <div className="flex justify-between items-center">
          <div>
            <Badge variant="outline" className="flex items-center gap-1 border-gray-300">
              {car.sellerType === 'dealer' ? (
                <>
                  <span className="bg-green-600 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  <span className="text-xs">Verified Dealer</span>
                </>
              ) : (
                <>
                  <span className="bg-orange-500 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  <span className="text-xs">Verified Owner</span>
                </>
              )}
            </Badge>
          </div>
          
          <div>
            <Badge 
              className={`${priceBadge.color} text-white px-2 py-1 text-xs flex items-center gap-1 rounded-full`}
            >
              <span className="w-3 h-3 bg-white rounded-full"></span>
              {priceBadge.text}
            </Badge>
          </div>
          
          <Button variant="ghost" size="sm" className="text-orange-500 flex items-center">
            <span className="mr-1 text-xs">Highlights</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {car.location || "Andheri East, Mumbai"}
        </div>
      </div>
    </div>
  );
};

const MobileCarListings: React.FC<MobileCarListingsProps> = ({ cars }) => {
  const [activeTab, setActiveTab] = useState("all");
  
  const tabs = [
    { id: "all", label: "All" },
    { id: "assured", label: "VAHAANX Assured" },
    { id: "dealer", label: "Dealer" },
    { id: "private", label: "Private Owner" }
  ];
  
  return (
    <div className="pb-16"> {/* Bottom padding for mobile nav */}
      {/* Search Bar & Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 pb-6 rounded-b-xl shadow-md">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search for your favourite cars"
            className="w-full bg-white rounded-lg py-3 px-4 pl-10 text-sm"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="flex justify-between items-start">
          <div className="text-white">
            <div className="uppercase text-sm font-medium">PRE-APPROVAL</div>
            <div className="text-lg font-bold">within 2 minutes</div>
            <div className="flex items-center text-sm mt-1">
              <span>Check EMI Offer</span>
              <ChevronUp className="h-4 w-4 ml-1 transform rotate-90" />
            </div>
          </div>
          <div>
            <img 
              src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/placeholders/blue-car.png" 
              alt="Car"
              className="h-16 w-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Filter Options Row */}
      <div className="overflow-x-auto scrollbar-none px-4 py-3">
        <div className="flex gap-3 min-w-max">
          <Button variant="outline" size="sm" className="flex items-center bg-white font-medium shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center bg-white font-medium shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Sort by
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center bg-white font-medium shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Near me
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center bg-white font-medium shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M8 18h13M8 6h13" />
            </svg>
            Car Category
          </Button>
        </div>
      </div>
      
      {/* Section Title & Tabs */}
      <div className="px-4 pt-2 pb-0">
        <h2 className="font-medium text-lg mb-2">Used cars in India</h2>
        
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-3 text-sm relative ${
                activeTab === tab.id
                  ? "font-medium text-orange-500" 
                  : "text-gray-600"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Car Listings */}
      <div className="p-4">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="mt-2 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default MobileCarListings;
