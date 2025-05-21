
import React from "react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface VariantFiltersProps {
  availableFuelTypes: string[];
  availableTransmissions: string[];
  selectedFuelType: string | null;
  selectedTransmission: string | null;
  onSelectFuelType: (type: string | null) => void;
  onSelectTransmission: (type: string | null) => void;
}

const VariantFilters: React.FC<VariantFiltersProps> = ({
  availableFuelTypes,
  availableTransmissions,
  selectedFuelType,
  selectedTransmission,
  onSelectFuelType,
  onSelectTransmission,
}) => {
  // Ensure arrays are always arrays
  const fuelTypes = Array.isArray(availableFuelTypes) ? availableFuelTypes : [];
  const transmissions = Array.isArray(availableTransmissions) ? availableTransmissions : [];
  
  return (
    <div className="space-y-4">
      {/* Only show fuel type filter if there are multiple options */}
      {fuelTypes.length > 1 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Fuel Type</div>
          <ToggleGroup type="single" value={selectedFuelType || ""} onValueChange={(value) => onSelectFuelType(value || null)}>
            {fuelTypes.map((fuelType) => (
              <ToggleGroupItem 
                key={fuelType} 
                value={fuelType}
                className="text-sm"
              >
                {fuelType}
              </ToggleGroupItem>
            ))}
            {selectedFuelType && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onSelectFuelType(null)}
                className="text-xs bg-light text-muted-foreground"
              >
                Clear
              </Button>
            )}
          </ToggleGroup>
        </div>
      )}

      {/* Only show transmission filter if there are multiple options */}
      {transmissions.length > 1 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Transmission</div>
          <ToggleGroup type="single" value={selectedTransmission || ""} onValueChange={(value) => onSelectTransmission(value || null)}>
            {transmissions.map((transmission) => (
              <ToggleGroupItem 
                key={transmission} 
                value={transmission}
                className="text-sm"
              >
                {transmission}
              </ToggleGroupItem>
            ))}
            {selectedTransmission && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onSelectTransmission(null)}
                className="text-xs bg-light text-muted-foreground"
              >
                Clear
              </Button>
            )}
          </ToggleGroup>
        </div>
      )}
    </div>
  );
};

export default VariantFilters;
