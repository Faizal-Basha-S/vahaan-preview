
import React, { useState, useEffect, ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ProgressBar from "@/components/appointment/ProgressBar";
import CarDetails from "@/components/appointment/CarDetails";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import Pricing from "@/components/appointment/Pricing";
import Confirmation from "@/components/appointment/Confirmation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import VideoGuideModal from "@/components/appointment/VideoGuideModal";
import FloatingVideoButton from "@/components/appointment/FloatingVideoButton";

// Initial form data structure
const initialFormData = {
  brand: "",
  model: "",
  year: "",
  variant: "",
  color: "",
  fuelType: "",
  transmission: "",
  kilometers: "",
  registrationState: "",
  ownerNumber: "",
  insuranceStatus: "",
  photos: [],
  expectedPrice: "",
};

const Appointment = () => {
  // Auth state
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [formData, setFormData] = useState(initialFormData);
  const [activeStep, setActiveStep] = useState(1);
  const [expectedPrice, setExpectedPrice] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Video guide modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Check for form data in localStorage on initial load
  useEffect(() => {
    // Only show video modal on initial page load
    setIsVideoModalOpen(true);
    
    // Load form data from localStorage if available
    const savedFormData = localStorage.getItem("sellFormData");
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        // Only set these fields if they exist in localStorage
        setFormData(prevData => ({
          ...prevData,
          brand: parsedData.brand || prevData.brand,
          model: parsedData.model || prevData.model,
          year: parsedData.year || prevData.year,
          variant: parsedData.variant || prevData.variant,
          kilometers: parsedData.kilometers || prevData.kilometers,
        }));
      } catch (error) {
        console.error("Error parsing saved form data:", error);
      }
    }
  }, []);

  // Handle input change in form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Navigation functions
  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 1));

  // Render appropriate component based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <CarDetails
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <PhotoUpload
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Pricing
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
            prevStep={prevStep}
            expectedPrice={expectedPrice}
            setExpectedPrice={setExpectedPrice}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 4:
        return <Confirmation formData={formData} prevStep={prevStep} />;
      default:
        return (
          <CarDetails
            formData={formData}
            handleInputChange={handleInputChange}
            nextStep={nextStep}
          />
        );
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20 md:pt-28 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Book Your Appointment</h1>
      
      {/* Progress bar component */}
      <ProgressBar currentStep={activeStep} totalSteps={4} />
      
      {/* Render appropriate step content */}
      <div className="mt-8">
        <Tabs value={activeStep.toString()} className="w-full">
          <TabsContent value="1" className="mt-0">
            {activeStep === 1 && renderStepContent()}
          </TabsContent>
          <TabsContent value="2" className="mt-0">
            {activeStep === 2 && renderStepContent()}
          </TabsContent>
          <TabsContent value="3" className="mt-0">
            {activeStep === 3 && renderStepContent()}
          </TabsContent>
          <TabsContent value="4" className="mt-0">
            {activeStep === 4 && renderStepContent()}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Video Guide Modal */}
      <VideoGuideModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
      
      {/* Floating Video Button */}
      <FloatingVideoButton onClick={() => setIsVideoModalOpen(true)} />
    </div>
  );
};

export default Appointment;
