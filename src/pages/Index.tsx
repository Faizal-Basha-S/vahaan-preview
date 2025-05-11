
import React, { useEffect, useState } from "react";
import Hero from "../components/home/Hero";
import FeaturedCars from "../components/cars/FeaturedCars";
import FeaturedBikes from "../components/bikes/FeaturedBikes";
import Layout from "../components/layout/Layout";
import { 
  ArrowRight, 
  Car, 
  DollarSign, 
  Handshake, 
  Shield, 
  Lock, 
  Tag 
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import AIFloatingButton from "../components/ui/AIFloatingButton";

const BrandName = () => (
  <span className="relative">
    <span>Vahaan</span>
    <span className="bg-gradient-to-r from-[#F97316] via-[#1D84B5] to-[#0EA5E9] bg-clip-text text-transparent">Xchange</span>
  </span>
);

const Index = () => {
  const [api, setApi] = useState<ReturnType<typeof useEmblaCarousel>[1]>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero />
      
      {/* Why VahaanXchange is Different */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why VahaanXchange is Different</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing how vehicles are bought and sold in India with our transparent, secure platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 - Zero Brokerage */}
            <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Zero Brokerage, Zero Commission</h3>
                  <p className="text-muted-foreground">
                    No middlemen. Buyers and sellers connect directly – no extra charges.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 2 - Transparent Pricing */}
            <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                  <Car size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Transparent Pricing with AI-Powered Prediction</h3>
                  <p className="text-muted-foreground">
                    Our smart price predictor suggests a fair market price to help both parties decide confidently.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 3 - Direct Negotiation */}
            <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                  <Handshake size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Direct Negotiation & Deal Finalization</h3>
                  <p className="text-muted-foreground">
                    We don't interfere in your deal. You meet directly and decide on the price yourself.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 4 - Verified Buyers & Sellers */}
            <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verified Buyers & Sellers</h3>
                  <p className="text-muted-foreground">
                    Every buyer is Aadhar-verified. Every seller is matched with their vehicle's RC name and Aadhar – ensuring authenticity.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 5 - Security & Trust */}
            <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Security & Trust Built-In</h3>
                  <p className="text-muted-foreground">
                    With document verification and a monitored platform, you can transact with peace of mind.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Feature 6 - No Hidden Charges */}
            <div className="glass-card p-6 rounded-xl hover-scale transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full shrink-0">
                  <Tag size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Hidden Charges, Ever</h3>
                  <p className="text-muted-foreground">
                    What you see is what you get. No last-minute surprises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Cars */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedCars />
          
          <div className="mt-10 text-center">
            <Link 
              to="/search" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              View all listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Bikes */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedBikes />
          
          <div className="mt-10 text-center">
            <Link 
              to="/bikes" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              View all listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Call to Action - Now a Slideshow */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl overflow-hidden">
            <Carousel
              setApi={setApi}
              className="w-full relative"
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {/* Car Slide */}
                <CarouselItem className="md:basis-full">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                      <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Car?</h2>
                      <p className="text-muted-foreground mb-6">
                        List your car on VahaanXchange and reach thousands of potential buyers in your area. It's quick, easy, and free to get started.
                      </p>
                      <div>
                        <Link 
                          to="/sell?mode=car" 
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-6"
                        >
                          Post Your Car Ad
                        </Link>
                      </div>
                    </div>
                    <div className="md:w-1/2 h-64 md:h-auto relative">
                      <img 
                        src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                        alt="Selling your car" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>

                {/* Bike Slide */}
                <CarouselItem className="md:basis-full">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                      <h2 className="text-3xl font-bold mb-4">Ready to Sell Your Bike?</h2>
                      <p className="text-muted-foreground mb-6">
                        List your bike on VahaanXchange and connect with passionate riders in your area. It's quick, easy, and free to get started.
                      </p>
                      <div>
                        <Link 
                          to="/sell?mode=bike" 
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-6"
                        >
                          Post Your Bike Ad
                        </Link>
                      </div>
                    </div>
                    <div className="md:w-1/2 h-64 md:h-auto relative">
                      <img 
                        src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                        alt="Selling your bike" 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </CarouselItem>
              </CarouselContent>
              
              <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10">
                <CarouselPrevious className="h-8 w-8 md:h-10 md:w-10 bg-background/80 text-foreground backdrop-blur-sm border-background hover:bg-background" />
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10">
                <CarouselNext className="h-8 w-8 md:h-10 md:w-10 bg-background/80 text-foreground backdrop-blur-sm border-background hover:bg-background" />
              </div>
              
              {/* Slide indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      i === current - 1 
                        ? "bg-primary w-4" 
                        : "bg-primary/30"
                    )}
                    onClick={() => api?.scrollTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 dot-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            <p className="text-muted-foreground mt-2">Hear from our satisfied buyers and sellers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="glass-card p-6 rounded-xl hover-scale">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael Brown</h4>
                  <p className="text-sm text-muted-foreground">Car Buyer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "I found my dream car within a week of searching on VahaanXchange. The filters made it easy to narrow down exactly what I was looking for, and the seller was verified which gave me extra confidence."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="glass-card p-6 rounded-xl hover-scale">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Car Seller</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "Selling my car on VahaanXchange was incredibly simple. I had multiple inquiries within days and sold for a great price. The platform made it easy to communicate with potential buyers."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="glass-card p-6 rounded-xl hover-scale">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/men/62.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">David Wilson</h4>
                  <p className="text-sm text-muted-foreground">Car Dealer</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "As a small dealership, VahaanXchange has become an essential part of our business. The platform's reach and user-friendly interface has helped us connect with more customers than ever before."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={index === 4 ? "none" : "currentColor"} stroke={index === 4 ? "currentColor" : "none"} strokeWidth="2" className="text-primary">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <AIFloatingButton />
    </Layout>
  );
};

export default Index;
