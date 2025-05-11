
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  UserIcon,
  Phone,
  Mail,
  Map,
  Asterisk,
  MapPinIcon,
  IndianRupee,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProgressBar from "@/components/appointment/ProgressBar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import CarDetails from "@/components/appointment/CarDetails";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import PriceInput from "@/components/appointment/PriceInput";
import Pricing from "@/components/appointment/Pricing";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormData {
  [key: string]: string;
}

const Appointment = () => {
  const navigate = useNavigate();
  const phoneNumber = localStorage.getItem("phoneNumber") || "";
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [expectedPrice, setExpectedPrice] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Get vehicle type from localStorage
  const vehicleType = localStorage.getItem("vehicle") || "car";

  // Form validation
  const [formError, setFormError] = useState<boolean>(false);

  // Define required fields for each step
  const requiredFields: { [key: number]: string[] } = {
    1: ["firstName", "lastName", "email", "phone"],
    2: ["address", "city", "state", "date"],
    3: ["vehicleType", "transmission", "fuelType", "color", "warrantyStatus"],
    4: [],
    5: [],
  };

  useEffect(() => {
    // Check if phone number is available, if not redirect to homepage
    if (!phoneNumber) {
      navigate("/");
    }

    // Pre-fill phone number
    setFormData(prevFormData => ({
      ...prevFormData,
      phone: phoneNumber,
    }));

    // Check if we have appointment data in localStorage
    const storedData = localStorage.getItem("appointmentData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);

        if (parsedData.date) {
          setDate(new Date(parsedData.date));
        }
      } catch (error) {
        console.error("Error parsing stored appointment data:", error);
      }
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    // Save form data to localStorage whenever it changes
    localStorage.setItem("appointmentData", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));

    // Save to localStorage to access it elsewhere
    if (name === "warrantyStatus") {
      localStorage.setItem("warrantyStatus", value);
    }
  };

  const validateFormStep = () => {
    const currentRequiredFields = requiredFields[currentStep] || [];
    
    // Special case for step 4
    if (currentStep === 4) {
      // Check if all required media uploads are done
      const uploadedFileUrls = localStorage.getItem("uploadedFileUrls");
      if (!uploadedFileUrls) {
        setFormError(true);
        toast.error("Please upload all required images and video");
        return false;
      }
      
      try {
        const parsedUrls = JSON.parse(uploadedFileUrls);
        const requiredMedia = ['Defects', 'Odometer', 'Walkaround Video'];
        
        // Check if we have at least one file for each required media type
        for (const mediaType of requiredMedia) {
          if (!parsedUrls[mediaType] || parsedUrls[mediaType].length === 0) {
            setFormError(true);
            toast.error(`Please upload at least one ${mediaType} file`);
            return false;
          }
        }
      } catch (error) {
        setFormError(true);
        toast.error("Error validating media uploads");
        return false;
      }
      
      return true;
    }
    
    if (currentStep === 5) {
      // Validate price input
      if (!expectedPrice || parseFloat(expectedPrice) <= 0) {
        setFormError(true);
        toast.error("Please enter a valid expected price");
        return false;
      }
      return true;
    }
    
    const missingFields = currentRequiredFields.filter(field => {
      return !formData[field] || formData[field].trim() === "";
    });

    if (missingFields.length > 0) {
      setFormError(true);
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return false;
    }

    setFormError(false);
    return true;
  };

  const handleNext = () => {
    if (validateFormStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData(prevFormData => ({
        ...prevFormData,
        date: selectedDate.toISOString(),
      }));
    }
  };

  const handleFeatureSelect = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(prev => prev.filter(f => f !== feature));
    } else {
      setSelectedFeatures(prev => [...prev, feature]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="flex items-center">
                  First Name <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className={formError && !formData.firstName ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="flex items-center">
                  Last Name <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className={formError && !formData.lastName ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center">
                Email <Asterisk className="h-3 w-3 text-red-500 ml-1" />
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="Enter email"
                className={formError && !formData.email ? "border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="flex items-center">
                Phone Number <Asterisk className="h-3 w-3 text-red-500 ml-1" />
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone || ""}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className={formError && !formData.phone ? "border-red-500" : ""}
                disabled={true}
              />
              <p className="text-xs text-gray-500">Phone number from your registered account</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="sellerPrice" className="flex items-center">
                Seller Price <Asterisk className="h-3 w-3 text-red-500 ml-1" />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">
                  <IndianRupee className="h-5 w-5 text-gray-500" />
                </span>
                <Input
                  id="sellerPrice"
                  name="sellerPrice"
                  type="number"
                  value={formData.sellerPrice || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your price"
                  className={`pl-10 ${formError && !formData.sellerPrice ? "border-red-500" : ""}`}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Location & Schedule</h2>
            <div className="space-y-2">
              <label htmlFor="address" className="flex items-center">
                Address <Asterisk className="h-3 w-3 text-red-500 ml-1" />
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Enter your address"
                className={formError && !formData.address ? "border-red-500" : ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="city" className="flex items-center">
                  City <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className={formError && !formData.city ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="flex items-center">
                  State <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  className={formError && !formData.state ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                Preferred Date <Asterisk className="h-3 w-3 text-red-500 ml-1" />
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={`w-full justify-start text-left font-normal ${
                      formError && !formData.date ? "border-red-500" : ""
                    } ${!date ? "text-gray-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label htmlFor="notes">Additional Notes (optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={(e) => {
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    notes: e.target.value,
                  }));
                }}
                placeholder="Add any special requirements or information"
                className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="vehicleType" className="flex items-center">
                  Vehicle Type <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Select
                  name="vehicleType"
                  value={formData.vehicleType || ""}
                  onValueChange={(value) => handleSelectChange("vehicleType", value)}
                >
                  <SelectTrigger className={formError && !formData.vehicleType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={vehicleType === "car" ? "car" : "bike"}>
                      {vehicleType === "car" ? "Car" : "Bike"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="transmission" className="flex items-center">
                  Transmission <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Select
                  name="transmission"
                  value={formData.transmission || ""}
                  onValueChange={(value) => handleSelectChange("transmission", value)}
                >
                  <SelectTrigger className={formError && !formData.transmission ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleType === "car" ? (
                      <>
                        <SelectItem value="automatic">Automatic</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="automatic">Automatic</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="fuelType" className="flex items-center">
                  Fuel Type <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Select
                  name="fuelType"
                  value={formData.fuelType || ""}
                  onValueChange={(value) => handleSelectChange("fuelType", value)}
                >
                  <SelectTrigger className={formError && !formData.fuelType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleType === "car" ? (
                      <>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="color" className="flex items-center">
                  Color <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color || ""}
                  onChange={handleInputChange}
                  placeholder="Enter color"
                  className={formError && !formData.color ? "border-red-500" : ""}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="warrantyStatus" className="flex items-center">
                  Warranty Status <Asterisk className="h-3 w-3 text-red-500 ml-1" />
                </label>
                <Select
                  name="warrantyStatus"
                  value={formData.warrantyStatus || ""}
                  onValueChange={(value) => handleSelectChange("warrantyStatus", value)}
                >
                  <SelectTrigger className={formError && !formData.warrantyStatus ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select warranty status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finished">Finished</SelectItem>
                    <SelectItem value="At Present">At Present</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <CarDetails 
              onBack={handleBack}
              onNext={handleNext}
              vehicleType={vehicleType as "car" | "bike"}
            />
          </div>
        );
      case 4:
        return (
          <PhotoUpload
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <PriceInput
            onBack={handleBack}
            onNext={handleNext}
            expectedPrice={expectedPrice}
            setExpectedPrice={setExpectedPrice}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
          />
        );
      case 6:
        return (
          <Pricing
            onBack={handleBack}
            expectedPrice={expectedPrice}
            selectedFeatures={selectedFeatures}
          />
        );
      default:
        return null;
    }
  };

  const renderNavButtons = () => {
    if (currentStep === 4 || currentStep === 5 || currentStep === 6) {
      return null; // These steps have their own navigation buttons
    }

    return (
      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <Button onClick={handleNext} className="flex items-center gap-2">
          {currentStep === 3 ? "Continue to Upload Photos" : "Next"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Book an Appointment
      </h1>

      <ProgressBar currentStep={currentStep} totalSteps={6} />

      <div className="bg-white rounded-lg shadow-md p-6 mt-8 max-w-4xl mx-auto">
        {renderStep()}
        {renderNavButtons()}
      </div>
    </div>
  );
};

export default Appointment;
