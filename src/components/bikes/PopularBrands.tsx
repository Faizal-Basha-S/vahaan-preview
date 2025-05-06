
import React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface BrandProps {
  id: string;
  name: string;
  logo: string;
  count: number;
}

// Sample data for bike brands
const bikeBrands: BrandProps[] = [
  { id: "honda", name: "Honda", logo: "/placeholder.svg", count: 95 },
  { id: "bajaj", name: "Bajaj", logo: "/placeholder.svg", count: 78 },
  { id: "royalenfield", name: "Royal Enfield", logo: "/placeholder.svg", count: 62 },
  { id: "yamaha", name: "Yamaha", logo: "/placeholder.svg", count: 55 },
  { id: "tvs", name: "TVS", logo: "/placeholder.svg", count: 48 },
  { id: "hero", name: "Hero", logo: "/placeholder.svg", count: 82 },
  { id: "ktm", name: "KTM", logo: "/placeholder.svg", count: 28 },
  { id: "suzuki", name: "Suzuki", logo: "/resource-uploads/7958329b-873f-4c8b-a220-45ef50c8b256.png", count: 42 },
  { id: "jawa", name: "Jawa", logo: "/placeholder.svg", count: 15 },
  { id: "bmw", name: "BMW", logo: "/placeholder.svg", count: 12 },
  { id: "kawasaki", name: "Kawasaki", logo: "/placeholder.svg", count: 18 },
  { id: "harleydavidson", name: "Harley Davidson", logo: "/placeholder.svg", count: 8 },
];

const PopularBrands = () => {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-4 p-4">
        {bikeBrands.map((brand) => (
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default PopularBrands;
