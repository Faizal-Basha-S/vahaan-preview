
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar, Fuel, Gauge, Tag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { VehicleData } from "@/hooks/useVehicleData";

interface UnifiedVehicleCardProps {
  vehicle: VehicleData;
  type: 'car' | 'bike';
}

const UnifiedVehicleCard = ({ vehicle, type }: UnifiedVehicleCardProps) => {
  const [favorite, setFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const getImageUrl = () => {
    if (vehicle.photos && typeof vehicle.photos === 'object') {
      const photoCategories = Object.values(vehicle.photos);
      for (const category of photoCategories) {
        if (Array.isArray(category) && category.length > 0) {
          return category[0];
        }
      }
    }
    return "/placeholder.svg";
  };
  
  const detailRoute = type === 'car' ? `/buy/${vehicle.id}` : `/bike/${vehicle.id}`;
  const vehicleTitle = `${vehicle.year} ${vehicle.brand} ${vehicle.model}`;

  return (
    <Link to={detailRoute} className="block h-full">
      <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/9]">
          <img 
            src={getImageUrl()} 
            alt={vehicleTitle}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors"
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 ${
                favorite 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600 dark:text-gray-400"
              }`} 
            />
          </button>
          
          {vehicle.tag && (
            <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-md z-10">
              {vehicle.tag}
            </div>
          )}
        </div>
        
        {/* Content */}
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold line-clamp-1">{vehicleTitle}</h3>
            <p className="font-bold text-primary">{formatPrice(vehicle.sell_price)}</p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{vehicle.vehicle_city}</span>
          </div>
          
          {/* Specifications */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.year}</span>
            </div>
            
            <div className="flex items-center">
              <Gauge className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.kms_driven?.toLocaleString() || 0} km</span>
            </div>
            
            <div className="flex items-center">
              <Tag className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.variant}</span>
            </div>
            
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{vehicle.number_of_owners} Owner</span>
            </div>
          </div>
          
          {/* Color Info */}
          {vehicle.color && (
            <div className="mt-3 pt-2 border-t text-sm text-muted-foreground">
              <span>Color: {vehicle.color}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default UnifiedVehicleCard;
