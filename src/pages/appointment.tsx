import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProgressBar from "@/components/appointment/ProgressBar";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import PriceInput from "@/components/appointment/PriceInput";
import Pricing from "@/components/appointment/Pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, AlertCircle, CheckCircle, MapPin, Upload } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// API key stored in a constant
const OPENCAGE_API_KEY = "9de658a249b54e55a10ea5310398f9b4";

// Define all step types
type AppointmentStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type StepData = Record<string, any>;

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AppointmentStep>(0);
  const [expectedPrice, setExpectedPrice] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [stepData, setStepData] = useState<Record<number, StepData>>({});
  const [isElectric, setIsElectric] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get vehicle type from localStorage on component mount
  useEffect(() => {
    const storedVehicleType = localStorage.getItem("vehicle");
    if (storedVehicleType === "car" || storedVehicleType === "bike") {
      setVehicleType(storedVehicleType);
    }
    
    // Load any previously saved step data from localStorage
    for (let i = 1; i <= 6; i++) {
      const data = localStorage.getItem(`appointment_step${i}_data`);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setStepData(prev => ({...prev, [i-1]: parsedData}));
          
          // Check if the vehicle is electric
          if (i === 2 && parsedData.fuel_type === "Electric") {
            setIsElectric(true);
          }
        } catch (error) {
          console.error(`Error parsing step ${i} data:`, error);
        }
      }
    }
  }, []);
  
  const steps = [
    "Basic Vehicle Info",
    "Ownership & Usage",
    "Vehicle Condition",
    "Upload Photos",
    "Seller Details",
    "Verification",
    "Payment"
  ];
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleNext = async () => {
    if (await validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePriceSubmit = (price: string, features: string[]) => {
    onSubmit(price, features);
    navigate("/listings");
  };
  
  const onSubmit = (price: string, features: string[]) => {
    setExpectedPrice(price);
    setSelectedFeatures(features);
    toast.success("Your expected price has been submitted!");
  };
  
  const handleInputChange = (field: string, value: any) => {
    setStepData(prev => ({
      ...prev,
      [currentStep]: {
        ...prev[currentStep],
        [field]: value
      }
    }));
    
    // Save to localStorage
    localStorage.setItem(`appointment_step${currentStep+1}_data`, JSON.stringify({
      ...stepData[currentStep],
      [field]: value
    }));
  };
  
  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 0:
        // Step 1 validation: registration_number, rto_state, rto, body_type
        if (!stepData[0]?.registration_number || !stepData[0]?.rto_state || !stepData[0]?.rto || !stepData[0]?.body_type) {
          toast.error("Please fill in all required fields in Basic Vehicle Info.");
          return false;
        }
        break;
      case 1:
        // Step 2 validation: number_of_owners, fuel_type
        if (!stepData[1]?.number_of_owners || !stepData[1]?.fuel_type) {
          toast.error("Please fill in all required fields in Ownership & Usage.");
          return false;
        }
        break;
      case 2:
        // Step 3 validation: odometer_reading, scratches, dents, tyre_condition
        if (!stepData[2]?.odometer_reading || !stepData[2]?.scratches || !stepData[2]?.dents || !stepData[2]?.tyre_condition) {
          toast.error("Please fill in all required fields in Vehicle Condition.");
          return false;
        }
        break;
      case 4:
        // Step 5 validation: seller_name, phone_number, location_pincode, location_city
        if (!stepData[4]?.seller_name || !stepData[4]?.phone_number || !stepData[4]?.location_pincode || !stepData[4]?.location_city) {
          toast.error("Please fill in all required fields in Seller Details.");
          return false;
        }
        break;
      case 5:
        // Step 6 validation: verification_option
        if (!stepData[5]?.verification_option) {
          toast.error("Please select a verification option.");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };
  
  const renderStepFive = () => {
    const data = stepData[4] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Seller Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Seller Name <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.seller_name || ""}
              onChange={(e) => handleInputChange("seller_name", e.target.value)}
              placeholder="Enter seller name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input 
              type="tel"
              value={data.phone_number || ""}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Location Pincode <span className="text-red-500">*</span>
            </label>
            <Input 
              type="number"
              value={data.location_pincode || ""}
              onChange={(e) => handleInputChange("location_pincode", e.target.value)}
              placeholder="Enter location pincode"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Location City <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.location_city || ""}
              onChange={(e) => handleInputChange("location_city", e.target.value)}
              placeholder="Enter location city"
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepSix = () => {
    const data = stepData[5] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Verification</h3>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Verification Option <span className="text-red-500">*</span>
          </label>
          <Select 
            value={data.verification_option || ""}
            onValueChange={(value) => handleInputChange("verification_option", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Verification Option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aadhar OTP">Aadhar OTP</SelectItem>
              <SelectItem value="PAN Card">PAN Card</SelectItem>
              <SelectItem value="Driving License">Driving License</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };
  
  const renderStepThree = () => {
    const data = stepData[2] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Vehicle Condition</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Odometer Reading (in km) <span className="text-red-500">*</span>
            </label>
            <Input 
              type="number"
              value={data.odometer_reading || ""}
              onChange={(e) => handleInputChange("odometer_reading", e.target.value)}
              placeholder="Enter odometer reading"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Scratches <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.scratches || ""}
              onValueChange={(value) => handleInputChange("scratches", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Scratches Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Minor">Minor</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Major">Major</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Dents <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.dents || ""}
              onValueChange={(value) => handleInputChange("dents", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Dents Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Minor">Minor</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Major">Major</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Tyre Condition <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.tyre_condition || ""}
              onValueChange={(value) => handleInputChange("tyre_condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Tyre Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Worn">Worn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Battery Health
            </label>
            <Input 
              value={data.battery_health || ""}
              onChange={(e) => handleInputChange("battery_health", e.target.value)}
              placeholder="Enter Battery Health"
              disabled={!isElectric}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Loan Status
            </label>
            <Select 
              value={data.loan_status || ""}
              onValueChange={(value) => handleInputChange("loan_status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Loan Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes-got NOC">Yes - Got NOC</SelectItem>
                <SelectItem value="Yes-in process">Yes - In Process</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Warranty Status
            </label>
            <Select 
              value={data.warranty_status || ""}
              onValueChange={(value) => handleInputChange("warranty_status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Warranty Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                <SelectItem value="At Present">At Present</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepFour = () => {
    return (
      <PhotoUpload 
        onBack={handleBack} 
        onNext={handleNext}
      />
    );
  };
  
  // Now let's update the renderCurrentStep function to include all steps
  const renderCurrentStep = () => {
    switch(currentStep) {
      case 0:
        return renderStepOne();
      case 1:
        return renderStepTwo();
      case 2:
        return renderStepThree();
      case 3:
        return renderStepFour();
      case 4:
        return renderStepFive();
      case 5:
        return renderStepSix();
      case 6:
        return (
          <Pricing 
            onBack={handleBack} 
            onSubmit={handlePriceSubmit}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ProgressBar currentStep={currentStep} steps={steps} />
        
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
          {renderCurrentStep()}
          
          {/* Navigation buttons - don't show for steps with custom handling */}
          {currentStep !== 3 && currentStep !== 6 && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
              
              <Button 
                onClick={handleNext}
              >
                {currentStep === 5 ? "Go to Pricing" : "Next"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;
