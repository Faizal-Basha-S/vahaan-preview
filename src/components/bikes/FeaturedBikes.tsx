
import { useState, useEffect } from "react";
import BikeCard from "./BikeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample bike data
const sampleBikes = [
  {
    id: 1,
    name: "Royal Enfield Classic 350",
    image: "/placeholder.svg",
    year: 2021,
    kmDriven: 5000,
    fuelType: "Petrol",
    transmission: "Manual",
    owner: "First Owner",
    bikeType: "Cruiser",
    color: "Black",
    seats: 2,
    price: 195000,
    location: "Mumbai",
    seller: "Certified Dealer",
    badges: ["Certified", "Well Maintained"]
  },
  {
    id: 2,
    name: "Honda CB Shine",
    image: "/placeholder.svg",
    year: 2020,
    kmDriven: 8500,
    fuelType: "Petrol",
    transmission: "Manual",
    owner: "First Owner",
    bikeType: "Commuter",
    color: "Blue",
    seats: 2,
    price: 75000,
    location: "Delhi",
    seller: "Individual",
    badges: ["Good Condition"]
  },
  {
    id: 3,
    name: "Yamaha R15 V3",
    image: "/placeholder.svg",
    year: 2022,
    kmDriven: 3000,
    fuelType: "Petrol",
    transmission: "Manual",
    owner: "First Owner",
    bikeType: "Sports",
    color: "Red",
    seats: 2,
    price: 175000,
    location: "Bangalore",
    seller: "Certified Dealer",
    badges: ["Certified", "Top Model"]
  },
  {
    id: 4,
    name: "TVS Jupiter",
    image: "/placeholder.svg",
    year: 2021,
    kmDriven: 4500,
    fuelType: "Petrol",
    transmission: "Automatic",
    owner: "First Owner",
    bikeType: "Scooty",
    color: "Grey",
    seats: 2,
    price: 65000,
    location: "Chennai",
    seller: "Individual",
    badges: ["Well Maintained"],
    features: ["Alloy Wheels", "Keyless Start"]
  },
  {
    id: 5,
    name: "Bajaj Pulsar NS200",
    image: "/placeholder.svg",
    year: 2020,
    kmDriven: 12000,
    fuelType: "Petrol",
    transmission: "Manual",
    owner: "Second Owner",
    bikeType: "Sports",
    color: "Black",
    seats: 2,
    price: 105000,
    location: "Pune",
    seller: "Certified Dealer",
    badges: ["Certified"]
  },
  {
    id: 6,
    name: "Hero Electric Optima",
    image: "/placeholder.svg",
    year: 2022,
    kmDriven: 1500,
    fuelType: "Electric",
    transmission: "Automatic",
    owner: "First Owner",
    bikeType: "Electric",
    color: "White",
    seats: 2,
    price: 85000,
    location: "Hyderabad",
    seller: "Individual",
    badges: ["Eco-friendly"]
  }
];

const FeaturedBikes = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleBikes, setVisibleBikes] = useState<typeof sampleBikes>([]);
  const itemsPerPage = 4;
  
  useEffect(() => {
    // Calculate visible bikes based on current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setVisibleBikes(sampleBikes.slice(startIndex, endIndex));
  }, [currentPage]);
  
  const totalPages = Math.ceil(sampleBikes.length / itemsPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Premium Bikes</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            className="p-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="View previous bikes"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextPage}
            className="p-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="View more bikes"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleBikes.map((bike) => (
          <div key={bike.id}>
            <BikeCard bike={bike} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBikes;
