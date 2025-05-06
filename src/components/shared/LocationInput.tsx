
import { MapPin } from 'lucide-react';
import { useCityStore } from '@/store/useCityStore';

interface LocationInputProps {
  onClick: () => void;
  className?: string;
}

const LocationInput = ({ onClick, className = "" }: LocationInputProps) => {
  const { selectedCity } = useCityStore();

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:border-primary transition-colors shadow-lg hover:shadow-md ${className}`}
      onClick={onClick}
    >
      <MapPin className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium truncate">
        {selectedCity || "Location"}
      </span>
    </div>
  );
};

export default LocationInput;
