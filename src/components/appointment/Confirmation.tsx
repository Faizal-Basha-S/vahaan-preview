
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

type PhotoCategory = "Exterior" | "Interior" | "Tyres" | "Features" | "Defects" | "Front" | "Rear" | "Left" | "Right";

const Confirmation: React.FC<ConfirmationProps> = ({
  confirmationData,
  isBike,
  formattedPrice,
  selectedFeatures,
  setIsConfirmationView
}) => {
  const [uploadedImages, setUploadedImages] = useState<Record<PhotoCategory, string[]>>({
    Exterior: [],
    Interior: [],
    Tyres: [],
    Features: [],
    Defects: [],
    Front: [],
    Rear: [],
    Left: [],
    Right: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load uploaded image URLs from localStorage
    const savedUrls = localStorage.getItem("uploadedFileUrls");
    if (savedUrls) {
      try {
        const parsedUrls = JSON.parse(savedUrls) as Record<PhotoCategory, string[]>;
        setUploadedImages(parsedUrls);
      } catch (error) {
        console.error("Error parsing uploaded image URLs:", error);
      }
    }
  }, []);

  const handlePublishListing = async () => {
    setIsSubmitting(true);

    try {
      // Get vehicle type and determine which table to use
      const sellFormDataStr = localStorage.getItem("sellFormData");
      if (!sellFormDataStr) {
        throw new Error("Sell form data not found in localStorage");
      }

      const sellFormData = JSON.parse(sellFormDataStr);
      const vehicleType = localStorage.getItem("vehicle_type");
      const vehicle = localStorage.getItem("vehicle");

      console.log("vehicle", vehicleType);
      
      // Get user phone number from user profile
      let phoneNumber = confirmationData.phoneNumber;
      
      // Try to find userProfile in localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("userProfile_")) {
          try {
            const profile = JSON.parse(localStorage.getItem(key) || "{}");
            phoneNumber = profile.phoneNumber || phoneNumber;
          } catch (e) {
            console.error("Error parsing user profile:", e);
          }
        }
      });

      // Format photos based on vehicle type
      const uploadedFileUrlsStr = localStorage.getItem("uploadedFileUrls");
      let photos = {};
      
      if (uploadedFileUrlsStr) {
        try {
          const parsedUrls = JSON.parse(uploadedFileUrlsStr);
          
          if (vehicle === "car") {
            photos = {
              exterior: parsedUrls.Exterior || [],
              interior: parsedUrls.Interior || [],
              tyres: parsedUrls.Tyres || [],
              features: parsedUrls.Features || [],
              defects: parsedUrls.Defects || []
            };
          } else {
            photos = {
              front: parsedUrls.Front || [],
              rear: parsedUrls.Rear || [],
              left: parsedUrls.Left || [],
              right: parsedUrls.Right || [],
              defects: parsedUrls.Defects || []
            };
          }
        } catch (error) {
          console.error("Error parsing uploaded file URLs:", error);
          photos = {};
        }
      }

      const sellingPrice = parseInt(localStorage.getItem("seller_price") || "0", 10);
      const parsedFeatures = JSON.parse(localStorage.getItem("key_features") || "[]");

      if (vehicle === "car") {
        // Prepare car listing data
        const carData = {
          brand: sellFormData.brand || confirmationData.brand,
          model: sellFormData.model || confirmationData.model,
          variant: sellFormData.variant || confirmationData.variant,
          year: parseInt(sellFormData.year || confirmationData.year || "0", 10),
          city: localStorage.getItem("selectedCity") || confirmationData.city,
          color: localStorage.getItem("color") || confirmationData.color,
          fuel_type: localStorage.getItem("fuel_type") || confirmationData.fuelType || "Petrol",
          transmission: localStorage.getItem("transmission") || confirmationData.transmission || "Manual",
          mileage: parseFloat(localStorage.getItem("mileage") || confirmationData.mileage || "0"),
          seats: parseInt(localStorage.getItem("seats") || confirmationData.seats || "0", 10),
          cc: parseInt(localStorage.getItem("cc") || confirmationData.cc || "0", 10),
          gncap_rating: parseInt(localStorage.getItem("safety_rating") || confirmationData.safetyRating || "0", 10),
          airbags: parseInt(localStorage.getItem("airbags") || confirmationData.airbags || "0", 10),
          cylinders: parseInt(localStorage.getItem("cylinders") || confirmationData.cylinders || "0", 10),
          wheel_drive: localStorage.getItem("wheel_drive") || confirmationData.wheelDrive,
          sell_price: sellingPrice,
          features: selectedFeatures.length > 0 ? selectedFeatures : parsedFeatures,
          phone_number: phoneNumber || "0000000000",
          vehicle_type: vehicleType,
          photos: photos
        };

        // Insert car listing into Supabase
        const { data: carData_res, error: carError } = await supabase
          .from("car_seller_listings")
          .insert([carData]);

        if (carError) {
          throw carError;
        }
        
        console.log("Car listing published successfully");
        toast.success("Car listing has been published successfully!");
      } else {
        // Prepare bike listing data
        const bikeData = {
          brand: sellFormData.brand || confirmationData.brand,
          model: sellFormData.model || confirmationData.model,
          variant: sellFormData.variant || confirmationData.variant,
          year: parseInt(sellFormData.year || confirmationData.year || "0", 10),
          city: localStorage.getItem("selectedCity") || confirmationData.city,
          color: localStorage.getItem("color") || confirmationData.color,
          fuel_type: localStorage.getItem("fuel_type") || confirmationData.fuelType || "Petrol",
          mileage: parseFloat(localStorage.getItem("mileage") || confirmationData.mileage || "0"),
          seats: parseInt(localStorage.getItem("seats") || confirmationData.seats || "0", 10),
          cc: parseInt(localStorage.getItem("cc") || confirmationData.cc || "0", 10),
          gncap_rating: parseInt(localStorage.getItem("safety_rating") || confirmationData.safetyRating || "0", 10),
          sell_price: sellingPrice,
          features: selectedFeatures.length > 0 ? selectedFeatures : parsedFeatures,
          phone_number: phoneNumber || "0000000000",
          vehicle_type: vehicleType,
          photos: photos
        };

        // Insert bike listing into Supabase
        const { data: bikeData_res, error: bikeError } = await supabase
          .from("bike_seller_listings")
          .insert([bikeData]);

        if (bikeError) {
          throw bikeError;
        }
        
        console.log("Bike listing published successfully");
        toast.success("Bike listing has been published successfully!");
      }

      // Optional: Clear certain localStorage data after successful submission
      // localStorage.removeItem("uploadedFileUrls");
      // localStorage.removeItem("seller_price");
      // localStorage.removeItem("key_features");
      
    } catch (error) {
      console.error("Error publishing listing:", error);
      toast.error("Failed to publish listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="grid grid-cols-2 gap-4 mb-6">
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

          {/* Photos section */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4">Vehicle Photos</h4>
            
            {Object.entries(uploadedImages).map(([category, urls]) => (
              urls.length > 0 && (
                <div key={category} className="mb-6">
                  <h5 className="text-md font-semibold mb-2">{category}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {urls.map((url, idx) => (
                      <div key={idx} className="aspect-square rounded-md overflow-hidden border dark:border-gray-600">
                        <img
                          src={url}
                          alt={`${category}-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
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
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handlePublishListing}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Listing Published Successfully"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
