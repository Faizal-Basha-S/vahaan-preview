
import React from "react";
import VehicleCard from "@/components/shared/VehicleCard";

const BikeCard = ({ bike }: { bike: any }) => {
  // Adapt bike object to match VehicleCard props
  const vehicleData = {
    ...bike,
    type: 'bike',
    transmission: bike.transmission || 'Manual', // Ensure transmission is always provided
    fuelType: bike.fuelType || bike.fuel || 'Petrol' // Ensure fuelType is always provided
  };
  
  return <VehicleCard vehicle={vehicleData} />;
};

export default BikeCard;
