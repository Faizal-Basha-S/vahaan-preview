
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

interface CarDetailsProps {
  onBack: () => void;
  onNext: () => void;
  vehicleType: "car" | "bike";
}

const CarDetails: React.FC<CarDetailsProps> = ({ onBack, onNext, vehicleType }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    vehicleType: "",
    fuelType: "",
    transmission: "",
    mileage: "",
    seats: "",
    safetyRating: "",
    cc: "",
    airbags: "",
    cylinders: "",
    wheelDrive: "",
    color: "",
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle select change
  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.vehicleType || !formData.fuelType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Store form data in localStorage
    localStorage.setItem("vehicle_type", formData.vehicleType); // Explicitly store the vehicle type
    localStorage.setItem("fuel_type", formData.fuelType);
    localStorage.setItem("color", formData.color);
    localStorage.setItem("mileage", formData.mileage);
    localStorage.setItem("seats", formData.seats);
    localStorage.setItem("safety_rating", formData.safetyRating);
    localStorage.setItem("cc", formData.cc);
    
    // Only store car-specific fields if the vehicle is a car
    if (vehicleType === "car") {
      localStorage.setItem("transmission", formData.transmission);
      localStorage.setItem("airbags", formData.airbags);
      localStorage.setItem("cylinders", formData.cylinders);
      localStorage.setItem("wheel_drive", formData.wheelDrive);
    } else {
      // Clear car-specific fields if it's a bike to avoid confusion
      localStorage.removeItem("transmission");
      localStorage.removeItem("airbags");
      localStorage.removeItem("cylinders");
      localStorage.removeItem("wheel_drive");
    }
    
    // Proceed to next step
    onNext();
  };

  // Define dropdown options based on vehicle type
  const vehicleTypeOptions = vehicleType === "car" 
    ? ["SUV", "Sedan", "Hatchback", "Van"]
    : ["Commuter", "Cruiser", "Sports", "Adventure", "Electric", "Scooty"];

  const fuelTypeOptions = vehicleType === "car"
    ? ["Petrol", "Diesel", "Electric", "CNG", "LPG"]
    : ["Petrol", "Electric", "CNG"];

  const transmissionOptions = ["Manual", "Automatic", "CVT", "AMT", "DCT"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h3 className="text-xl font-medium">Enter {vehicleType === "car" ? "Car" : "Bike"} Details</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select
              value={formData.vehicleType}
              onValueChange={(value) => handleSelectChange(value, "vehicleType")}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypeOptions.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fuel Type */}
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select
              value={formData.fuelType}
              onValueChange={(value) => handleSelectChange(value, "fuelType")}
            >
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {fuelTypeOptions.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transmission - Only for Car */}
          {vehicleType === "car" && (
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select
                value={formData.transmission}
                onValueChange={(value) => handleSelectChange(value, "transmission")}
              >
                <SelectTrigger id="transmission">
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissionOptions.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Color - For both Car and Bike */}
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              name="color"
              placeholder="e.g., Red"
              value={formData.color}
              onChange={handleInputChange}
            />
          </div>

          {/* Mileage */}
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              name="mileage"
              placeholder="e.g., 18 kmpl"
              value={formData.mileage}
              onChange={handleInputChange}
            />
          </div>

          {/* Seats */}
          <div className="space-y-2">
            <Label htmlFor="seats">Seats</Label>
            <Input
              id="seats"
              name="seats"
              placeholder="e.g., 5"
              value={formData.seats}
              onChange={handleInputChange}
            />
          </div>

          {/* GNCAP Safety Rating */}
          <div className="space-y-2">
            <Label htmlFor="safetyRating">GNCAP Safety Rating</Label>
            <Input
              id="safetyRating"
              name="safetyRating"
              placeholder="e.g., 5"
              value={formData.safetyRating}
              onChange={handleInputChange}
            />
          </div>

          {/* CC */}
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input
              id="cc"
              name="cc"
              placeholder="e.g., 1197"
              value={formData.cc}
              onChange={handleInputChange}
            />
          </div>

          {/* Airbags - Only for Car */}
          {vehicleType === "car" && (
            <div className="space-y-2">
              <Label htmlFor="airbags">Airbags</Label>
              <Input
                id="airbags"
                name="airbags"
                placeholder="e.g., 2"
                value={formData.airbags}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Cylinders - Only for Car */}
          {vehicleType === "car" && (
            <div className="space-y-2">
              <Label htmlFor="cylinders">Cylinders</Label>
              <Input
                id="cylinders"
                name="cylinders"
                placeholder="e.g., 4"
                value={formData.cylinders}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Wheel Drive - Only for Car */}
          {vehicleType === "car" && (
            <div className="space-y-2">
              <Label htmlFor="wheelDrive">Wheel Drive</Label>
              <Input
                id="wheelDrive"
                name="wheelDrive"
                placeholder="e.g., FWD"
                value={formData.wheelDrive}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="bg-primary text-white">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CarDetails;
