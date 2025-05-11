
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CarDetails from "@/components/appointment/CarDetails";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import PriceInput from "@/components/appointment/PriceInput";
import Pricing from "@/components/appointment/Pricing";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import ProgressBar from "@/components/appointment/ProgressBar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Define the appointment steps as a type
type AppointmentStep = 1 | 2 | 3 | 4 | 5 | 6;

// Schemas for each step
const step1Schema = z.object({
  body_type: z.string().min(1, { message: "Body type is required" }),
});

const step2Schema = z.object({
  ownership_status: z.string().min(1, { message: "Ownership status is required" }),
  fuel_type: z.string().min(1, { message: "Fuel type is required" }),
  battery_health: z.string().optional(),
});

const step3Schema = z.object({
  warranty_status: z.string().min(1, { message: "Warranty status is required" }),
  loan_status: z.string().min(1, { message: "Loan status is required" }),
});

const step4Schema = z.object({
  seller_price: z.string().min(1, { message: "Price is required" }),
});

const step5Schema = z.object({
  key_features: z.array(z.string()).min(1, { message: "Select at least one feature" }),
});

const Appointment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AppointmentStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if the current vehicle is a bike
  const isBike = localStorage.getItem("vehicle") === "bike";
  
  // Different dropdown options based on vehicle type
  const bodyTypeOptions = isBike 
    ? ["Commuter", "Cruiser", "Sports", "Adventure", "Electric", "Scooty"] 
    : ["Sedan", "SUV", "Hatchback", "MUV", "Luxury", "Convertible"];
    
  const fuelTypeOptions = isBike
    ? ["Petrol", "Electric", "CNG"]
    : ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];

  useEffect(() => {
    // Check if user is logged in
    const checkLogin = () => {
      const user = localStorage.getItem("user");
      if (user) {
        setIsLoggedIn(true);
      } else {
        navigate("/"); // Redirect to home if not logged in
        toast.error("Please log in to continue");
      }
    };
    
    checkLogin();
  }, [navigate]);

  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      body_type: "",
    },
  });

  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      ownership_status: "",
      fuel_type: "",
      battery_health: "",
    },
  });

  const step3Form = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      warranty_status: "",
      loan_status: "",
    },
  });

  const step4Form = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      seller_price: "",
    },
  });
  
  const step5Form = useForm({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      key_features: [],
    },
  });

  useEffect(() => {
    // Load saved data for current step from localStorage
    const loadStepData = () => {
      try {
        const savedData = localStorage.getItem(`appointment_step${currentStep}_data`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          switch (currentStep) {
            case 1:
              step1Form.reset(parsedData);
              break;
            case 2:
              step2Form.reset(parsedData);
              break;
            case 3:
              step3Form.reset(parsedData);
              break;
            case 4:
              step4Form.reset(parsedData);
              break;
            case 5:
              if (parsedData.key_features) {
                setSelectedFeatures(parsedData.key_features);
              }
              step5Form.reset(parsedData);
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    };

    loadStepData();
  }, [currentStep, step1Form, step2Form, step3Form, step4Form, step5Form]);

  const handleNext = async () => {
    setIsLoading(true);
    
    try {
      let isValid = false;
      let formData = {};
      
      switch (currentStep) {
        case 1:
          isValid = await step1Form.trigger();
          formData = step1Form.getValues();
          break;
        case 2:
          isValid = await step2Form.trigger();
          formData = step2Form.getValues();
          break;
        case 3:
          isValid = await step3Form.trigger();
          formData = step3Form.getValues();
          break;
        case 4:
          isValid = await step4Form.trigger();
          formData = step4Form.getValues();
          localStorage.setItem("seller_price", step4Form.getValues().seller_price);
          break;
        case 5:
          if (selectedFeatures.length > 0) {
            isValid = true;
            formData = { key_features: selectedFeatures };
            localStorage.setItem("key_features", JSON.stringify(selectedFeatures));
          } else {
            toast.error("Please select at least one key feature");
          }
          break;
        default:
          isValid = true;
          break;
      }
      
      if (isValid) {
        // Save form data to localStorage
        localStorage.setItem(`appointment_step${currentStep}_data`, JSON.stringify(formData));
        
        // Move to next step if not on final step
        if (currentStep < 6) {
          setCurrentStep(currentStep + 1 as AppointmentStep);
        }
      }
    } catch (error) {
      console.error("Error in form validation:", error);
      toast.error("Please check all required fields");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1 as AppointmentStep);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(item => item !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };
  
  // Render functions for each step
  const renderStepOne = () => {
    return (
      <Form {...step1Form}>
        <form className="space-y-6">
          <FormField
            control={step1Form.control}
            name="body_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select body type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bodyTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  const renderStepTwo = () => {
    return (
      <Form {...step2Form}>
        <form className="space-y-6">
          <FormField
            control={step2Form.control}
            name="ownership_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ownership Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="First Owner">First Owner</SelectItem>
                    <SelectItem value="Second Owner">Second Owner</SelectItem>
                    <SelectItem value="Third Owner">Third Owner</SelectItem>
                    <SelectItem value="Fourth Owner or more">Fourth Owner or more</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={step2Form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fuelTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Only show battery health if electric is selected */}
          {step2Form.watch("fuel_type") === "Electric" && (
            <FormField
              control={step2Form.control}
              name="battery_health"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Battery Health (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter battery health percentage"
                      {...field}
                      type="number"
                      min="1"
                      max="100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    );
  };
  
  const renderStepThree = () => {
    return (
      <Form {...step3Form}>
        <form className="space-y-6">
          <FormField
            control={step3Form.control}
            name="warranty_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warranty Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warranty status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="At Present">At Present</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={step3Form.control}
            name="loan_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Yes - Got NOC">Yes - Got NOC</SelectItem>
                    <SelectItem value="Yes - No NOC">Yes - No NOC</SelectItem>
                    <SelectItem value="No Loan">No Loan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  const renderStepFour = () => {
    return (
      <Form {...step4Form}>
        <form className="space-y-6">
          <FormField
            control={step4Form.control}
            name="seller_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Selling Price (₹)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your expected price"
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  const renderStepFive = () => {
    const features = isBike 
      ? [
          "ABS", "Digital Console", "Disc Brake", "LED Headlight", 
          "USB Charging", "Bluetooth", "Tubeless Tyres", "Wind Shield",
          "Crash Guard", "Adjustable Suspension", "Quick Shifter"
        ]
      : [
          "Sunroof", "Leather Seats", "Navigation", "Cruise Control", 
          "Rear Camera", "Parking Sensors", "Keyless Entry", "Push Button Start",
          "Power Windows", "Climate Control", "Bluetooth", "Alloy Wheels", 
          "6+ Airbags", "Apple CarPlay", "Android Auto"
        ];

    return (
      <div className="space-y-6">
        <div>
          <FormLabel>Select Key Features</FormLabel>
          <p className="text-sm text-gray-500">Choose features that highlight your vehicle</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {features.map((feature) => (
              <Badge 
                key={feature}
                variant={selectedFeatures.includes(feature) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleFeature(feature)}
              >
                {feature}
              </Badge>
            ))}
          </div>
          
          {selectedFeatures.length === 0 && (
            <p className="text-sm text-red-500 mt-2">Please select at least one feature</p>
          )}
        </div>
      </div>
    );
  };

  const renderStepSix = () => {
    return (
      <Pricing 
        onBack={handleBack}
        expectedPrice={localStorage.getItem("seller_price") || ""}
        selectedFeatures={selectedFeatures}
      />
    );
  };

  // Main render function
  if (!isLoggedIn) {
    return <div className="flex justify-center items-center min-h-[70vh]">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sell Your {isBike ? "Bike" : "Car"}</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <ProgressBar currentStep={currentStep} totalSteps={6} />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* Step content */}
        <div className="mb-8">
          {currentStep === 1 && renderStepOne()}
          {currentStep === 2 && renderStepTwo()}
          {currentStep === 3 && renderStepThree()}
          {currentStep === 4 && renderStepFour()}
          {currentStep === 5 && renderStepFive()}
          {currentStep === 6 && renderStepSix()}
        </div>
        
        {/* Navigation buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={isLoading}>
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;
