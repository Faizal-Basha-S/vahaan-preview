import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Bike, DollarSign, ShoppingCart } from "lucide-react";
import SpecialSellSection from "./SpecialSellSection";
import AppDownloadSection from "./AppDownloadSection";
import ReviewsSection from "./ReviewsSection";

const MobileHomeUI = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 2;

  // Auto-sliding functionality - updated to 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 8000); // Change slide every 6 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Handle manual navigation
  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const carouselSlides = [
    {
      title: "Sell with Us, with verified Buyers",
      description: "No Commission, No Fees – Set a Fair Price, Negotiate Directly with Verified Buyers!",
      color: "#ff7b00",
      linkTo: "/sell"
    },
    {
      title: "Buy with Us, with verified Buyers",
      description: "No Brokerage, No Hidden Charges – Contact Sellers with a Fair Price & Save Big!",
      color: "#0033ff",
      linkTo: "/used-cars"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Carousel Container */}
      <div className="w-full bg-[#f4e7ff] pt-6 pb-5">
        {/* Mobile Hero Carousel */}
        <div className="relative w-full mb-6 overflow-hidden px-4 lg:hidden">
          <div className="relative h-[200px] rounded-xl">
            {carouselSlides.map((slide, index) => {
              let slideClass = "";

              if (index === activeSlide) {
                slideClass = "translate-x-0 opacity-100 z-10";
              } else if (
                (index === (activeSlide + 1) % carouselSlides.length) ||
                (activeSlide === carouselSlides.length - 1 && index === 0)
              ) {
                slideClass = "translate-x-full opacity-0 z-0";
              } else {
                slideClass = "-translate-x-full opacity-0 z-0";
              }

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 transform ${slideClass}`}
                >
                  <div
                    className="h-full w-full rounded-xl shadow-md p-6 flex flex-col justify-center"
                    style={{ backgroundColor: slide.color }}
                  >
                    <h1 className="text-xl font-bold mb-2 text-white">{slide.title}</h1>
                    <p className="text-sm text-white">{slide.description}</p>
                    <Link
                      to={slide.linkTo}
                      className="mt-4 inline-flex self-start bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center z-20 gap-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-[3px] rounded-full transition-all ${
                    activeSlide === index ? "bg-white w-6" : "bg-white/60 w-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Hero Carousel */}
        <div className="hidden lg:block relative w-full mb-6 overflow-hidden px-4">
          <div className="relative h-[200px] rounded-xl">
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <div className="relative h-full w-full rounded-xl shadow-md overflow-hidden">
                  {/* Background Color */}
                  <div 
                    className="absolute inset-0"
                    style={{ backgroundColor: slide.color }}
                  />

                  {/* Text Content */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
                    <h1 className="text-xl font-bold text-white mb-2 drop-shadow">{slide.title}</h1>
                    <p className="text-sm text-white drop-shadow">{slide.description}</p>
                    <Link 
                      to={slide.linkTo} 
                      className="mt-4 inline-flex bg-white text-gray-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center z-20 gap-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-[3px] rounded-full transition-all ${
                    activeSlide === index ? "bg-white w-6" : "bg-white/60 w-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-[#f4e7ff]">
      <div className="w-full bg-[#f9f2ff] pt-9 rounded-t-3xl border-t-2 border-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-2px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.1)]">
        {/* Quick Access Cards */}
        <div className="px-10 mb-8">
          <div className="grid grid-cols-2 gap-7">
            <Link to="/used-cars" className="block">
            <Card className="border border-white bg-[#faf4ff] rounded-t-xl shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)]">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                    <Car className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-medium text-sm">Buy Used Car</h3>
                  <p className="text-xs text-muted-foreground mt-1">Find your perfect car</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/bike-buy-section" className="block">
            <Card className="border border-white bg-[#faf4ff] rounded-t-xl shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)]">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                    <Bike className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-medium text-sm">Buy Used Bike</h3>
                  <p className="text-xs text-muted-foreground mt-1">Find your perfect bike</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/sell?mode=car" className="block">
            <Card className="border border-white bg-[#faf4ff] rounded-t-xl shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)]">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-3">
                    <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-medium text-sm">Sell Car</h3>
                  <p className="text-xs text-muted-foreground mt-1">Get instant valuation</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/sell?mode=bike" className="block">
            <Card className="border border-white bg-[#faf4ff] rounded-t-xl shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)]">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-3">
                    <ShoppingCart className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="font-medium text-sm">Sell Bike</h3>
                  <p className="text-xs text-muted-foreground mt-1">Fastest way to sell bikes</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Rest of the content sections */}
        <div className="px-4">
          {/* Browse Cars by Category */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Browse Cars by Category</h2>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex space-x-4">
                <Link to="/search?budget=5 Lakhs" className="flex flex-col items-center">
                <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
                    <span className="text-sm font-medium text-gray-800">5 Lakhs</span>
                  </div>
                </Link>
                
                <Link to="/search?budget=10 Lakhs" className="flex flex-col items-center">
                <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
                    <span className="text-sm font-medium text-gray-800">10 Lakhs</span>
                  </div>
                </Link>
                
                <Link to="/search?budget=15 Lakhs" className="flex flex-col items-center">
                <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
                    <span className="text-sm font-medium text-gray-800">15 Lakhs</span>
                  </div>
                </Link>
              </div>
            </ScrollArea>
          </div>

          {/* Browse Bikes by Category */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Browse Bikes by Category</h2>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex space-x-4">
                <Link to="/bikes?budget=5 Lakhs" className="flex flex-col items-center">
                <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
                    <span className="text-sm font-medium text-gray-800">5 Lakhs</span>
                  </div>
                </Link>
                
                <Link to="/bikes?budget=10 Lakhs" className="flex flex-col items-center">
                <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
                    <span className="text-sm font-medium text-gray-800">10 Lakhs</span>
                  </div>
                </Link>
                
                <Link to="/bikes?budget=15 Lakhs" className="flex flex-col items-center">
                <div className="w-24 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-[0_0_10px_rgba(0,0,0,0.1),inset_0_2px_4px_-2px_rgba(255,255,255,0.1)] border border-white">
                    <span className="text-sm font-medium text-gray-800">15 Lakhs</span>
                  </div>
                </Link>
              </div>
            </ScrollArea>
          </div>

          {/* Cars by Category with Images */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Cars by Category</h2>
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-4">
                <Link to="/used-cars?category=suv" className="w-40 flex-shrink-0">
                  <div className="w-full rounded-md overflow-hidden shadow-sm">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
                        alt="SUV" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <span className="text-sm font-medium">SUV</span>
                    </div>
                  </div>
                </Link>
                
                <Link to="/used-cars?category=hatchback" className="w-40 flex-shrink-0">
                  <div className="w-full rounded-md overflow-hidden shadow-sm">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src="https://images.unsplash.com/photo-1471444928139-48c5bf13b240?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80" 
                        alt="Hatchback" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <span className="text-sm font-medium">Hatchback</span>
                    </div>
                  </div>
                </Link>
                
                <Link to="/used-cars?category=sedan" className="w-40 flex-shrink-0">
                  <div className="w-full rounded-md overflow-hidden shadow-sm">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src="https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
                        alt="Sedan" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <span className="text-sm font-medium">Sedan</span>
                    </div>
                  </div>
                </Link>
              </div>
            </ScrollArea>
          </div>

          {/* Bikes by Category with Images */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Bikes by Category</h2>
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-4">
                <Link to="/bike-buy-section?category=commuter" className="w-40 flex-shrink-0">
                  <div className="w-full rounded-md overflow-hidden shadow-sm">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                        alt="Commuter" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <span className="text-sm font-medium">Commuter</span>
                    </div>
                  </div>
                </Link>
                
                <Link to="/bike-buy-section?category=sports" className="w-40 flex-shrink-0">
                  <div className="w-full rounded-md overflow-hidden shadow-sm">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                        alt="Sports" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <span className="text-sm font-medium">Sports</span>
                    </div>
                  </div>
                </Link>
                
                <Link to="/bike-buy-section?category=electric" className="w-40 flex-shrink-0">
                  <div className="w-full rounded-md overflow-hidden shadow-sm">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src="https://images.unsplash.com/photo-1599662875904-9e8922e389df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                        alt="Electric" 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <span className="text-sm font-medium">Electric</span>
                    </div>
                  </div>
                </Link>
              </div>
            </ScrollArea>
          </div>

          {/* Special Mobile-Only Sections */}
          <div>
            {/* What's Special About Us Section */}
            <h2 className="text-lg font-semibold mb-3">What's Special About Us</h2>
            <SpecialSellSection />
            
            {/* Download Our App Section */}
            <h2 className="text-lg font-semibold mb-3">Download Our App</h2>
            <AppDownloadSection />
            
            {/* Review Section */}
            <ReviewsSection />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MobileHomeUI;
