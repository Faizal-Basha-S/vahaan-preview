
import React, { useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MobileFilterDrawerProps {
  children: React.ReactNode;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  // Popular car models with counts
  const popularModels = [
    { name: "Baleno", count: 277, brand: "Maruti" },
    { name: "Creta", count: 264, brand: "Hyundai" },
    { name: "Swift", count: 241, brand: "Maruti" },
    { name: "City", count: 227, brand: "Honda" },
    { name: "NEXON", count: 227, brand: "Tata" },
    { name: "Grand i 10", count: 218, brand: "Hyundai" },
  ];
  
  // Car brands with counts
  const carBrands = [
    { name: "Maruti", count: 2157, logo: "maruti" },
    { name: "Hyundai", count: 1583, logo: "hyundai" },
    { name: "Tata", count: 831, logo: "tata" },
    { name: "Honda", count: 578, logo: "honda" },
    { name: "Mahindra", count: 532, logo: "mahindra" },
    { name: "Renault", count: 458, logo: "renault" },
    { name: "KIA", count: 278, logo: "kia" },
    { name: "Ford", count: 269, logo: "ford" },
    { name: "Toyota", count: 251, logo: "toyota" },
    { name: "Volkswagen", count: 233, logo: "volkswagen" },
    { name: "Skoda", count: 188, logo: "skoda" },
    { name: "MG", count: 167, logo: "mg" },
    { name: "Nissan", count: 145, logo: "nissan" },
    { name: "Jeep", count: 93, logo: "jeep" },
  ];
  
  // Filter categories
  const filterCategories = [
    "Car Category",
    "Budget",
    "Make & Model",
    "Model Year",
    "Kms Driven",
    "Fuel",
    "Body Type",
    "Transmission",
    "Color",
    "Features",
    "Seats",
    "Owners",
    "RTO",
    "Safety",
    "Discount"
  ];
  
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center bg-white font-medium shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </Button>
      </DrawerTrigger>
      
      <DrawerContent className="h-[90vh] flex flex-col p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Filters</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </DrawerClose>
        </div>
        
        <div className="flex h-full overflow-hidden">
          {/* Left sidebar with filter categories */}
          <div className="w-1/3 bg-blue-50 h-full overflow-y-auto">
            {filterCategories.map((category, index) => (
              <button
                key={index}
                className={`w-full text-left p-4 border-b text-sm ${
                  index === 2 ? "bg-blue-500 text-white" : "text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Right panel with filter content */}
          <div className="w-2/3 h-full flex flex-col">
            <div className="p-4 flex-grow overflow-y-auto">
              {/* Search Brand/Model */}
              <div className="relative mb-6">
                <Input
                  type="text"
                  placeholder="Search a brand or model"
                  className="w-full pl-10"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* Popular Models */}
              <div className="mb-6">
                <h3 className="text-base font-medium mb-3">Popular models</h3>
                <div className="flex flex-wrap gap-2">
                  {popularModels.map((model, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-white rounded-full text-xs py-1 px-3 h-auto"
                    >
                      <div className="w-5 h-5 mr-2">
                        <img 
                          src={`https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/brands/${model.brand.toLowerCase()}.png`}
                          alt={model.brand}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/brands/placeholder.png";
                          }}
                        />
                      </div>
                      {model.name} ({model.count})
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* All Brands */}
              <div>
                <h3 className="text-base font-medium mb-3">All Brands</h3>
                <div className="space-y-2">
                  {carBrands.map((brand, index) => (
                    <div key={index} className="border-b pb-2">
                      <button 
                        className="w-full flex items-center justify-between py-2"
                        onClick={() => setSelectedBrand(selectedBrand === brand.name ? null : brand.name)}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-3 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            <img 
                              src={`https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/brands/${brand.logo.toLowerCase()}.png`}
                              alt={brand.name}
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/brands/placeholder.png";
                              }}
                            />
                          </div>
                          <span>{brand.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-400 mr-2">({brand.count})</span>
                          {selectedBrand === brand.name ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                      </button>
                      
                      {selectedBrand === brand.name && (
                        <div className="py-2 px-4 pl-12 bg-gray-50">
                          <RadioGroup defaultValue="all">
                            <div className="flex items-center space-x-2 mb-2">
                              <RadioGroupItem value="all" id={`${brand.name}-all`} />
                              <Label htmlFor={`${brand.name}-all`}>All Models</Label>
                            </div>
                            {popularModels
                              .filter(model => model.brand === brand.name)
                              .map((model, idx) => (
                                <div key={idx} className="flex items-center space-x-2 mb-2">
                                  <RadioGroupItem value={model.name} id={`${brand.name}-${model.name}`} />
                                  <Label htmlFor={`${brand.name}-${model.name}`}>{model.name}</Label>
                                </div>
                              ))}
                          </RadioGroup>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-base">
                  <span className="font-bold">8175</span> cars
                  <span className="text-gray-500 text-sm ml-1">found</span>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600">Apply filters</Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilterDrawer;
