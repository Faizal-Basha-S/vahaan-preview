
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface BrandProps {
  id: string;
  name: string;
  logo: string;
  count: number;
}

interface PopularBrandsProps {
  variant?: "circle" | "square";
}

// Updated car brands list with all the requested brands
const carBrands: BrandProps[] = [
  { id: "maruti", name: "Maruti Suzuki", logo: "/resource-uploads/7958329b-873f-4c8b-a220-45ef50c8b256.png", count: 156 },
  { id: "hyundai", name: "Hyundai", logo: "/placeholder.svg", count: 124 },
  { id: "mahindra", name: "Mahindra", logo: "/placeholder.svg", count: 92 },
  { id: "tata", name: "Tata", logo: "/placeholder.svg", count: 98 },
  { id: "honda", name: "Honda", logo: "/placeholder.svg", count: 87 },
  { id: "toyota", name: "Toyota", logo: "/placeholder.svg", count: 76 },
  { id: "ford", name: "Ford", logo: "/placeholder.svg", count: 43 },
  { id: "renault", name: "Renault", logo: "/placeholder.svg", count: 64 },
  { id: "volkswagen", name: "Volkswagen", logo: "/placeholder.svg", count: 38 },
  { id: "chevrolet", name: "Chevrolet", logo: "/placeholder.svg", count: 35 },
  { id: "skoda", name: "Skoda", logo: "/placeholder.svg", count: 25 },
  { id: "kia", name: "KIA", logo: "/placeholder.svg", count: 58 },
  { id: "fiat", name: "Fiat", logo: "/placeholder.svg", count: 18 },
  { id: "nissan", name: "Nissan", logo: "/placeholder.svg", count: 22 },
  { id: "mercedes", name: "Mercedes Benz", logo: "/placeholder.svg", count: 28 },
  { id: "bmw", name: "BMW", logo: "/placeholder.svg", count: 32 },
  { id: "audi", name: "Audi", logo: "/placeholder.svg", count: 30 },
  { id: "bentley", name: "Bentley", logo: "/placeholder.svg", count: 5 },
  { id: "jaguar", name: "Jaguar", logo: "/placeholder.svg", count: 12 },
  { id: "landrover", name: "Landrover", logo: "/placeholder.svg", count: 15 },
  { id: "maserati", name: "Maserati", logo: "/placeholder.svg", count: 3 },
  { id: "volvo", name: "Volvo", logo: "/placeholder.svg", count: 20 },
];

const PopularBrands = ({ variant = "circle" }: PopularBrandsProps) => {
  const isSquare = variant === "square";

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      {isSquare ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 p-1">
          {carBrands.map((brand) => (
            <div 
              key={brand.id}
              className="flex flex-col items-center space-y-2 hover-scale"
            >
              <div className="w-24 h-24 aspect-square flex items-center justify-center bg-white border shadow-sm p-2 rounded-lg">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="w-12 h-12"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{brand.name}</div>
                <div className="text-xs text-muted-foreground">({brand.count})</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex w-max space-x-4 p-4">
          {carBrands.map((brand) => (
            <div 
              key={brand.id}
              className="flex flex-col items-center space-y-2 hover-scale"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white border shadow-sm p-2">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="w-12 h-12"
                />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium">{brand.name}</div>
                <div className="text-xs text-muted-foreground">({brand.count})</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default PopularBrands;
