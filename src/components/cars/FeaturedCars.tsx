import { useState, useEffect } from "react";
import CarCard from "./CarCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample car data - now exported so it can be used by other components
export const sampleCars = [
  {
    id: "1",
    title: "2021 BMW 3 Series",
    price: 42000,
    year: 2021,
    mileage: 25000,
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fuelType: "Petrol",
    transmission: "Automatic",
    owner: "First Owner",
    featured: true
  },
  {
    id: "2",
    title: "2019 Tesla Model 3",
    price: 38000,
    year: 2019,
    mileage: 30000,
    location: "San Francisco, CA",
    imageUrl: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fuelType: "Electric",
    transmission: "Automatic",
    owner: "First Owner",
    featured: true
  },
  {
    id: "3",
    title: "2020 Mercedes-Benz C-Class",
    price: 45000,
    year: 2020,
    mileage: 20000,
    location: "Los Angeles, CA",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fuelType: "Petrol",
    transmission: "Automatic",
    owner: "First Owner",
    featured: true
  },
  {
    id: "4",
    title: "2022 Audi A4",
    price: 48000,
    year: 2022,
    mileage: 15000,
    location: "Chicago, IL",
    imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    fuelType: "Diesel",
    transmission: "Automatic",
    owner: "First Owner",
    featured: true
  },
  {
    id: "5",
    title: "2021 Porsche 911",
    price: 115000,
    year: 2021,
    mileage: 18000,
    location: "Miami, FL",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    fuelType: "Petrol",
    transmission: "Automatic",
    owner: "First Owner",
    featured: true
  },
  {
    id: "6",
    title: "2020 Land Rover Range Rover",
    price: 85000,
    year: 2020,
    mileage: 28000,
    location: "Dallas, TX",
    imageUrl: "https://images.unsplash.com/photo-1583870908951-31df91caa240?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    fuelType: "Diesel",
    transmission: "Automatic",
    owner: "First Owner",
    featured: true
  }
];

const FeaturedCars = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCars, setVisibleCars] = useState<typeof sampleCars>([]);
  const itemsPerPage = 4;
  
  useEffect(() => {
    // Calculate visible cars based on current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setVisibleCars(sampleCars.slice(startIndex, endIndex));
  }, [currentPage]);
  
  const totalPages = Math.ceil(sampleCars.length / itemsPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Premium Cars</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevPage}
            className="p-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="View previous cars"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextPage}
            className="p-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="View more cars"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleCars.map((car) => (
          <div key={car.id}>
            <CarCard car={car} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCars;
