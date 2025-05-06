
import React from "react";
import VehicleCard from "@/components/shared/VehicleCard";

const CarCard = ({ car }: { car: any }) => {
  const vehicleData = {
    ...car,
    type: 'car',
    transmission: car.transmission || 'Unknown',
    fuelType: car.fuelType || car.fuel || 'Unknown'
  };
  
  return <VehicleCard vehicle={vehicleData} />;
};

export default CarCard;
