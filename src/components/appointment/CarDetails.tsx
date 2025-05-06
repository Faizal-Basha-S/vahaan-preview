
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CarDetailsProps {
  onBack: () => void;
  onNext: () => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({ onBack, onNext }) => {
  const navigate = useNavigate();
  
  const [details, setDetails] = useState({
    vehicleType: "Car",
    fuelType: "Petrol",
    transmission: "Manual",
    mileage: "",
    seats: "",
    safetyRating: "",
    cc: "",
    airbags: "",
    cylinders: "",
    wheelDrive: "FWD"
  });
  
  const handleChange = (field: string, value: string) => {
    setDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleBackToSell = () => {
    navigate("/sell");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToSell}
          className="p-0 mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-xl font-medium">Enter Details</h3>
      </div>
      
      <div className="space-y-6">
        {/* Row 1: Vehicle Type & Fuel Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select 
              value={details.vehicleType} 
              onValueChange={(value) => handleChange("vehicleType", value)}
            >
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Bike">Bike</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select 
              value={details.fuelType}
              onValueChange={(value) => handleChange("fuelType", value)}
            >
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="CNG">CNG</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Row 2: Transmission & Mileage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transmission">Transmission</Label>
            <Select 
              value={details.transmission}
              onValueChange={(value) => handleChange("transmission", value)}
            >
              <SelectTrigger id="transmission">
                <SelectValue placeholder="Select transmission" />
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
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage (kmpl)</Label>
            <Input 
              id="mileage"
              type="text"
              value={details.mileage}
              onChange={(e) => handleChange("mileage", e.target.value)}
              placeholder="e.g., 18"
            />
          </div>
        </div>
        
        {/* Row 3: Seats & Safety Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seats">Seats</Label>
            <Input 
              id="seats"
              type="number"
              value={details.seats}
              onChange={(e) => handleChange("seats", e.target.value)}
              placeholder="e.g., 5"
              min="1"
              max="10"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="safetyRating">GNCAP Safety Rating</Label>
            <Select 
              value={details.safetyRating}
              onValueChange={(value) => handleChange("safetyRating", value)}
            >
              <SelectTrigger id="safetyRating">
                <SelectValue placeholder="Select rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Star</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="Not Rated">Not Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Row 4: CC & Airbags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cc">CC</Label>
            <Input 
              id="cc"
              type="number"
              value={details.cc}
              onChange={(e) => handleChange("cc", e.target.value)}
              placeholder="e.g., 1197"
              min="1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="airbags">Airbags</Label>
            <Input 
              id="airbags"
              type="number"
              value={details.airbags}
              onChange={(e) => handleChange("airbags", e.target.value)}
              placeholder="e.g., 2"
              min="0"
            />
          </div>
        </div>
        
        {/* Row 5: Cylinders & Wheel Drive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cylinders">Cylinders</Label>
            <Input 
              id="cylinders"
              type="number"
              value={details.cylinders}
              onChange={(e) => handleChange("cylinders", e.target.value)}
              placeholder="e.g., 4"
              min="1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wheelDrive">Wheel Drive</Label>
            <Select 
              value={details.wheelDrive}
              onValueChange={(value) => handleChange("wheelDrive", value)}
            >
              <SelectTrigger id="wheelDrive">
                <SelectValue placeholder="Select wheel drive" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FWD">FWD (Front Wheel Drive)</SelectItem>
                <SelectItem value="RWD">RWD (Rear Wheel Drive)</SelectItem>
                <SelectItem value="AWD">AWD (All Wheel Drive)</SelectItem>
                <SelectItem value="4WD">4WD (Four Wheel Drive)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button 
            onClick={onNext}
          >
            Upload Photos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
