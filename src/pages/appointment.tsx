
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
  
  // Additional state for features that PriceInput component needs
  const [expectedPrice, setExpectedPrice] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Vehicle details for confirmation
  const [confirmationData, setConfirmationData] = useState({
    phoneNumber: "",
    brand: "",
    model: "",
    year: "",
    variant: "",
    kilometers: "",
    city: "",
    vehicleType: "",
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
  });
  
  // Determine if we're dealing with a bike or car
  const isBike = (localStorage.getItem("vehicle_type") || "").toLowerCase() === "bike";
  
  // Format price for display
  const formattedPrice = expectedPrice 
    ? new Intl.NumberFormat("en-IN").format(parseInt(expectedPrice))
    : "0";

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

  // Collect data for confirmation view
  const setIsConfirmationView = (isConfirmation: boolean) => {
    if (isConfirmation) {
      // Gather data from localStorage for confirmation
      setConfirmationData({
        phoneNumber: localStorage.getItem("phoneNumber") || "",
        brand: localStorage.getItem("brand") || "",
        model: localStorage.getItem("model") || "",
        year: localStorage.getItem("year") || "",
        variant: localStorage.getItem("variant") || "",
        kilometers: localStorage.getItem("kilometers") || "",
        city: localStorage.getItem("selectedCity") || "",
        vehicleType: localStorage.getItem("vehicle_type") || "",
        fuelType: localStorage.getItem("fuel_type") || "",
        transmission: localStorage.getItem("transmission") || "",
        color: localStorage.getItem("color") || "",
        mileage: localStorage.getItem("mileage") || "",
        seats: localStorage.getItem("seats") || "",
        safetyRating: localStorage.getItem("safety_rating") || "",
        cc: localStorage.getItem("cc") || "",
        airbags: localStorage.getItem("airbags") || "",
        cylinders: localStorage.getItem("cylinders") || "",
        wheelDrive: localStorage.getItem("wheel_drive") || ""
      });
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <CarDetails
            onBack={() => navigate(-1)}
            onNext={nextStep}
            vehicleType={localStorage.getItem("vehicle_type")}
          />
        );
      case 2:
        return (
          <PhotoUpload
            onBack={prevStep}
            onNext={nextStep}
          />
        );
      case 3:
        return (
          <Pricing
            expectedPrice={expectedPrice}
            setExpectedPrice={setExpectedPrice}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            onBack={prevStep}
            onNext={() => {
              nextStep();
              setIsConfirmationView(true);
            }}
          />
        );
      case 4:
        return (
          <Confirmation
            confirmationData={confirmationData}
            isBike={isBike}
            formattedPrice={formattedPrice}
            selectedFeatures={selectedFeatures}
            setIsConfirmationView={() => prevStep()}
          />
        );
      default:
        return (
          <CarDetails
            onBack={() => navigate(-1)}
            onNext={nextStep}
            vehicleType={localStorage.getItem("vehicle_type")}
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
