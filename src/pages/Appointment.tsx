
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProgressBar from "@/components/appointment/ProgressBar";
import CarDetails from "@/components/appointment/CarDetails";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import PriceInput from "@/components/appointment/PriceInput";
import Pricing from "@/components/appointment/Pricing";

type AppointmentStep = 0 | 1 | 2 | 3 | 4;

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AppointmentStep>(0);
  const [expectedPrice, setExpectedPrice] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  
  // Get vehicle type from localStorage on component mount
  useEffect(() => {
    const storedVehicleType = localStorage.getItem("vehicle");
    if (storedVehicleType === "car" || storedVehicleType === "bike") {
      setVehicleType(storedVehicleType);
    }
  }, []);
  
  const steps = [
    "Enter Details",
    "Upload Photos",
    "Tell Us Your Price",
    "Payment and Confirmation"
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
    setCurrentStep(prev => (prev + 1) as AppointmentStep);
  };
  
  const handlePriceSubmit = (price: string, features: string[]) => {
    setExpectedPrice(price);
    setSelectedFeatures(features);
    
    // Store price and features in localStorage
    localStorage.setItem("seller_price", price);
    localStorage.setItem("key_features", JSON.stringify(features));
    
    handleNext();
  };
  
  // Calculate the current progress step for the ProgressBar
  const progressStep = currentStep;
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <CarDetails 
          onBack={handleBack} 
          onNext={handleNext} 
          vehicleType={vehicleType}
        />;
      case 1:
        return <PhotoUpload onBack={handleBack} onNext={handleNext} />;
      case 2:
        return <PriceInput onBack={handleBack} onNext={handlePriceSubmit} />;
      case 3:
        return <Pricing 
          onBack={handleBack} 
          expectedPrice={expectedPrice} 
          selectedFeatures={selectedFeatures} 
        />;
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <ProgressBar currentStep={progressStep} steps={steps} />
        
        <div className="bg-white dark:bg-[#1F2633] rounded-xl p-6 shadow-lg">
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;
