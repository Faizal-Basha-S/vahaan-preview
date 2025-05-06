
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Car, Bike } from "lucide-react";

interface VehicleTypeToggleProps {
  vehicleType: "car" | "bike";
  onToggleChange: (value: string) => void;
}

const VehicleTypeToggle: React.FC<VehicleTypeToggleProps> = ({
  vehicleType,
  onToggleChange,
}) => {
  return (
    <div className="flex justify-center mb-6">
      <ToggleGroup
        type="single"
        value={vehicleType}
        onValueChange={onToggleChange}
        className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full w-full max-w-[200px]"
      >
        <ToggleGroupItem
          value="car"
          className={`w-full rounded-full text-sm ${
            vehicleType === "car"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent"
          } transition-all`}
          aria-label="Car"
        >
          <Car className="h-4 w-4 mr-2" /> Car
        </ToggleGroupItem>

        <ToggleGroupItem
          value="bike"
          className={`w-full rounded-full text-sm ${
            vehicleType === "bike"
              ? "bg-primary text-primary-foreground"
              : "bg-transparent"
          } transition-all`}
          aria-label="Bike"
        >
          <Bike className="h-4 w-4 mr-2" /> Bike
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default VehicleTypeToggle;
