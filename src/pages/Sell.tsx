
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import CityModal from "@/components/cars/CityModal";
import VehicleTypeToggle from "@/components/sell-page/VehicleTypeToggle";
import RegistrationForm from "@/components/sell-page/RegistrationForm";
import SeparatorOr from "@/components/sell-page/SeparatorOr";
import ManualEntryButton from "@/components/sell-page/ManualEntryButton";
import BrandSelector from "@/components/sell-page/BrandSelector";
import YearSelector from "@/components/sell-page/YearSelector";
import ModelSelector from "@/components/sell-page/ModelSelector";
import VariantSelector from "@/components/sell-page/VariantSelector";
import KilometersInput from "@/components/sell-page/KilometersInput";
import CitySelector from "@/components/sell-page/CitySelector";
import SellHero from "@/components/sell-page/SellHero";
import { z } from "zod";
import { useVehicle } from "@/context/VehicleContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

// New components for the redesigned page
import SellProcess from "@/components/sell-page/SellProcess";
import WhySellWithUs from "@/components/sell-page/WhySellWithUs";
import TestimonialsSection from "@/components/sell-page/TestimonialsSection";
import CityPresence from "@/components/sell-page/CityPresence";
import FAQSection from "@/components/sell-page/FAQSection";

// Email.js dependency
import { loadEmailJsScript, setupPostLoginHandler, sendVehicleDataEmail } from "@/utils/emailjs-loader";

// Step types
type Step = 
  | "initial" 
  | "brand" 
  | "year" 
  | "model" 
  | "variant" 
  | "kilometers" 
  | "city";

// Define the kilometers form schema
const kilometersSchema = z.object({
  kilometers: z.string()
    .refine(value => /^\d+$/.test(value), { message: "🛑 Enter only the numbers" })
    .refine(value => parseInt(value) >= 0, { message: "Kilometers cannot be negative" }),
});

// Helper function to save form data to localStorage
const saveSellFormData = (field: string, value: string) => {
  try {
    const existingData = JSON.parse(localStorage.getItem("sellFormData") || "{}");
    const updatedData = { ...existingData, [field]: value };
    localStorage.setItem("sellFormData", JSON.stringify(updatedData));
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
  }
};

const Sell = () => {
  const [searchParams] = useSearchParams();
  const { vehicleType, setVehicleType } = useVehicle();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("initial");
  
  // Brand selection state
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  
  // Year selection state
  const [selectedYear, setSelectedYear] = useState<string>("");
  
  // Model selection state
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  
  // Other state variables
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [kilometers, setKilometers] = useState<string>("");
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isManualEntryClicked, setIsManualEntryClicked] = useState(false);

  // Load EmailJS script
  useEffect(() => {
    loadEmailJsScript();
  }, []);
  
  // Setup handler for post-login auto submission
  useEffect(() => {
    const cleanup = setupPostLoginHandler(() => {
      // Success callback after auto-submitting email
      toast.success("Vehicle details sent successfully!");
    });
    
    return cleanup;
  }, []);

  // Check for mode query parameter
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'bike' || mode === 'car') {
      setVehicleType(mode);
      saveSellFormData("vehicleType", mode);
    }
  }, [searchParams, setVehicleType]);

  // Reset selections when vehicle type changes
  useEffect(() => {
    setSelectedBrand("");
    setSelectedBrandId("");
    setSelectedYear("");
    setSelectedModel("");
    setSelectedModelId("");
    setSelectedVariant("");
    setCurrentStep("initial");
    setIsManualEntryClicked(false);
    
    // When vehicleType changes, update in the unified storage
    saveSellFormData("vehicleType", vehicleType);
  }, [vehicleType]);

  // Check for saved form data after login
  useEffect(() => {
    if (currentUser) {
      const savedFormData = localStorage.getItem('vehicleFormData');
      if (savedFormData) {
        try {
          const formData = JSON.parse(savedFormData);
          
          // Only restore if user just logged in and was on the city page
          if (formData.currentPage === 'city') {
            setVehicleType(formData.vehicleType);
            setSelectedBrand(formData.brand);
            setSelectedYear(formData.year);
            setSelectedModel(formData.model);
            setSelectedVariant(formData.variant);
            setKilometers(formData.kilometers);
            setCurrentStep('city');
            setIsManualEntryClicked(true);
            
            // Process the email sending with the restored data
            const phoneNumber = currentUser.phoneNumber || 'Not provided';
            
            // Show loading toast
            const loadingToast = toast.loading("Sending vehicle details...");
            
            // Send email with vehicle data
            sendVehicleDataEmail({
              vehicleType: formData.vehicleType,
              brand: formData.brand,
              year: formData.year,
              model: formData.model,
              variant: formData.variant,
              kilometers: formData.kilometers,
              city: formData.city || 'Not selected',
              phoneNumber
            }).then(result => {
              toast.dismiss(loadingToast);
              
              if (result.success) {
                toast.success("Vehicle details sent successfully!");
              } else {
                toast.error("Failed to send vehicle details");
              }
            });
            
            // Clear the saved form data
            localStorage.removeItem('vehicleFormData');
          }
        } catch (error) {
          console.error("Error restoring form data:", error);
          localStorage.removeItem('vehicleFormData');
        }
      }
    }
  }, [currentUser, setVehicleType]);

  const handleToggleChange = (value: string) => {
    if (value === "car" || value === "bike") {
      setVehicleType(value);
      // Reset to initial state when toggle is changed
      setCurrentStep("initial");
      setIsManualEntryClicked(false);
      
      // Save vehicle type to unified storage
      saveSellFormData("vehicleType", value);
    }
  };

  const handleKilometersSubmit = (data: z.infer<typeof kilometersSchema>) => {
    setKilometers(data.kilometers);
    setCurrentStep("city");
    
    // Save kilometers to unified storage
    saveSellFormData("kilometersDriven", data.kilometers);
  };

  const handleManualEntryClick = () => {
    setIsManualEntryClicked(true);
    setCurrentStep("brand");
  };

  // Updated select functions to include IDs and save to localStorage
  const selectBrand = (brand: string, brandId?: string) => {
    setSelectedBrand(brand);
    if (brandId) {
      setSelectedBrandId(brandId);
    }
    setCurrentStep("year");
    
    // Save brand to unified storage
    saveSellFormData("brand", brand);
    if (brandId) saveSellFormData("brandId", brandId);
  };

  const selectYear = (year: string) => {
    setSelectedYear(year);
    setCurrentStep("model");
    
    // Save year to unified storage
    saveSellFormData("year", year);
  };

  const selectModel = (model: string, modelId?: string) => {
    setSelectedModel(model);
    if (modelId) {
      setSelectedModelId(modelId);
    }
    // Reset selected variant
    setSelectedVariant("");
    setCurrentStep("variant");
    
    // Save model to unified storage
    saveSellFormData("model", model);
    if (modelId) saveSellFormData("modelId", modelId);
  };

  const selectVariant = (variant: string) => {
    setSelectedVariant(variant);
    setCurrentStep("kilometers");
    
    // Save variant to unified storage
    saveSellFormData("variant", variant);
  };

  const goBack = () => {
    switch (currentStep) {
      case "year":
        setCurrentStep("brand");
        break;
      case "model":
        setCurrentStep("year");
        break;
      case "variant":
        setCurrentStep("model");
        break;
      case "kilometers":
        setCurrentStep("variant");
        break;
      case "city":
        setCurrentStep("kilometers");
        break;
      default:
        setCurrentStep("initial");
        setIsManualEntryClicked(false); // Reset card size when returning to initial
    }
  };

  const openCityModal = () => {
    setIsCityModalOpen(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "initial":
        return (
          <div className="space-y-8">
            <RegistrationForm vehicleType={vehicleType} />
            <SeparatorOr />
            <ManualEntryButton onClick={handleManualEntryClick} />
          </div>
        );
      case "brand":
        return (
          <BrandSelector 
            vehicleType={vehicleType}
            selectedBrand={selectedBrand}
            onSelectBrand={selectBrand}
            onBack={() => {
              setCurrentStep("initial");
              setIsManualEntryClicked(false); // Reset card size when going back to initial
            }}
          />
        );
      case "year":
        return (
          <YearSelector
            selectedYear={selectedYear}
            onSelectYear={selectYear}
            onBack={goBack}
          />
        );
      case "model":
        return (
          <ModelSelector
            vehicleType={vehicleType}
            selectedBrand={selectedBrand}
            selectedBrandId={selectedBrandId}
            selectedYear={selectedYear}
            selectedModel={selectedModel}
            onSelectModel={selectModel}
            onBack={goBack}
          />
        );
      case "variant":
        return (
          <VariantSelector
            vehicleType={vehicleType}
            selectedModel={selectedModel}
            selectedModelId={selectedModelId}
            selectedVariant={selectedVariant}
            onSelectVariant={selectVariant}
            onBack={goBack}
          />
        );
      case "kilometers":
        return (
          <KilometersInput
            onSubmit={handleKilometersSubmit}
            onBack={goBack}
          />
        );
      case "city":
        return (
          <CitySelector
            onOpenCityModal={openCityModal}
            onBack={goBack}
            selectedBrand={selectedBrand}
            selectedYear={selectedYear}
            selectedModel={selectedModel}
            selectedVariant={selectedVariant}
            kilometers={kilometers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#fefbff] dark:bg-black font-poppins">
        <SellHero 
          vehicleType={vehicleType} 
          isManualEntryClicked={isManualEntryClicked}
        >
          <VehicleTypeToggle
            vehicleType={vehicleType}
            onToggleChange={handleToggleChange}
          />
          <div className="min-h-[350px]">
            {renderStepContent()}
          </div>
        </SellHero>
        
        <SellProcess />
        <WhySellWithUs />
        <TestimonialsSection />
        <CityPresence />
        <FAQSection />
      </div>

      <CityModal 
        isOpen={isCityModalOpen} 
        onClose={() => setIsCityModalOpen(false)} 
      />
    </Layout>
  );
};

export default Sell;
