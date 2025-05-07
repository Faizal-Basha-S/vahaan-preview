
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface SellFormData {
  vehicleType: "car" | "bike";
  brand: string;
  year: string;
  model: string;
  variant: string;
  kilometersDriven: string;
  city: string;
  [key: string]: string; // For other possible fields
}

interface PricingProps {
  onBack: () => void;
  expectedPrice: string;
  selectedFeatures: string[];
  vehicleData?: SellFormData | null;
}

interface ConfirmationData {
  phone_number: string;
  brand: string;
  year: string;
  model: string;
  variant: string;
  kms_driven: string;
  city: string;
  vehicle_type: string;
  fuel_type: string;
  transmission: string;
  color: string;
  mileage: string;
  seats: string;
  safety_rating: string;
  cc: string;
  airbags: string | null;
  cylinders: string | null;
  wheel_drive: string | null;
  seller_price: string;
  key_features: string[];
}

const Pricing: React.FC<PricingProps> = ({ 
  onBack, 
  expectedPrice, 
  selectedFeatures,
  vehicleData
}) => {
  const [promoCode, setPromoCode] = useState<string>("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
  const [confirmationData, setConfirmationData] = useState<ConfirmationData>({
    phone_number: "",
    brand: "",
    year: "",
    model: "",
    variant: "",
    kms_driven: "",
    city: "",
    vehicle_type: "",
    fuel_type: "",
    transmission: "",
    color: "",
    mileage: "",
    seats: "",
    safety_rating: "",
    cc: "",
    airbags: null,
    cylinders: null,
    wheel_drive: null,
    seller_price: "",
    key_features: [],
  });
  
  // Load data from localStorage
  useEffect(() => {
    try {
      // Load form data
      const storedFormData = localStorage.getItem("sellFormData");
      if (storedFormData) {
        const parsedData = JSON.parse(storedFormData);
        
        // Check vehicle type
        const vehicleType = parsedData.vehicleType || localStorage.getItem("vehicle") || "car";
        
        setConfirmationData({
          phone_number: localStorage.getItem("phone_number") || "",
          brand: parsedData.brand || "",
          year: parsedData.year || "",
          model: parsedData.model || "",
          variant: parsedData.variant || "",
          kms_driven: parsedData.kilometersDriven || "",
          city: parsedData.city || "",
          vehicle_type: vehicleType,
          fuel_type: localStorage.getItem("fuel_type") || "",
          transmission: vehicleType === "car" ? localStorage.getItem("transmission") || "" : null,
          color: localStorage.getItem("color") || "",
          mileage: localStorage.getItem("mileage") || "",
          seats: localStorage.getItem("seats") || "",
          safety_rating: localStorage.getItem("safety_rating") || "",
          cc: localStorage.getItem("cc") || "",
          airbags: vehicleType === "car" ? localStorage.getItem("airbags") || "" : null,
          cylinders: vehicleType === "car" ? localStorage.getItem("cylinders") || "" : null,
          wheel_drive: vehicleType === "car" ? localStorage.getItem("wheel_drive") || "" : null,
          seller_price: expectedPrice || localStorage.getItem("seller_price") || "",
          key_features: selectedFeatures || JSON.parse(localStorage.getItem("key_features") || "[]"),
        });
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, [expectedPrice, selectedFeatures]);
  
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value);
  };
  
  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (promoCode.toUpperCase() === "FRIEND") {
      setIsPaymentSuccessful(true);
      toast.success("Promo code applied successfully!");
    } else {
      toast.error("Invalid promo code");
    }
  };
  
  const calculateFee = () => {
    // Simple example: 5% of expected price or minimum 499
    const price = parseInt(expectedPrice.replace(/,/g, ""), 10);
    if (isNaN(price)) return 499;
    
    const fee = Math.max(499, Math.round(price * 0.05));
    return new Intl.NumberFormat("en-IN").format(fee);
  };
  
  // Format the expected price with commas
  const formattedPrice = expectedPrice 
    ? new Intl.NumberFormat("en-IN").format(parseInt(expectedPrice.replace(/,/g, "")))
    : "0";
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {isPaymentSuccessful ? "Confirmation" : "Pricing"}
      </h2>
      
      {isPaymentSuccessful ? (
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-400">
            <Check className="h-5 w-5" />
            <span>Your listing has been confirmed!</span>
          </div>
          
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-lg">Vehicle Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-medium">{confirmationData.brand || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{confirmationData.model || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Variant</p>
                <p className="font-medium">{confirmationData.variant || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{confirmationData.year || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Kilometers Driven</p>
                <p className="font-medium">{confirmationData.kms_driven || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{confirmationData.city || "N/A"}</p>
              </div>
              
              {/* Only show these fields if vehicleType is car */}
              {confirmationData.vehicle_type === "car" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-medium">{confirmationData.transmission || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium">{confirmationData.fuel_type || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{confirmationData.color || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Airbags</p>
                    <p className="font-medium">{confirmationData.airbags || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Cylinders</p>
                    <p className="font-medium">{confirmationData.cylinders || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Wheel Drive</p>
                    <p className="font-medium">{confirmationData.wheel_drive || "N/A"}</p>
                  </div>
                </>
              )}
              
              {/* Common fields for both car and bike */}
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-medium">{confirmationData.mileage || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Seats</p>
                <p className="font-medium">{confirmationData.seats || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Safety Rating</p>
                <p className="font-medium">{confirmationData.safety_rating || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">CC</p>
                <p className="font-medium">{confirmationData.cc || "N/A"}</p>
              </div>
            </div>
          </div>
          
          {/* Selected Features */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Key Features</h3>
            <div className="flex flex-wrap gap-2">
              {confirmationData.key_features && confirmationData.key_features.length > 0 ? (
                confirmationData.key_features.map((feature, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 text-sm rounded">
                    {feature}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No features selected</p>
              )}
            </div>
          </div>
          
          {/* Expected Price */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Expected Price</h3>
            <p className="font-semibold text-xl">₹ {formattedPrice}</p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      ) : (
        // Show pricing section if payment is not yet successful
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Listing Fee</h3>
            <div className="flex justify-between items-center">
              <span>Basic Listing Fee</span>
              <span className="font-semibold">₹ {calculateFee()}</span>
            </div>
          </div>
          
          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromoCode} className="space-y-3">
            <h3 className="font-medium">Have a promo code?</h3>
            <div className="flex space-x-2">
              <Input
                value={promoCode}
                onChange={handlePromoCodeChange}
                placeholder="Enter promo code"
                className="flex-grow"
              />
              <Button type="submit">Apply</Button>
            </div>
          </form>
          
          {/* Payment Button */}
          <Button 
            className="w-full flex items-center justify-center gap-2 bg-primary"
          >
            Proceed to Pay
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="w-full flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default Pricing;
