import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
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
  const [documentChecklist, setDocumentChecklist] = useState<Record<string, boolean>>({
    insurance_document: false,
    puc_certificate: false,
    road_tax_status: false,
    battery_health_proof: false,
    loan_noc_document: false,
    warranty_document: false
  });
  const [showDocumentChecklist, setShowDocumentChecklist] = useState<Record<string, boolean>>({
    insurance_document: true,
    puc_certificate: true,
    road_tax_status: true,
    battery_health_proof: false,
    loan_noc_document: false,
    warranty_document: false
  });
  const [step2Data, setStep2Data] = useState<Record<string, any>>({});
  const [step3Data, setStep3Data] = useState<Record<string, any>>({});

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

    // Load step2 and step3 data from localStorage for document checklist conditions
    const step2DataStr = localStorage.getItem("appointment_step2_data");
    const step3DataStr = localStorage.getItem("appointment_step3_data");

    try {
      if (step2DataStr) {
        const parsedStep2Data = JSON.parse(step2DataStr);
        setStep2Data(parsedStep2Data);
        
        // Show battery_health_proof checkbox conditionally
        if (parsedStep2Data.battery_health && parsedStep2Data.battery_health.trim() !== '') {
          setShowDocumentChecklist(prev => ({...prev, battery_health_proof: true}));
        }
      }

      if (step3DataStr) {
        const parsedStep3Data = JSON.parse(step3DataStr);
        setStep3Data(parsedStep3Data);
        
        // Show loan_noc_document checkbox conditionally
        if (parsedStep3Data.loan_status === "Yes-got NOC") {
          setShowDocumentChecklist(prev => ({...prev, loan_noc_document: true}));
        }

        // Show warranty_document checkbox conditionally
        if (parsedStep3Data.warranty_status === "At Present") {
          setShowDocumentChecklist(prev => ({...prev, warranty_document: true}));
        }
      }
    } catch (error) {
      console.error("Error parsing step data:", error);
    }
  }, []);

  // Check if all required documents are checked
  const areAllDocumentsChecked = () => {
    for (const [key, isVisible] of Object.entries(showDocumentChecklist)) {
      if (isVisible && !documentChecklist[key]) {
        return false;
      }
    }
    return true;
  };

  const handleDocumentCheckboxChange = (document: string, checked: boolean) => {
    setDocumentChecklist(prev => ({...prev, [document]: checked}));
  };

  const handlePublishListing = async () => {
    if (!areAllDocumentsChecked()) {
      toast.error("Please agree to provide all required documents");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get vehicle type to determine which table to use
      const vehicle = localStorage.getItem("vehicle");
      if (!vehicle || (vehicle !== "car" && vehicle !== "bike")) {
        toast.error("Invalid vehicle type");
        setIsSubmitting(false);
        return;
      }
      
      // Build the listing data object from localStorage
      const payload: Record<string, any> = {};
      
      // Get data from appointment_step1_data
      try {
        const step1Data = JSON.parse(localStorage.getItem("appointment_step1_data") || "{}");
        payload.registration_number = step1Data.registration_number || null;
        payload.rto_state = step1Data.rto_state || null;
        payload.rto = step1Data.rto || null;
        payload.vehicle_type = step1Data.body_type || null;
        payload.cc = step1Data.engine_cc ? parseInt(step1Data.engine_cc, 10) : null;
        payload.load_capacity = step1Data.load_capacity || null;
      } catch (error) {
        console.error("Error parsing step1 data:", error);
      }
      
      // Get data from appointment_step2_data
      try {
        const step2Data = JSON.parse(localStorage.getItem("appointment_step2_data") || "{}");
        payload.number_of_owners = step2Data.number_of_owners ? parseInt(step2Data.number_of_owners, 10) : null;
        payload.ownership_type = step2Data.ownership_type || null;
        payload.fuel_type = step2Data.fuel_type || null;
        payload.color = step2Data.color || null;
        payload.transmission_type = step2Data.transmission_type || null;
        payload.modifications = step2Data.modifications || null;
        payload.battery_health = step2Data.battery_health || null;
      } catch (error) {
        console.error("Error parsing step2 data:", error);
      }
      
      // Get data from appointment_step3_data
      try {
        const step3Data = JSON.parse(localStorage.getItem("appointment_step3_data") || "{}");
        payload.warranty_status = step3Data.warranty_status || null;
        payload.loan_status = step3Data.loan_status || null;
        payload.tire_condition = step3Data.tire_condition || null;
        payload.permit_type = step3Data.permit_type || null;
        payload.fitness_certificate = step3Data.fitness_certificate || null;
        payload.vehicle_battery = step3Data.vehicle_battery || null;
        payload.accident_history = step3Data.accident_history || null;
        payload.major_replacements = step3Data.major_replacements || null;
      } catch (error) {
        console.error("Error parsing step3 data:", error);
      }
      
      // Get data from appointment_step5_data
      try {
        const step5Data = JSON.parse(localStorage.getItem("appointment_step5_data") || "{}");
        payload.seller_name = step5Data.seller_name || null;
        payload.sell_price = step5Data.seller_price ? parseInt(step5Data.seller_price, 10) : null;
        payload.seller_phone_number = step5Data.phone_number || null;
        payload.seller_location_city = step5Data.location_city || null;
        payload.preferred_contact_time = step5Data.preferred_contact_time || null;
        payload.warranty_details = step5Data.warranty_details || null;
        payload.ev_charger_included = step5Data.ev_charger_included || null;
        payload.reason_for_sale = step5Data.reason_for_sale || null;
        payload.accessories = step5Data.accessories || null;
      } catch (error) {
        console.error("Error parsing step5 data:", error);
      }
      
      // Get data from appointment_step6_data
      try {
        const step6Data = JSON.parse(localStorage.getItem("appointment_step6_data") || "{}");
        payload.aadhaar_number = step6Data.aadhaar_number || null;
        payload.pan_number = step6Data.pan_number || null;
        payload.api_location = step6Data.live_location || null;
      } catch (error) {
        console.error("Error parsing step6 data:", error);
      }
      
      // Get vehicle data from sellFormData
      try {
        const sellFormData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
        payload.brand = sellFormData.brand || null;
        payload.year = sellFormData.year ? parseInt(sellFormData.year, 10) : null;
        payload.model = sellFormData.model || null;
        payload.variant = sellFormData.variant || null;
        payload.kilometers_driven = sellFormData.kilometersDriven ? parseInt(sellFormData.kilometersDriven, 10) : null;
      } catch (error) {
        console.error("Error parsing sellFormData:", error);
      }
      
      // Get city data
      payload.city = localStorage.getItem("selectedCity") || null;
      
      // Get phone number from user profile
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("userProfile_")) {
          try {
            const profile = JSON.parse(localStorage.getItem(key) || "{}");
            payload.phone_number = profile.phoneNumber || null;
          } catch (e) {
            console.error("Error parsing user profile:", e);
          }
        }
      });
      
      // Use confirmationData as fallback
      if (confirmationData) {
        if (!payload.brand) payload.brand = confirmationData.brand;
        if (!payload.year) payload.year = confirmationData.year ? parseInt(confirmationData.year, 10) : null;
        if (!payload.model) payload.model = confirmationData.model;
        if (!payload.variant) payload.variant = confirmationData.variant;
        if (!payload.kilometers_driven && confirmationData.kilometers) 
          payload.kilometers_driven = parseInt(confirmationData.kilometers, 10) || null;
        if (!payload.city) payload.city = confirmationData.city;
        if (!payload.vehicle_type) payload.vehicle_type = confirmationData.vehicleType;
        if (!payload.fuel_type) payload.fuel_type = confirmationData.fuelType;
        if (!payload.color) payload.color = confirmationData.color;
      }
      
      // Get uploaded file URLs
      try {
        const uploadedFileUrlsStr = localStorage.getItem("uploadedFileUrls");
        if (uploadedFileUrlsStr) {
          const parsedUrls = JSON.parse(uploadedFileUrlsStr);
          
          // Format photos as an object
          if (vehicle === "car") {
            payload.photos = {
              exterior: parsedUrls.Exterior || [],
              interior: parsedUrls.Interior || [],
              tyres: parsedUrls.Tyres || [],
              features: parsedUrls.Features || [],
              defects: parsedUrls.Defects || [],
              odometer: parsedUrls.Odometer || [],
              walkaround_video: parsedUrls["Walkaround video"] || []
            };
          } else {
            payload.photos = {
              front: parsedUrls.Front || [],
              rear: parsedUrls.Rear || [],
              left: parsedUrls.Left || [],
              right: parsedUrls.Right || [],
              defects: parsedUrls.Defects || [],
              odometer: parsedUrls.Odometer || [],
              walkaround_video: parsedUrls["Walkaround video"] || []
            };
          }
        }
      } catch (error) {
        console.error("Error parsing uploaded file URLs:", error);
        payload.photos = {};
      }
      
      // Add selected features
      payload.features = selectedFeatures || [];
      
      console.log("Submitting payload:", payload);
      
      // Insert data into the appropriate Supabase table
      const tableName = vehicle === 'car' ? 'car_seller_listings' : 'bike_seller_listings';
      const { data, error } = await supabase
        .from(tableName)
        .insert([payload]);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log(`${vehicle} listing published successfully`, data);
      toast.success(`${vehicle} listing has been published successfully!`);
      
      // Optional: Clear localStorage data after successful insertion
      // Uncomment if cleanup is desired
      /*
      localStorage.removeItem("appointment_step1_data");
      localStorage.removeItem("appointment_step2_data");
      localStorage.removeItem("appointment_step3_data");
      localStorage.removeItem("appointment_step5_data");
      localStorage.removeItem("appointment_step6_data");
      localStorage.removeItem("sellFormData");
      localStorage.removeItem("uploadedFileUrls");
      */
      
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

        {/* Document Checklist Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">To Post Ads Agree to give your Documents for</h3>
          <div className="space-y-3">
            {/* Always visible documents */}
            {showDocumentChecklist.insurance_document && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="insurance_document"
                  checked={documentChecklist.insurance_document}
                  onChange={(e) => handleDocumentCheckboxChange("insurance_document", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="insurance_document" className="text-sm">Insurance Document</label>
              </div>
            )}
            
            {showDocumentChecklist.puc_certificate && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="puc_certificate"
                  checked={documentChecklist.puc_certificate}
                  onChange={(e) => handleDocumentCheckboxChange("puc_certificate", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="puc_certificate" className="text-sm">PUC Certificate</label>
              </div>
            )}
            
            {showDocumentChecklist.road_tax_status && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="road_tax_status"
                  checked={documentChecklist.road_tax_status}
                  onChange={(e) => handleDocumentCheckboxChange("road_tax_status", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="road_tax_status" className="text-sm">Road Tax Status</label>
              </div>
            )}
            
            {/* Conditional documents */}
            {showDocumentChecklist.battery_health_proof && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="battery_health_proof"
                  checked={documentChecklist.battery_health_proof}
                  onChange={(e) => handleDocumentCheckboxChange("battery_health_proof", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="battery_health_proof" className="text-sm">Battery Health Proof</label>
              </div>
            )}
            
            {showDocumentChecklist.loan_noc_document && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="loan_noc_document"
                  checked={documentChecklist.loan_noc_document}
                  onChange={(e) => handleDocumentCheckboxChange("loan_noc_document", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="loan_noc_document" className="text-sm">Loan NOC Document</label>
              </div>
            )}
            
            {showDocumentChecklist.warranty_document && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="warranty_document"
                  checked={documentChecklist.warranty_document}
                  onChange={(e) => handleDocumentCheckboxChange("warranty_document", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-2"
                />
                <label htmlFor="warranty_document" className="text-sm">Warranty Document</label>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setIsConfirmationView(false)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pricing
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white"
            onClick={handlePublishListing}
            disabled={isSubmitting || !areAllDocumentsChecked()}
          >
            {isSubmitting ? "Publishing..." : "Listing Published Successfully"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
