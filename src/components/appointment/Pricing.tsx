
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, BadgeDollarSign, Car, Handshake, Shield, Lock, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PricingProps {
  onBack: () => void;
  expectedPrice: string;
  selectedFeatures: string[];
}

interface ConfirmationData {
  phoneNumber: string | null;
  brand: string | null;
  year: string | null;
  model: string | null;
  variant: string | null;
  kilometers: string | null;
  city: string | null;
  vehicleType: string | null;
  fuelType: string | null;
  transmission: string | null;
  color: string | null;
  mileage: string | null;
  seats: string | null;
  safetyRating: string | null;
  cc: string | null;
  airbags: string | null;
  cylinders: string | null;
  wheelDrive: string | null;
}

const Pricing: React.FC<PricingProps> = ({ onBack, expectedPrice, selectedFeatures }) => {
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [isConfirmationView, setIsConfirmationView] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData>({
    phoneNumber: null,
    brand: null,
    year: null,
    model: null,
    variant: null,
    kilometers: null,
    city: null,
    vehicleType: null,
    fuelType: null,
    transmission: null,
    color: null,
    mileage: null,
    seats: null,
    safetyRating: null,
    cc: null,
    airbags: null,
    cylinders: null,
    wheelDrive: null,
  });
  
  useEffect(() => {
    // Load data from localStorage for confirmation view
    if (isConfirmationView) {
      const data: ConfirmationData = {
        phoneNumber: localStorage.getItem('phoneNumber'),
        brand: localStorage.getItem('brand'),
        year: localStorage.getItem('year'),
        model: localStorage.getItem('model'),
        variant: localStorage.getItem('variant'),
        kilometers: localStorage.getItem('kilometers'),
        city: localStorage.getItem('selectedCity'),
        vehicleType: localStorage.getItem('vehicle_type'),
        fuelType: localStorage.getItem('fuel_type'),
        transmission: localStorage.getItem('transmission'),
        color: localStorage.getItem('color'),
        mileage: localStorage.getItem('mileage'),
        seats: localStorage.getItem('seats'),
        safetyRating: localStorage.getItem('safety_rating'),
        cc: localStorage.getItem('cc'),
        airbags: localStorage.getItem('airbags'),
        cylinders: localStorage.getItem('cylinders'),
        wheelDrive: localStorage.getItem('wheel_drive'),
      };
      
      setConfirmationData(data);
    }
  }, [isConfirmationView]);
  
  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value.toUpperCase());
    // Reset promo applied state when changing the code
    if (promoApplied) setPromoApplied(false);
  };
  
  const applyPromo = () => {
    if (promoCode === "FRIEND") {
      setPromoApplied(true);
      toast.success("🎉 Promo applied! Listing is free.");
    } else {
      toast.error("Invalid promo code");
    }
  };
  
  const handleProceedToPay = () => {
    // If the promo is applied, show the confirmation view
    if (promoApplied) {
      setIsConfirmationView(true);
      return;
    }
    
    // This will be integrated with Razorpay in a future phase
    toast.info("Payment integration will be available in a future update");
  };
  
  // Format the expected price for display
  const formattedPrice = expectedPrice 
    ? new Intl.NumberFormat("en-IN").format(parseInt(expectedPrice))
    : "0";
    
  // Check if vehicle is a bike
  const isBike = localStorage.getItem("vehicle") === "bike";
  
  // Render confirmation view if payment is successful
  if (isConfirmationView) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Confirmation</h2>
        
        <div className="space-y-6">
          {/* Vehicle Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Brand</p>
                <p className="font-medium">{confirmationData.brand || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Model</p>
                <p className="font-medium">{confirmationData.model || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Variant</p>
                <p className="font-medium">{confirmationData.variant || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                <p className="font-medium">{confirmationData.year || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Kilometers Driven</p>
                <p className="font-medium">{confirmationData.kilometers || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                <p className="font-medium">{confirmationData.city || "N/A"}</p>
              </div>
            </div>
          </div>
          
          {/* Vehicle Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Vehicle Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle Type</p>
                <p className="font-medium">{confirmationData.vehicleType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Fuel Type</p>
                <p className="font-medium">{confirmationData.fuelType || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Color</p>
                <p className="font-medium">{confirmationData.color || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mileage</p>
                <p className="font-medium">{confirmationData.mileage || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Seats</p>
                <p className="font-medium">{confirmationData.seats || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">CC</p>
                <p className="font-medium">{confirmationData.cc || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Safety Rating</p>
                <p className="font-medium">{confirmationData.safetyRating || "N/A"}</p>
              </div>
              
              {/* Render car-specific fields only if not a bike */}
              {!isBike && (
                <>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transmission</p>
                    <p className="font-medium">{confirmationData.transmission || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Airbags</p>
                    <p className="font-medium">{confirmationData.airbags || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cylinders</p>
                    <p className="font-medium">{confirmationData.cylinders || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wheel Drive</p>
                    <p className="font-medium">{confirmationData.wheelDrive || "N/A"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Price and Features */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">Price and Features</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Selling Price</p>
              <p className="font-medium text-xl">₹ {formattedPrice}</p>
            </div>
            
            {selectedFeatures.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Selected Features</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setIsConfirmationView(false)} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Pricing
            </Button>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              Listing Published Successfully
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Default pricing view
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-300">Expected Selling Price</span>
          <span className="font-semibold">₹ {formattedPrice}</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300">Listing Fee</span>
          <span className={`font-semibold ${promoApplied ? "line-through text-gray-400" : ""}`}>
            ₹ 199
          </span>
        </div>
        
        {promoApplied && (
          <div className="flex justify-between items-center py-4 text-green-600 dark:text-green-400">
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Promo Applied
            </span>
            <span className="font-semibold">- ₹ 199</span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4 text-lg font-bold">
          <span>Total</span>
          <span>₹ {promoApplied ? "0" : "199"}</span>
        </div>
      </div>
      
      {/* Promo code section */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Have a promo code?</label>
        <div className="flex gap-2">
          <Input
            value={promoCode}
            onChange={handlePromoChange}
            placeholder="Enter promo code"
            disabled={promoApplied}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && promoCode && !promoApplied) {
                e.preventDefault();
                applyPromo();
              }
            }}
          />
          <Button
            onClick={applyPromo}
            variant="outline"
            disabled={!promoCode || promoApplied}
          >
            Apply
          </Button>
        </div>
        {promoApplied && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            🎉 Promo code FRIEND applied successfully!
          </p>
        )}
      </div>
      
      {/* Selected features section */}
      {selectedFeatures.length > 0 && (
        <div className="mb-8">
          <h3 className="font-medium text-lg mb-3">Selected Features:</h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleProceedToPay} 
          className={`flex items-center gap-2 ${promoApplied ? "bg-green-500 hover:bg-green-600" : ""}`}
        >
          {promoApplied && <Check className="h-4 w-4" />}
          {promoApplied ? "List for Free" : "Proceed to Pay"}
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
