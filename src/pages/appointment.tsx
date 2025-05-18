
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import ProgressBar from "@/components/appointment/ProgressBar";
import CarDetails from "@/components/appointment/CarDetails";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import Pricing from "@/components/appointment/Pricing";
import Confirmation from "@/components/appointment/Confirmation";
import FloatingVideoButton from "@/components/appointment/FloatingVideoButton";
import VideoModal from "@/components/appointment/VideoModal";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
  });

  // Show video modal on initial page load
  useEffect(() => {
    setShowVideoModal(true);
  }, []);

  // Check for authentication
  if (!currentUser) {
    navigate("/");
    return null;
  }

  // Handle step navigation
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
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
    <Layout>
      <div className="container px-4 mx-auto pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Sell Your Vehicle</h1>
        <p className="text-muted-foreground text-center mb-8">
          Complete the form below to schedule an appointment for selling your vehicle.
        </p>

        <div className="mb-8">
          <ProgressBar currentStep={step} totalSteps={4} />
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {renderStep()}
        </div>

        {/* Video Modal */}
        <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} />
        
        {/* Floating Video Button */}
        <FloatingVideoButton onClick={() => setShowVideoModal(true)} />
      </div>
    </Layout>
  );
};

export default Appointment;
