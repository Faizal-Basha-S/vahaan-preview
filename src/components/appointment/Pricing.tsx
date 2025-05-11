
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PriceInput from "./PriceInput";
import Confirmation from "./Confirmation";

interface PricingProps {
  onBack: () => void;
  onSubmit: (price: string, features: string[]) => void;
}

const Pricing: React.FC<PricingProps> = ({ onBack, onSubmit }) => {
  const [priceOption, setPriceOption] = useState<"recommended" | "custom">("recommended");
  const [customPrice, setCustomPrice] = useState<string>("");
  const [recommendedPrice, setRecommendedPrice] = useState<string>("450,000");
  const [isConfirmationView, setIsConfirmationView] = useState<boolean>(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [checkedDocuments, setCheckedDocuments] = useState<Record<string, boolean>>({
    insurance_document: false,
    puc_certificate: false,
    road_tax_status: false,
  });
  
  // Extract vehicle type from localStorage
  const vehicleType = localStorage.getItem("vehicle") || "car";
  const isBike = vehicleType === "bike";
  
  useEffect(() => {
    // Set available features based on vehicle type
    if (isBike) {
      setAvailableFeatures([
        "ABS",
        "Disc Brakes",
        "Digital Console",
        "Electric Start",
        "LED Lights",
        "Tubeless Tires"
      ]);
    } else {
      setAvailableFeatures([
        "ABS",
        "Sunroof",
        "Leather Seats",
        "Power Windows",
        "Rear AC",
        "Push Start Button",
        "Touch Screen",
        "Cruise Control",
        "Keyless Entry",
        "Automatic Climate Control"
      ]);
    }
    
    // Calculate a random price (in a real app this would come from back-end)
    const basePrice = isBike ? 75000 : 450000;
    const randomFactor = Math.random() * 0.3 + 0.85; // Random factor between 0.85 and 1.15
    setRecommendedPrice(Math.round(basePrice * randomFactor).toLocaleString("en-IN"));
  }, [isBike]);
  
  // Extract confirmation data for the conditional checkboxes
  useEffect(() => {
    // Load conditional data from localStorage
    try {
      // Setup initial document checkboxes
      const newCheckedDocuments = {
        insurance_document: false,
        puc_certificate: false,
        road_tax_status: false
      };
      
      // Check for battery health condition
      const step2DataStr = localStorage.getItem("appointment_step2_data");
      if (step2DataStr) {
        const step2Data = JSON.parse(step2DataStr);
        if (step2Data.battery_health && step2Data.battery_health.trim() !== "") {
          newCheckedDocuments["battery_health_proof"] = false;
        }
      }
      
      // Check for loan NOC condition
      const step3DataStr = localStorage.getItem("appointment_step3_data");
      if (step3DataStr) {
        const step3Data = JSON.parse(step3DataStr);
        if (step3Data.loan_status === "Yes-got NOC" || step3Data.loan_status === "Yes - Got NOC") {
          newCheckedDocuments["loan_noc_document"] = false;
        }
        
        // Check for warranty condition
        if (step3Data.warranty_status === "At Present") {
          newCheckedDocuments["warranty_document"] = false;
        }
      }
      
      setCheckedDocuments(newCheckedDocuments);
    } catch (error) {
      console.error("Error loading conditional document data:", error);
    }
  }, []);
  
  const handleToggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature) 
        : [...prev, feature]
    );
  };
  
  const toggleDocument = (document: string) => {
    setCheckedDocuments(prev => ({
      ...prev,
      [document]: !prev[document]
    }));
  };
  
  const handlePriceSubmit = () => {
    const price = priceOption === "recommended" ? recommendedPrice : customPrice;
    
    // Store the selected features in localStorage
    localStorage.setItem("key_features", JSON.stringify(selectedFeatures));
    localStorage.setItem("seller_price", price.replace(/,/g, ""));
    
    // Check if using dialog or direct submission
    if (dialogOpen) {
      // Validate that all documents are checked
      const allDocumentsChecked = Object.values(checkedDocuments).every(checked => checked);
      if (!allDocumentsChecked) {
        toast.error("Please agree to provide all required documents");
        return;
      }
      
      // Close dialog and proceed
      setDialogOpen(false);
      onSubmit(price, selectedFeatures);
    } else {
      setDialogOpen(true);
    }
  };
  
  const handleCustomPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and format with commas
    const value = event.target.value.replace(/,/g, "");
    if (/^\d*$/.test(value)) {
      setCustomPrice(Number(value).toLocaleString("en-IN"));
    }
  };
  
  // If in confirmation view, show the confirmation component
  if (isConfirmationView) {
    const price = priceOption === "recommended" ? recommendedPrice : customPrice;
    
    // Prepare confirmation data
    const confirmationData = {
      phoneNumber: "",
      brand: "",
      year: "",
      model: "",
      variant: "",
      kilometers: "",
      city: "",
      vehicleType: isBike ? "Bike" : "Car",
      fuelType: "",
      transmission: "",
      color: "",
      mileage: "",
      seats: "",
      safetyRating: "",
      cc: "",
      airbags: "",
      cylinders: "",
      wheelDrive: ""
    };
    
    // Attempt to load data from localStorage
    try {
      const sellFormDataStr = localStorage.getItem("sellFormData");
      if (sellFormDataStr) {
        const sellFormData = JSON.parse(sellFormDataStr);
        Object.assign(confirmationData, {
          brand: sellFormData.brand || "",
          year: sellFormData.year || "",
          model: sellFormData.model || "",
          variant: sellFormData.variant || ""
        });
      }
      
      // Load data from appointment steps
      [1, 2, 3, 4, 5].forEach(step => {
        const dataStr = localStorage.getItem(`appointment_step${step}_data`);
        if (dataStr) {
          try {
            const stepData = JSON.parse(dataStr);
            
            // Map relevant data based on step
            if (step === 1) { // Basic Vehicle Info
              // No relevant fields to map here
            } else if (step === 2) { // Ownership & Usage
              Object.assign(confirmationData, {
                fuelType: stepData.fuel_type || "",
                color: stepData.color || "",
                kilometers: stepData.kilometers || ""
              });
            } else if (step === 3) { // Vehicle Condition
              // No relevant fields to map here
            } else if (step === 5) { // Seller Details
              Object.assign(confirmationData, {
                phoneNumber: stepData.phone_number || "",
                city: stepData.location_city || ""
              });
            }
          } catch (error) {
            console.error(`Error parsing step ${step} data:`, error);
          }
        }
      });
    } catch (error) {
      console.error("Error loading confirmation data:", error);
    }
    
    return (
      <Confirmation 
        confirmationData={confirmationData}
        isBike={isBike}
        formattedPrice={priceOption === "recommended" ? recommendedPrice : customPrice}
        selectedFeatures={selectedFeatures}
        setIsConfirmationView={setIsConfirmationView}
      />
    );
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Set Your Price & Features</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Price Options</h3>
          
          <RadioGroup 
            value={priceOption} 
            onValueChange={(value) => setPriceOption(value as "recommended" | "custom")}
            className="space-y-4"
          >
            <div className={`flex items-start space-x-3 border rounded-lg p-4 ${priceOption === "recommended" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
              <RadioGroupItem value="recommended" id="recommended" />
              <div className="flex-1">
                <Label htmlFor="recommended" className="font-medium">
                  Recommended Price
                </Label>
                <p className="mt-1 text-xl font-bold">
                  ₹ {recommendedPrice}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Our algorithm calculated this price based on market trends and your vehicle details
                </p>
              </div>
            </div>
            
            <div className={`flex items-start space-x-3 border rounded-lg p-4 ${priceOption === "custom" ? "border-primary bg-primary/5" : "border-gray-200"}`}>
              <RadioGroupItem value="custom" id="custom" />
              <div className="flex-1">
                <Label htmlFor="custom" className="font-medium">
                  Enter Your Price
                </Label>
                <div className="mt-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-gray-500">₹</span>
                    </div>
                    <Input 
                      value={customPrice}
                      onChange={handleCustomPriceChange}
                      className="pl-7"
                      placeholder="Enter amount"
                      disabled={priceOption !== "custom"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Vehicle Features</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Select the features that your vehicle has to stand out in listings
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableFeatures.map((feature) => (
              <div 
                key={feature}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedFeatures.includes(feature) ? "border-primary bg-primary/5" : "border-gray-200 hover:bg-gray-50"}`}
                onClick={() => handleToggleFeature(feature)}
              >
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={() => handleToggleFeature(feature)}
                  />
                  <span>{feature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-4 flex justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setDialogOpen(true)}>List for Free</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>To Post Ads Agree to give your Documents for</DialogTitle>
                <DialogDescription>
                  Please confirm you can provide the following documents
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {Object.entries(checkedDocuments).map(([document, checked]) => (
                  <div className="flex items-center space-x-2" key={document}>
                    <Checkbox 
                      id={document} 
                      checked={checked} 
                      onCheckedChange={() => toggleDocument(document)}
                    />
                    <label 
                      htmlFor={document}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {document.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </label>
                  </div>
                ))}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePriceSubmit} className="bg-green-500 hover:bg-green-600 text-white">
                  Listing Published Successfully
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button className="bg-primary" onClick={() => setIsConfirmationView(true)}>
            Preview & Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
