
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCarData } from "@/hooks/useVehicleData";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";

const FeaturedCars = () => {
  const { cars, loading, error } = useCarData('recommended', 8);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleCars, setVisibleCars] = useState<typeof cars>([]);
  const itemsPerPage = 4;
  
  useEffect(() => {
    // Calculate visible cars based on current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setVisibleCars(cars.slice(startIndex, endIndex));
  }, [currentPage, cars]);
  
  const totalPages = Math.ceil(cars.length / itemsPerPage);
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Premium Cars</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Premium Cars</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Failed to load cars: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Premium Cars</h2>
        {totalPages > 1 && (
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
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleCars.map((car) => (
          <div key={car.id}>
            <UnifiedVehicleCard vehicle={car} type="car" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCars;
