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
    if (currentStep === 0) {
      // Go back to sell page
      navigate("/sell");
    } else {
      setCurrentStep(prev => (prev - 1) as AppointmentStep);
    }
  };
  
  const handleNext = () => {
    // Validate current step
    if (validateCurrentStep()) {
      // Save current step data
      saveCurrentStepData();
      
      // Move to next step
      setCurrentStep(prev => (prev + 1) as AppointmentStep);
    }
  };
  
  const handlePriceSubmit = (price: string, features: string[]) => {
    setExpectedPrice(price);
    setSelectedFeatures(features);
    
    // Store price and features in localStorage
    localStorage.setItem("seller_price", price);
    localStorage.setItem("key_features", JSON.stringify(features));
    
    handleNext();
  };
  
  const validateCurrentStep = (): boolean => {
    const currentFormData = stepData[currentStep] || {};

    // Validate based on current step
    switch (currentStep) {
      case 0: // Basic Vehicle Info
        if (!currentFormData.registration_number || !currentFormData.rto || !currentFormData.body_type) {
          toast.error("Please fill all mandatory fields marked with *");
          return false;
        }
        break;
      case 1: // Ownership & Usage
        if (!currentFormData.number_of_owners || !currentFormData.fuel_type || !currentFormData.color) {
          toast.error("Please fill all mandatory fields marked with *");
          return false;
        }
        break;
      case 2: // Vehicle Condition - no mandatory fields
        break;
      case 3: // Photo Upload - validation happens in the component
        break;
      case 4: // Seller Details
        if (!currentFormData.seller_name || !currentFormData.phone_number || !currentFormData.location_city) {
          toast.error("Please fill all mandatory fields marked with *");
          return false;
        }
        break;
      case 5: // Verification
        if (
          (!currentFormData.aadhaar_number && !currentFormData.pan_number) || 
          !locationDetails
        ) {
          toast.error("Please provide either Aadhaar or PAN, and verify your location");
          return false;
        }
        
        // Validate Aadhaar (must be exactly 16 digits)
        if (currentFormData.aadhaar_number && !/^\d{16}$/.test(currentFormData.aadhaar_number)) {
          toast.error("Aadhaar number must be exactly 16 digits");
          return false;
        }
        
        // Validate PAN (must follow standard Indian PAN format)
        if (currentFormData.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(currentFormData.pan_number)) {
          toast.error("PAN must be in correct format (e.g., ABCDE1234F)");
          return false;
        }
        break;
      case 6: // Payment - validation happens in the component
        break;
      default:
        return true;
    }
    
    return true;
  };
  
  const saveCurrentStepData = () => {
    const currentFormData = stepData[currentStep] || {};
    
    // Save to localStorage
    localStorage.setItem(`appointment_step${currentStep + 1}_data`, JSON.stringify(currentFormData));
    
    // Additional logic for specific steps
    if (currentStep === 1 && currentFormData.fuel_type === "Electric") {
      setIsElectric(true);
    }
  };
  
  const updateStepData = (data: StepData) => {
    setStepData(prev => ({...prev, [currentStep]: {...(prev[currentStep] || {}), ...data}}));
  };
  
  const handleInputChange = (field: string, value: any) => {
    updateStepData({[field]: value});
  };

  // Function to fetch location using OpenCage Geocoder API
  const fetchLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error("Failed to fetch location details");
          }
          
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const locationData = data.results[0];
            setLocationDetails(locationData);
            
            // Save location data to stepData
            updateStepData({
              live_location: {
                latitude,
                longitude,
                formatted_address: locationData.formatted,
                components: locationData.components
              }
            });
            
            toast.success("Location verified successfully!");
          } else {
            toast.error("Could not determine your location");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          toast.error("Failed to fetch location details");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to get your location. Please check your browser permissions.");
        setIsLoading(false);
      }
    );
  };
  
  // Calculate the current progress step for the ProgressBar
  const progressStep = currentStep;
  
  const renderStepOne = () => {
    const data = stepData[0] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Basic Vehicle Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.registration_number || ""}
              onChange={(e) => handleInputChange("registration_number", e.target.value)}
              placeholder="Enter registration number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              RTO <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Select 
                value={data.rto_state || ""}
                onValueChange={(value) => handleInputChange("rto_state", value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={data.rto || ""}
                onValueChange={(value) => handleInputChange("rto", value)}
                disabled={!data.rto_state}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select RTO" />
                </SelectTrigger>
                <SelectContent>
                  {data.rto_state === "Karnataka" && (
                    <>
                      <SelectItem value="KA-01">KA-01 (Bangalore Central)</SelectItem>
                      <SelectItem value="KA-02">KA-02 (Bangalore West)</SelectItem>
                      <SelectItem value="KA-03">KA-03 (Bangalore East)</SelectItem>
                      <SelectItem value="KA-04">KA-04 (Bangalore North)</SelectItem>
                      <SelectItem value="KA-05">KA-05 (Bangalore South)</SelectItem>
                    </>
                  )}
                  {data.rto_state === "Tamil Nadu" && (
                    <>
                      <SelectItem value="TN-01">TN-01 (Chennai Central)</SelectItem>
                      <SelectItem value="TN-02">TN-02 (Chennai North East)</SelectItem>
                      <SelectItem value="TN-03">TN-03 (Chennai North)</SelectItem>
                      <SelectItem value="TN-04">TN-04 (Chennai East)</SelectItem>
                      <SelectItem value="TN-05">TN-05 (Chennai South)</SelectItem>
                    </>
                  )}
                  {/* Add more states and RTOs as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Body Type <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.body_type || ""}
              onValueChange={(value) => handleInputChange("body_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Body Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
                <SelectItem value="Crossover">Crossover</SelectItem>
                <SelectItem value="MPV">MPV</SelectItem>
                <SelectItem value="Coupe">Coupe</SelectItem>
                <SelectItem value="Convertible">Convertible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Engine CC
            </label>
            <Input 
              type="number"
              value={data.engine_cc || ""}
              onChange={(e) => handleInputChange("engine_cc", e.target.value)}
              placeholder="Enter Engine CC"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Load Capacity
            </label>
            <Input 
              value={data.load_capacity || ""}
              onChange={(e) => handleInputChange("load_capacity", e.target.value)}
              placeholder="Enter load capacity"
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepTwo = () => {
    const data = stepData[1] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Ownership & Usage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Owners <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.number_of_owners || ""}
              onValueChange={(value) => handleInputChange("number_of_owners", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Number of Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5+">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Ownership Type
            </label>
            <Select 
              value={data.ownership_type || ""}
              onValueChange={(value) => handleInputChange("ownership_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ownership Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Own board">Own board</SelectItem>
                <SelectItem value="T-board">T-board</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Insurance Validity
            </label>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={"w-full justify-start text-left font-normal"}
                  >
                    {date ? format(date, "PPP") : "Pick a date"}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      handleInputChange("insurance_validity", newDate ? format(newDate, "yyyy-MM-dd") : null);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Service History Documents
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="service-history" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF or images (MAX. 5MB)</p>
                </div>
                <input 
                  id="service-history" 
                  type="file" 
                  accept=".pdf,image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleInputChange("service_history_docs", e.target.files[0].name);
                    }
                  }} 
                />
              </label>
            </div>
            {data.service_history_docs && (
              <p className="text-sm text-green-600 mt-1">File selected: {data.service_history_docs}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Fuel Type <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.fuel_type || ""}
              onValueChange={(value) => {
                handleInputChange("fuel_type", value);
                setIsElectric(value === "Electric");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="CNG">CNG</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="LPG">LPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Transmission Type
            </label>
            <Select 
              value={data.transmission_type || ""}
              onValueChange={(value) => handleInputChange("transmission_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Transmission Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
                <SelectItem value="AMT">AMT</SelectItem>
                <SelectItem value="DCT">DCT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Color <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.color || ""}
              onChange={(e) => handleInputChange("color", e.target.value)}
              placeholder="Enter vehicle color"
            />
          </div>
          
          {isElectric && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Battery Health
              </label>
              <Select 
                value={data.battery_health || ""}
                onValueChange={(value) => handleInputChange("battery_health", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Battery Health" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent (greater than 90%)">Excellent (&gt; 90%)</SelectItem>
                  <SelectItem value="Good (75-90%)">Good (75-90%)</SelectItem>
                  <SelectItem value="Average (60-75%)">Average (60-75%)</SelectItem>
                  <SelectItem value="Poor (less than 60%)">Poor (&lt; 60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Any Modifications
            </label>
            <Textarea 
              value={data.modifications || ""}
              onChange={(e) => handleInputChange("modifications", e.target.value)}
              placeholder="Enter details of any modifications made to the vehicle"
              className="h-24"
            />
          </div>
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
                <SelectItem value="No">No Loan</SelectItem>
                <SelectItem value="Yes-not completed">Yes - Not Completed</SelectItem>
                <SelectItem value="Yes-got NOC">Yes - Got NOC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Tire Condition
            </label>
            <Select 
              value={data.tire_condition || ""}
              onValueChange={(value) => handleInputChange("tire_condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Tire Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Bad">Bad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isElectric && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Battery Condition
              </label>
              <Select 
                value={data.battery_condition || ""}
                onValueChange={(value) => handleInputChange("battery_condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Battery Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Bad">Bad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Permit Type
            </label>
            <Select 
              value={data.permit_type || ""}
              onValueChange={(value) => handleInputChange("permit_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Permit Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="National">National</SelectItem>
                <SelectItem value="State">State</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Fitness Certificate
            </label>
            <Select 
              value={data.fitness_certificate || ""}
              onValueChange={(value) => handleInputChange("fitness_certificate", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Accident History
            </label>
            <Textarea 
              value={data.accident_history || ""}
              onChange={(e) => handleInputChange("accident_history", e.target.value)}
              placeholder="Enter details of any accidents the vehicle has been in"
              className="h-24"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Major Replacements
            </label>
            <Textarea 
              value={data.major_replacements || ""}
              onChange={(e) => handleInputChange("major_replacements", e.target.value)}
              placeholder="Enter details of any major parts replaced"
              className="h-24"
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepFour = () => {
    // Enhanced version of PhotoUpload with additional buttons
    return (
      <div className="space-y-6">
        <PhotoUpload onBack={handleBack} onNext={handleNext} />
        
        {/* Additional buttons for odometer photo and walkaround video */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Additional Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Odometer Photo
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="odometer-photo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> odometer photo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input 
                    id="odometer-photo" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        // Store in localStorage using the same pattern as the main component
                        const uploadedFileUrls = JSON.parse(localStorage.getItem("uploadedFileUrls") || "{}");
                        uploadedFileUrls.odometer = [URL.createObjectURL(e.target.files[0])];
                        localStorage.setItem("uploadedFileUrls", JSON.stringify(uploadedFileUrls));
                        
                        toast.success("Odometer photo uploaded successfully!");
                      }
                    }} 
                  />
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Walkaround Video
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="walkaround-video" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> walkaround video
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">MP4, MOV or AVI (MAX. 100MB)</p>
                  </div>
                  <input 
                    id="walkaround-video" 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        // Store in localStorage using the same pattern as the main component
                        const uploadedFileUrls = JSON.parse(localStorage.getItem("uploadedFileUrls") || "{}");
                        uploadedFileUrls.walkaround_video = [URL.createObjectURL(e.target.files[0])];
                        localStorage.setItem("uploadedFileUrls", JSON.stringify(uploadedFileUrls));
                        
                        toast.success("Walkaround video uploaded successfully!");
                      }
                    }} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.phone_number || ""}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              placeholder="Enter your phone number"
              type="tel"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Location City <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.location_city || ""}
              onValueChange={(value) => handleInputChange("location_city", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Kolkata">Kolkata</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                <SelectItem value="Jaipur">Jaipur</SelectItem>
                <SelectItem value="Lucknow">Lucknow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Preferred Contact Time
            </label>
            <Select 
              value={data.preferred_contact_time || ""}
              onValueChange={(value) => handleInputChange("preferred_contact_time", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Preferred Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Anytime">Anytime</SelectItem>
                <SelectItem value="Above 9 AM">Above 9 AM</SelectItem>
                <SelectItem value="3 PM">3 PM</SelectItem>
                <SelectItem value="7 PM">7 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Reason for Sale
            </label>
            <Textarea 
              value={data.reason_for_sale || ""}
              onChange={(e) => handleInputChange("reason_for_sale", e.target.value)}
              placeholder="Why are you selling this vehicle?"
              className="h-24"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Additional Accessories
            </label>
            <Textarea 
              value={data.accessories || ""}
              onChange={(e) => handleInputChange("accessories", e.target.value)}
              placeholder="List any additional accessories included with the vehicle"
              className="h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Warranty Details
            </label>
            <Select 
              value={data.warranty_details || ""}
              onValueChange={(value) => handleInputChange("warranty_details", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isElectric && (
            <div>
              <label className="block text-sm font-medium mb-1">
                EV Charger Included
              </label>
              <Select 
                value={data.ev_charger_included || ""}
                onValueChange={(value) => handleInputChange("ev_charger_included", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderStepSix = () => {
    const data = stepData[5] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Verification & Legal Compliance</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Important Note</h4>
                <p className="text-sm mt-1">
                  To ensure legal compliance and verify your identity, we require either your Aadhaar or PAN details. 
                  This information will be securely stored and only used for verification purposes.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Identification Document <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Aadhaar Number (16 digits)
                </label>
                <Input 
                  value={data.aadhaar_number || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                    handleInputChange("aadhaar_number", value);
                  }}
                  placeholder="Enter Aadhaar number"
                  maxLength={16}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  OR PAN Number
                </label>
                <Input 
                  value={data.pan_number || ""}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().slice(0, 10);
                    handleInputChange("pan_number", value);
                  }}
                  placeholder="Enter PAN number"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Location Verification <span className="text-red-500">*</span>
            </label>
            
            <Button 
              onClick={fetchLocation}
              disabled={isLoading}
              className="flex items-center gap-2"
              type="button"
            >
              <MapPin className="h-4 w-4" />
              {isLoading ? "Verifying Location..." : "Verify My Current Location"}
            </Button>
            
            {locationDetails && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-md">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Location Verified</h4>
                    <p className="text-sm mt-1">
                      Address: {locationDetails.formatted}
                    </p>
                    {locationDetails.components.city && (
                      <p className="text-xs mt-1">
                        City: {locationDetails.components.city}
                      </p>
                    )}
                    {locationDetails.components.state && (
                      <p className="text-xs">
                        State: {locationDetails.components.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <input
                id="terms-agree"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={data.terms_agreed || false}
                onChange={(e) => handleInputChange("terms_agreed", e.target.checked)}
              />
              <label htmlFor="terms-agree" className="ml-2 block text-sm">
                I confirm that the information provided above is accurate and I agree to the 
                <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer"> Terms of Service</a> and 
                <a href="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepSeven = () => {
    // Reuse existing components for Payment & Confirmation
    return (
      <Pricing
        onBack={handleBack}
        expectedPrice={expectedPrice}
        selectedFeatures={selectedFeatures}
      />
    );
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Vehicle Info
        return renderStepOne();
      case 1: // Ownership & Usage
        return renderStepTwo();
      case 2: // Vehicle Condition
        return renderStepThree();
      case 3: // Upload Photos
        return renderStepFour();
      case 4: // Seller Details
        return renderStepFive();
      case 5: // Verification
        return renderStepSix();
      case 6: // Payment and Confirmation
        return renderStepSeven();
      default:
        return null;
    }
  };
  
  // Navigation buttons
  const renderNavigationButtons = () => {
    if (currentStep === 3 || currentStep === 6) {
      // These steps have their own navigation buttons
      return null;
    }
    
    return (
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          className="flex items-center gap-2"
        >
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex items-center gap-2"
        >
          {currentStep === 5 ? "Continue to Payment" : "Continue"}
        </Button>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <ProgressBar currentStep={progressStep} steps={steps} />
        
        <div className="bg-white dark:bg-[#1F2633] rounded-xl p-6 shadow-lg">
          {renderStepContent()}
          {renderNavigationButtons()}
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;
