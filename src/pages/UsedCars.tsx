import React from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Calendar, Fuel, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import EconomyHeroSection from "@/components/cars/EconomyHeroSection";
import { useCarData } from "@/hooks/useVehicleData";
import UnifiedVehicleCard from "@/components/shared/UnifiedVehicleCard";
import PopularBrands from "@/components/cars/PopularBrands";
import { getCityImageUrl } from "@/utils/cityImages";

const UsedCars = () => {
  const { cars: recommendedCars, loading: loadingRecommended } = useCarData('recommended', 4);
  const { cars: discountedCars, loading: loadingDiscounted } = useCarData('discounted', 4);
  
  const bodyTypes = ["SUV", "Hatchback", "Sedan", "MUV", "Convertible", "Coupe"];
  const budgetRanges = ["Under 5 Lakh", "5-10 Lakh", "10-15 Lakh", "15-20 Lakh", "Above 20 Lakh"];
  const popularCities = ["Ahmedabad", "Bangalore", "Chandigarh", "Chennai", "Delhi NCR", "Gurgaon", "Hyderabad", "Jaipur", "Mumbai", "New Delhi", "Noida", "Pune"];
  const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "LPG"];

  const renderCarSection = (title: string, cars: any[], loading: boolean, viewAllLink: string) => (
    <section className="mb-12 px-0 sm:px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <Link to={viewAllLink} className="text-blue-600 dark:text-blue-400 hover:underline">
          View All
        </Link>
      </div>
    
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-64 p-2"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible">
          {cars.map(car => (
            <div key={car.id} className="p-2">
              <UnifiedVehicleCard vehicle={car} type="car" />
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" size="icon" className="rounded-full">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-6 lg:pt-24">
        <EconomyHeroSection />

        <div className="w-full">
          {/* Popular Car Brands Section */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Popular Car Brands</h2>
            <div className="square-brands-container">
              <PopularBrands />
            </div>
          </section>

          {renderCarSection("Recommended Cars", recommendedCars, loadingRecommended, "/search")}
          {renderCarSection("Discounted Cars", discountedCars, loadingDiscounted, "/search")}

          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Shop by Budget</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {budgetRanges.map(range => (
                <Link to={`/search?budget=${range}`} key={range}>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 flex flex-col">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">{range}</h3>
                      <p className="text-sm text-muted-foreground mb-4">Find the perfect car in your budget range</p>
                      <div className="mt-auto">
                        <Button variant="outline" className="w-full">Explore Cars</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Browse by Body Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {bodyTypes.map(type => (
                <Link to={`/search?bodyType=${type}`} key={type}>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-16 sm:w-20 h-16 sm:h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                        <Car className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-medium text-center">{type}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Shop by Fuel Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {fuelTypes.map(type => (
                <Link to={`/search?fuelType=${type}`} key={type}>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-14 sm:w-16 h-14 sm:h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-3">
                        <Fuel className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <h3 className="font-medium text-center">{type}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Popular Cities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {popularCities.map(city => (
                <Link to={`/search?city=${city}`} key={city}>
                  <Card className="shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center">
                      <div className="w-26 h-26 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                        <img 
                          src={getCityImageUrl(city)}
                          alt={`${city} Icon`} 
                          className="h-50 sm:h-50 w-40 sm:w-40 rounded-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium text-center">{city}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
          
          <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Why Choose VahaanXchange?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Trusted by Millions</h3>
                <p className="text-sm text-muted-foreground">Buy or sell vehicles easily and confidently.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Sell in Minutes</h3>
                <p className="text-sm text-muted-foreground">No wait, no hassle — just quick, fair deals.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Tag className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Pricing</h3>
                <p className="text-sm text-muted-foreground">AI ensures the best value for your car or budget.</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Compare with Ease</h3>
                <p className="text-sm text-muted-foreground">Side-by-side car views to find your perfect match.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-8 text-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Ready to find your dream car?</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">Browse our extensive collection of quality used cars and find the perfect match for your needs and budget.</p>
              <Link to="/search">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Explore All Cars
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default UsedCars;
