
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, BadgeDollarSign, Car, Handshake, Shield, Lock, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  warrantyStatus: string | null; // Added to store warranty status
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
    warrantyStatus: null, // Added to store warranty status
  });
  
  // State for document checkboxes
  const [documents, setDocuments] = useState({
    insurance: false,
    batteryHealth: false,
    loanNOC: false,
    warranty: false,
    pucCertificate: false,
    roadTaxStatus: false
  });
  
  useEffect(() => {
    // Load data from localStorage for confirmation view
    if (isConfirmationView) {
      // Get regular localStorage data
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
        warrantyStatus: localStorage.getItem('warranty_status'), // Get warranty status from localStorage
      };
      
      // Also get data from sellFormData
      try {
        const sellFormData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
        
        // Update data with sellFormData values if they exist
        if (sellFormData.brand) data.brand = sellFormData.brand;
        if (sellFormData.year) data.year = sellFormData.year;
        if (sellFormData.model) data.model = sellFormData.model;
        if (sellFormData.variant) data.variant = sellFormData.variant;
        if (sellFormData.kilometersDriven) data.kilometers = sellFormData.kilometersDriven;
        if (sellFormData.city) data.city = sellFormData.city;
      } catch (error) {
        console.error("Error parsing sellFormData:", error);
      }
      
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
  
  const handleDocumentChange = (documentName: keyof typeof documents) => {
    setDocuments(prev => ({
      ...prev,
      [documentName]: !prev[documentName]
    }));
  };
  
  const handleProceedToPay = () => {
    // If the promo is applied, show the confirmation view
    if (promoApplied) {
      // Save additional data to localStorage for bike listings
      const vehicleType = localStorage.getItem("vehicle");
      if (vehicleType === "bike") {        
        // Get data from forms/input fields if available
        // For example, from sellFormData
        try {
          const sellFormData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
          if (sellFormData.mileage) localStorage.setItem("mileage", sellFormData.mileage);
          if (sellFormData.color) localStorage.setItem("color", sellFormData.color);
          if (sellFormData.cc) localStorage.setItem("cc", sellFormData.cc);
        } catch (error) {
          console.error("Error parsing sellFormData:", error);
        }
      }
      
      setIsConfirmationView(true);
      return;
    }
    
    // This will be integrated with Razorpay in a future phase
    toast.info("Payment integration will be available in a future update");
  };
  
  const handlePublishListing = () => {
    // Check if all documents are selected
    const requiredDocs = Object.entries(documents)
      .filter(([key, value]) => {
        // Skip warranty document check if warranty status is not "At Present"
        if (key === "warranty" && confirmationData.warrantyStatus !== "At Present") {
          return false;
        }
        return !value;
      })
      .map(([key]) => key);
    
    if (requiredDocs.length > 0) {
      toast.error("Please agree to provide all required documents");
      return;
    }
    
    // Save document agreement to localStorage
    localStorage.setItem("document_agreement", JSON.stringify(documents));
    
    // Show success message
    toast.success("Your listing has been published successfully!");
    
    // Reset confirmation view
    setIsConfirmationView(false);
  };
  
  // Format the expected price for display
  const formattedPrice = expectedPrice 
    ? new Intl.NumberFormat("en-IN").format(parseInt(expectedPrice))
    : "0";
    
  // Check if vehicle is a bike
  const isBike = localStorage.getItem("vehicle") === "bike";
  
  // Custom document confirmation view
  const renderDocumentConfirmation = () => {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2">To Post Ads Agree to give your Documents for</h2>
        <p className="text-gray-500 mb-6">Please confirm that you will provide the following documents</p>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="document-insurance"
              checked={documents.insurance}
              onCheckedChange={() => handleDocumentChange('insurance')}
            />
            <Label htmlFor="document-insurance">Insurance document</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="document-battery"
              checked={documents.batteryHealth}
              onCheckedChange={() => handleDocumentChange('batteryHealth')}
            />
            <Label htmlFor="document-battery">Battery health proof</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="document-loan"
              checked={documents.loanNOC}
              onCheckedChange={() => handleDocumentChange('loanNOC')}
            />
            <Label htmlFor="document-loan">Loan NOC document</Label>
          </div>
          
          {confirmationData.warrantyStatus === "At Present" && (
            <div className="flex items-center space-x-3">
              <Checkbox
                id="document-warranty"
                checked={documents.warranty}
                onCheckedChange={() => handleDocumentChange('warranty')}
              />
              <Label htmlFor="document-warranty">Warranty Document</Label>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="document-puc"
              checked={documents.pucCertificate}
              onCheckedChange={() => handleDocumentChange('pucCertificate')}
            />
            <Label htmlFor="document-puc">PUC Certificate</Label>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="document-roadtax"
              checked={documents.roadTaxStatus}
              onCheckedChange={() => handleDocumentChange('roadTaxStatus')}
            />
            <Label htmlFor="document-roadtax">Road tax status</Label>
          </div>
        </div>
        
        <Button 
          onClick={handlePublishListing}
          className="w-full py-2 bg-green-600 hover:bg-green-700"
        >
          Listing publish successfully
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setIsConfirmationView(false)}
          className="w-full mt-4"
        >
          Go back
        </Button>
      </div>
    );
  };
  
  // Render confirmation component if payment is successful
  if (isConfirmationView) {
    return renderDocumentConfirmation();
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
