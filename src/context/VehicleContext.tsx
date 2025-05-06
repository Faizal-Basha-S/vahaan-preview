
import React, { createContext, useContext, useState, ReactNode } from 'react';

type VehicleType = 'car' | 'bike';

interface VehicleContextType {
  vehicleType: VehicleType;
  setVehicleType: (type: VehicleType) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');

  return (
    <VehicleContext.Provider value={{ vehicleType, setVehicleType }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};
