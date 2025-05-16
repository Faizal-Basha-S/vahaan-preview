
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Eye, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

const Favourites = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("cars");
  const isMobile = useIsMobile();
  
  // Mock data for demonstration
  const mockFavouriteCars = [
    { id: 1, title: "Honda City", price: "₹8,50,000", year: 2019, km: "45,000", location: "Chennai", image: "/placeholder.svg" },
    { id: 2, title: "Hyundai Creta", price: "₹12,75,000", year: 2020, km: "32,000", location: "Bangalore", image: "/placeholder.svg" },
    { id: 3, title: "Tata Nexon", price: "₹9,25,000", year: 2021, km: "28,000", location: "Mumbai", image: "/placeholder.svg" },
  ];

  const mockFavouriteBikes = [
    { id: 1, title: "Royal Enfield Classic 350", price: "₹1,75,000", year: 2020, km: "12,000", location: "Delhi", image: "/placeholder.svg" },
    { id: 2, title: "Bajaj Pulsar NS200", price: "₹1,25,000", year: 2021, km: "8,000", location: "Chennai", image: "/placeholder.svg" },
  ];
  
  // Check authentication
  useEffect(() => {
    if (!currentUser) {
      // Show sign-in modal on mobile instead of redirecting
      if (isMobile) {
        // We'll trigger the auth modal through the bottom nav
        // For now, just go back to home
        navigate("/");
      } else {
        navigate("/");
      }
    }
  }, [currentUser, navigate, isMobile]);

  // If we're still determining if it's mobile, don't render anything
  if (isMobile === undefined) {
    return null;
  }

  // If user is not authenticated, don't render anything
  if (!currentUser) return null;
  
  const MobileFavouritesView = () => (
    <div className="px-4 pt-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-center">Your Saved Cars & Bikes</h1>
        <p className="text-center text-muted-foreground mt-1">Vehicles you've added to favorites</p>
      </motion.div>
      
      <Tabs defaultValue="cars" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="cars" onClick={() => setActiveTab("cars")}>Saved Cars</TabsTrigger>
          <TabsTrigger value="bikes" onClick={() => setActiveTab("bikes")}>Saved Bikes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cars" className="space-y-4">
          {mockFavouriteCars.length > 0 ? (
            mockFavouriteCars.map((car, index) => (
              <motion.div 
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={car.title}
                      className="w-full h-40 object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-yellow-500"
                    >
                      <Star className="h-5 w-5 fill-yellow-500" />
                    </Button>
                  </div>
                  <CardContent className="pt-3 pb-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{car.title}</h3>
                      <p className="font-bold text-primary">{car.price}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.km} km</span>
                      <span>•</span>
                      <span>{car.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 pb-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No saved cars yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing and add cars to your favourites</p>
              <Button className="mt-4" onClick={() => navigate("/search")}>Browse Cars</Button>
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="bikes" className="space-y-4">
          {mockFavouriteBikes.length > 0 ? (
            mockFavouriteBikes.map((bike, index) => (
              <motion.div 
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={bike.image} 
                      alt={bike.title}
                      className="w-full h-40 object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-yellow-500"
                    >
                      <Star className="h-5 w-5 fill-yellow-500" />
                    </Button>
                  </div>
                  <CardContent className="pt-3 pb-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{bike.title}</h3>
                      <p className="font-bold text-primary">{bike.price}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 text-xs text-muted-foreground mt-1">
                      <span>{bike.year}</span>
                      <span>•</span>
                      <span>{bike.km} km</span>
                      <span>•</span>
                      <span>{bike.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 pb-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No saved bikes yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing and add bikes to your favourites</p>
              <Button className="mt-4" onClick={() => navigate("/bikes")}>Browse Bikes</Button>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Desktop view (the original implementation)
  const DesktopFavouritesView = () => (
    <div className="container mx-auto px-4 pt-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Your Favourite Listings</h1>
        <p className="text-muted-foreground mt-2">Easily access the cars and bikes you've shortlisted.</p>
      </div>
      
      <Tabs defaultValue="cars" className="w-full mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="cars" onClick={() => setActiveTab("cars")}>Cars</TabsTrigger>
          <TabsTrigger value="bikes" onClick={() => setActiveTab("bikes")}>Bikes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cars" className="mt-6">
          {mockFavouriteCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFavouriteCars.map((car) => (
                <Card key={car.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <img 
                      src={car.image} 
                      alt={car.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-yellow-500"
                    >
                      <Star className="h-5 w-5 fill-yellow-500" />
                    </Button>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{car.title}</h3>
                      <p className="font-bold text-primary">{car.price}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{car.year}</span>
                      <span>•</span>
                      <span>{car.km} km</span>
                      <span>•</span>
                      <span>{car.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                    <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No favourite cars yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing and add cars to your favourites</p>
              <Button className="mt-4" onClick={() => navigate("/used-cars")}>Browse Cars</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bikes" className="mt-6">
          {mockFavouriteBikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFavouriteBikes.map((bike) => (
                <Card key={bike.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative">
                    <img 
                      src={bike.image} 
                      alt={bike.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-yellow-500"
                    >
                      <Star className="h-5 w-5 fill-yellow-500" />
                    </Button>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{bike.title}</h3>
                      <p className="font-bold text-primary">{bike.price}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{bike.year}</span>
                      <span>•</span>
                      <span>{bike.km} km</span>
                      <span>•</span>
                      <span>{bike.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <Button variant="outline" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                    <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No favourite bikes yet</h3>
              <p className="text-muted-foreground mt-1">Start browsing and add bikes to your favourites</p>
              <Button className="mt-4" onClick={() => navigate("/bike-buy-section")}>Browse Bikes</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <Layout>
      {isMobile ? <MobileFavouritesView /> : <DesktopFavouritesView />}
    </Layout>
  );
};

export default Favourites;
