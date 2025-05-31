
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBikeData } from "@/hooks/useVehicleData";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";

const FeaturedBikes = () => {
  const { bikes, loading, error } = useBikeData('recommended', 8);
  const [currentPage, setCurrentPage] = useState(0);
  const [visibleBikes, setVisibleBikes] = useState<typeof bikes>([]);
  const itemsPerPage = 4;
  
  useEffect(() => {
    // Calculate visible bikes based on current page
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setVisibleBikes(bikes.slice(startIndex, endIndex));
  }, [currentPage, bikes]);
  
  const totalPages = Math.ceil(bikes.length / itemsPerPage);
  
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
          <h2 className="text-2xl font-bold">Premium Bikes</h2>
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
          <h2 className="text-2xl font-bold">Premium Bikes</h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Failed to load bikes: {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Premium Bikes</h2>
        {totalPages > 1 && (
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
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {visibleBikes.map((bike) => (
          <div key={bike.id}>
            <UnifiedVehicleCard vehicle={bike} type="bike" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedBikes;
