
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

const Pricing: React.FC<PricingProps> = ({ 
  onBack, 
  expectedPrice, 
  selectedFeatures,
  vehicleData
}) => {
  const [promoCode, setPromoCode] = useState<string>("");
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  
  // Load photos from localStorage
  useEffect(() => {
    try {
      const storedPhotos = localStorage.getItem("uploaded_photos");
      if (storedPhotos) {
        setUploadedPhotos(JSON.parse(storedPhotos));
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    }
  }, []);
  
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
              {/* Display data from vehicleData */}
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="font-medium">{vehicleData?.brand || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{vehicleData?.model || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Variant</p>
                <p className="font-medium">{vehicleData?.variant || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{vehicleData?.year || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Kilometers Driven</p>
                <p className="font-medium">{vehicleData?.kilometersDriven || "N/A"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium">{vehicleData?.city || "N/A"}</p>
              </div>
              
              {/* Only show these fields if vehicleType is car */}
              {vehicleData?.vehicleType === "car" && (
                <>
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-medium">{localStorage.getItem("transmission") || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium">{localStorage.getItem("fuel_type") || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{localStorage.getItem("color") || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Airbags</p>
                    <p className="font-medium">{localStorage.getItem("airbags") || "N/A"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Selected Features */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">Key Features</h3>
            <div className="flex flex-wrap gap-2">
              {selectedFeatures.length > 0 ? (
                selectedFeatures.map((feature, index) => (
                  <span key={index} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 text-sm rounded">
                    {feature}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No features selected</p>
              )}
            </div>
          </div>
          
          {/* Uploaded Photos */}
          {uploadedPhotos.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Uploaded Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                    <img src={photo} alt={`Vehicle photo ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
