
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ConfirmationProps {
  confirmationData: ConfirmationData;
  isBike: boolean;
  formattedPrice: string;
  selectedFeatures: string[];
  setIsConfirmationView: (value: boolean) => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({
  confirmationData,
  isBike,
  formattedPrice,
  selectedFeatures,
  setIsConfirmationView
}) => {
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
};

export default Confirmation;
