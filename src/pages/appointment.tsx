
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProgressBar from "@/components/appointment/ProgressBar";
import CarDetails from "@/components/appointment/CarDetails";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import PriceInput from "@/components/appointment/PriceInput";
import Pricing from "@/components/appointment/Pricing";

type AppointmentStep = 0 | 1 | 2 | 3;

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AppointmentStep>(0);
  const [expectedPrice, setExpectedPrice] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  
  // Get vehicle type from localStorage on component mount
  useEffect(() => {
    const storedVehicleType = localStorage.getItem("selectedVehicleType");
    if (storedVehicleType === "car" || storedVehicleType === "bike") {
      setVehicleType(storedVehicleType);
    }
  }, []);
  
  const steps = [
    "Enter Details",
    "Upload Photos",
    "Tell Us Your Price",
    "Pricing",
    "Confirmation"
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
    handleNext();
  };
  
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
        <ProgressBar currentStep={currentStep} steps={steps} />
        
        <div className="bg-white dark:bg-[#1F2633] rounded-xl p-6 shadow-lg">
          {renderStepContent()}
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;
