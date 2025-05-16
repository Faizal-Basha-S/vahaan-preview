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
    }, 6000); // Change slide every 6 seconds
    
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
      color: "#ff3700",
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
    <div className="pt-20 pb-20 px-2">
      {/* Hero Carousel - Updated with solid background colors */}
      <div className="relative w-full mb-6 overflow-hidden px-4 lg:hidden">
  <div className="relative h-[200px] rounded-xl">
    {carouselSlides.map((slide, index) => {
      // Determine slide position based on activeSlide and previous slide direction
      const isEntering = index === activeSlide;
      const isExiting = index === prevSlide;
      const isNextSlide = index > activeSlide || (activeSlide === 0 && index === carouselSlides.length - 1);
      const isPrevSlide = index < activeSlide || (activeSlide === carouselSlides.length - 1 && index === 0);

      let translateClass = "translate-x-0";
      let opacityClass = "opacity-100 z-10";

      if (!isEntering) {
        if (isExiting) {
          // Exiting slide should move to the right
          translateClass = "translate-x-full";
          opacityClass = "opacity-0 z-0";
        } else if (isNextSlide) {
          // Future slides start on the right
          translateClass = "translate-x-full";
          opacityClass = "opacity-0 z-0";
        } else if (isPrevSlide) {
          // Previous slides also start on the right (for right-to-right flow)
          translateClass = "translate-x-full";
          opacityClass = "opacity-0 z-0";
        } else {
          // Default for non-adjacent slides
          translateClass = "translate-x-full";
          opacityClass = "opacity-0 z-0";
        }
      }

      return (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 transform ${translateClass} ${opacityClass}`}
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

      {/* Quick Access Cards */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <Link to="/used-cars" className="block">
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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
      
      {/* Browse Cars by Category */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Browse Cars by Category</h2>
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex space-x-4">
            <Link to="/used-cars?category=suv" className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/60 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M5 18a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M15 18a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M5 18h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2" />
                  <path d="M6 12h12" />
                  <path d="M9 18l-1 -2" />
                  <path d="M9 18l-1 -2" />
                </svg>
              </div>
              <span className="text-xs font-medium">SUV</span>
            </Link>
            
            <Link to="/used-cars?category=hatchback" className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/60 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M5 9l2 -4h7.5c.5 0 1 .5 1 1v4" />
                  <path d="M17 4h1a2 2 0 0 1 2 2v6h-3.5" />
                  <path d="M15 17h-8" />
                  <path d="M5 12v-3h13" />
                </svg>
              </div>
              <span className="text-xs font-medium">Hatchback</span>
            </Link>
            
            <Link to="/used-cars?category=sedan" className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/60 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M5 9l2 -4h7.5c.5 0 1 .5 1 1v4" />
                  <path d="M17 4h1a2 2 0 0 1 2 2v6h-2.5" />
                  <path d="M15 17h-8" />
                  <path d="M5 12v-3h13" />
                </svg>
              </div>
              <span className="text-xs font-medium">Sedan</span>
            </Link>
            
            <Link to="/used-cars?category=luxury" className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/60 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                  <path d="M3 9l4 -4h9a4 4 0 0 1 4 4v4h-2m-4 0h-6" />
                  <path d="M5 9l2 4" />
                  <path d="M10 9l-2 4" />
                </svg>
              </div>
              <span className="text-xs font-medium">Luxury</span>
            </Link>
          </div>
        </ScrollArea>
      </div>
      
      {/* Browse Bikes by Category */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Browse Bikes by Category</h2>
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex space-x-4">
            <Link to="/bike-buy-section?category=commuter" className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/60 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M5 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M19 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M12 19l0 -4l-3 -3l5 -4l2 3l3 0" />
                  <path d="M17 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                </svg>
              </div>
              <span className="text-xs font-medium">Commuter</span>
            </Link>
            
            <Link to="/bike-buy-section?category=sports" className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/60 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M5 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M19 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M7.5 14l5 -2.5l5 2.5" />
                  <path d="M12 11.5l-2.5 -6.5" />
                  <path d="M12 11.5l1 -3.5l2 1l1 -3" />
                </svg>
              </div>
              <span className="text-xs font-medium">Sports</span>
            </Link>
            
            <Link to="/bike-buy-section?category=electric" className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/60 rounded-full flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M5 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M19 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                  <path d="M12 19l0 -4l-3 -3l5 -4l2 3l3 0" />
                  <path d="M11.5 4l-1 4l3 3l3.5 -5" />
                  <path d="M9 17l-2 -3" />
                  <path d="M13 13l1.5 -5" />
                  <path d="M14 16l2 2l1 -4" />
                </svg>
              </div>
              <span className="text-xs font-medium">Electric</span>
            </Link>
          </div>
        </ScrollArea>
      </div>
      
      {/* Cars by Category with Images */}
      <div className="px-4 mb-8">
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
      <div className="px-4 mb-8">
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
      <div className="px-4">
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
  );
};

export default MobileHomeUI;
