
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Fuel, Heart, Phone, Gauge, 
  ChevronRight, Star, Share, ThumbsUp, BatteryCharging, Tag,
  CheckCircle2
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { mockBikeListings } from '@/components/bikes/mockBikeListings';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import DetailTabs from '@/components/cars/DetailTabs';
import FloatingNavBar from '@/components/cars/FloatingNavBar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VehicleCard from '@/components/shared/VehicleCard';

const BikeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [bike, setBike] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorited, setFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [activePhotoCategory, setActivePhotoCategory] = useState('exterior');
  const navRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Improved mock image categorization
  const mockImages = {
    exterior: [
      'https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/seller-uploads/temp/bike/front/r15_v3_front.jpg',
      'https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/seller-uploads/temp/bike/left/r15_v3_left.jpg',
      'https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/seller-uploads/temp/bike/right/r15_v3_right.jpg',
      'https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/seller-uploads/temp/bike/rear/r15_v3_back.jpg',
    ],
    interior: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541135413979-1fbc16ae3a01?w=800&auto=format&fit=crop',
    ],
    engine: [
      'https://images.unsplash.com/photo-1621232321663-0cdb9a79a033?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1624277904878-797929989dd8?w=800&auto=format&fit=crop',
    ],
    details: [
      'https://images.unsplash.com/photo-1605557202138-077490166d5f?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535650444294-b8568da1e707?w=800&auto=format&fit=crop',
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      const foundBike = mockBikeListings.find(bike => bike.id.toString() === id);
      setBike(foundBike || null);
      setLoading(false);
    }, 800);
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNavVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (navRef.current) {
      observer.observe(navRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleFavorite = () => {
    setFavorited(!favorited);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handlePhotoCategory = (category: string) => {
    setActivePhotoCategory(category);
  };

  // Overview section - redesigned to match car details layout
  const renderOverviewSection = () => {
    if (!bike) return null;
    
    return (
      <>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Bike Overview</h2>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Make Year</h3>
              <p className="font-medium">{bike.year}</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Register Year</h3>
              <p className="font-medium">{bike.year}</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Register Number</h3>
              <p className="font-medium">UP-14-CD-{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Fuel</h3>
              <p className="font-medium">{bike.fuelType}</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Transmission</h3>
              <p className="font-medium">{bike.transmission}</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Engine CC</h3>
              <p className="font-medium">250 cc</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Ownership</h3>
              <p className="font-medium">1st Owner</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">Insurance</h3>
              <p className="font-medium">Valid till July 2025</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">KM Driven</h3>
              <p className="font-medium">{bike.kmDriven?.toLocaleString() || '15,000'} km</p>
            </div>
            
            <div>
              <h3 className="text-gray-500 text-sm mb-1">BS Norm</h3>
              <p className="font-medium">BS6</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <Separator className="mb-6" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 mb-8">
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span>ABS Braking System</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span>LED Headlamps</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span>Digital Console</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span>USB Charging</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span>Alloy Wheels</span>
            </div>
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <span>Tubeless Tires</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Service History</h2>
          <Separator className="mb-6" />
          
          <div className="space-y-6">
            <div className="flex border-b pb-4">
              <div className="w-28 shrink-0">
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">Regular Service</Badge>
              </div>
              <div className="flex-grow px-4">
                <h3 className="font-medium">Full Service at Authorized Center</h3>
                <p className="text-sm text-gray-500 mt-1">Oil change, brake check, and general inspection completed.</p>
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                July 15, 2023
              </div>
            </div>
            
            <div className="flex border-b pb-4">
              <div className="w-28 shrink-0">
                <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">Repair Work</Badge>
              </div>
              <div className="flex-grow px-4">
                <h3 className="font-medium">Battery Replacement</h3>
                <p className="text-sm text-gray-500 mt-1">Original battery replaced with new one with 2-year warranty.</p>
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                December 10, 2022
              </div>
            </div>
            
            <div className="flex pb-4">
              <div className="w-28 shrink-0">
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">Regular Service</Badge>
              </div>
              <div className="flex-grow px-4">
                <h3 className="font-medium">Routine Maintenance</h3>
                <p className="text-sm text-gray-500 mt-1">Standard service including oil change and filter replacement.</p>
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                May 22, 2022
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Photos section
  const renderPhotosSection = () => {
    if (!bike) return null;
    
    const photoCategories = [
      { id: 'exterior', label: 'Exterior' },
      { id: 'interior', label: 'Interior' },
      { id: 'engine', label: 'Engine' },
      { id: 'details', label: 'Details' }
    ];
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Photos</h2>
        <Separator className="mb-6" />
        
        <div className="mb-6 flex overflow-x-auto space-x-2 pb-2">
          {photoCategories.map(category => (
            <Button
              key={category.id}
              variant={activePhotoCategory === category.id ? "default" : "outline"}
              className="rounded-md"
              onClick={() => handlePhotoCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockImages[activePhotoCategory as keyof typeof mockImages].map((image, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`${bike.name} ${activePhotoCategory} view ${idx + 1}`}
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Inspection section
  const renderInspectionSection = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Inspection Report</h2>
        <Separator className="mb-6" />
        <div className="space-y-4">
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Mechanical Inspection</h3>
                <p className="text-sm text-muted-foreground">Comprehensive mechanical check</p>
              </div>
              <div className="text-sm text-muted-foreground">
                March 15, 2023
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm mb-2">Complete mechanical inspection including engine, transmission, and suspension.</p>
              <Button size="sm" variant="outline">View Report</Button>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Electrical Systems Check</h3>
                <p className="text-sm text-muted-foreground">All electrical components verified</p>
              </div>
              <div className="text-sm text-muted-foreground">
                March 14, 2023
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm mb-2">Complete check of battery, charging system, lights, and electronic systems.</p>
              <Button size="sm" variant="outline">View Details</Button>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <h3 className="font-medium">Frame & Chassis Check</h3>
                <p className="text-sm text-muted-foreground">Detailed inspection</p>
              </div>
              <div className="text-sm text-muted-foreground">
                March 12, 2023
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm mb-2">Verified frame condition with no structural damage or accidents.</p>
              <Button size="sm" variant="outline">View Report</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // FAQ section
  const renderFAQSection = () => {
    if (!bike) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <Separator className="mb-6" />
        <div className="space-y-4">
          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">How old is this bike?</h3>
            <p className="text-sm text-muted-foreground">
              This bike is {new Date().getFullYear() - bike.year} years old, manufactured in {bike.year}.
            </p>
          </div>
          
          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">Is this bike under warranty?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, this bike comes with a manufacturer warranty valid until 2025.
            </p>
          </div>
          
          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">Can I arrange for a test ride?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, you can schedule a test ride by contacting the seller using the contact details provided.
            </p>
          </div>
          
          <div className="bg-white border rounded-md p-4">
            <h3 className="font-medium mb-2">What financing options are available?</h3>
            <p className="text-sm text-muted-foreground">
              We offer various financing options including bank loans and in-house financing. Use the EMI calculator to estimate your monthly payments.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewSection();
      case 'photos':
        return renderPhotosSection();
      case 'inspection':
        return renderInspectionSection();
      case 'faq':
        return renderFAQSection();
      default:
        return null;
    }
  };

  const renderSimilarBikes = () => {
    // Convert id to string for consistent comparison
    const currentId = id?.toString();
    
    const similarBikes = mockBikeListings
      .filter(b => b.id.toString() !== currentId)
      .slice(0, 6);
    
    if (similarBikes.length === 0) return null;
    
    return (
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-6">Similar Bikes to {bike?.name}</h2>
          
          <Carousel className="w-full">
            <CarouselContent>
              {similarBikes.map((bike) => (
                <CarouselItem key={bike.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 p-2">
                  <VehicleCard 
                    vehicle={{
                      ...bike,
                      type: 'bike'
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
            <div className="h-64 w-full max-w-2xl bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!bike) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Bike Not Found</h1>
          <p className="mb-6">The bike you are looking for does not exist or has been removed.</p>
          <Link to="/bikes">
            <Button>Browse Other Bikes</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <Link to="/bikes" className="hover:underline">Used Bikes</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-foreground font-medium truncate">{bike.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Images and Details */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl overflow-hidden mb-8 shadow-sm">
                <Carousel>
                  <CarouselContent>
                    {[bike.image, ...mockImages.exterior].filter(Boolean).map((img, idx) => (
                      <CarouselItem key={idx}>
                        <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={img} 
                            alt={`${bike.name} view ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-black/70 px-3 py-1 rounded-full text-xs">
                    {currentImageIndex + 1}/{[bike.image, ...mockImages.exterior].filter(Boolean).length} Photos
                  </div>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </Carousel>
              </div>
              
              {/* Tabs Navigation */}
              <div ref={navRef}>
                <div className="bg-white rounded-xl shadow-sm mb-6">
                  <div className="flex overflow-x-auto">
                    <button
                      className={`px-6 py-4 font-medium text-sm border-b-2 ${
                        activeTab === 'overview' 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => handleTabChange('overview')}
                    >
                      OVERVIEW & SPECS
                    </button>
                    <button
                      className={`px-6 py-4 font-medium text-sm border-b-2 ${
                        activeTab === 'photos' 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => handleTabChange('photos')}
                    >
                      PHOTOS
                    </button>
                    <button
                      className={`px-6 py-4 font-medium text-sm border-b-2 ${
                        activeTab === 'inspection' 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => handleTabChange('inspection')}
                    >
                      INSPECTION REPORT
                    </button>
                    <button
                      className={`px-6 py-4 font-medium text-sm border-b-2 ${
                        activeTab === 'faq' 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => handleTabChange('faq')}
                    >
                      FAQ
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="transition-all duration-300 ease-in-out">
                {renderTabContent()}
              </div>
            </div>
            
            {/* Right Column - Sticky Info Card */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-20">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h1 className="text-xl font-bold">
                        {bike.year} {bike.name}
                      </h1>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={toggleFavorite}
                        >
                          <Heart className={`h-4 w-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{bike.location}</span>
                    </div>
                    
                    <div className="text-2xl font-bold text-black">
                      {formatPrice(bike.price)}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-4">
                      EMI Starts at {formatPrice(bike.emi || bike.price / 24)}/month.
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center text-center">
                        <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Year</span>
                        <span className="text-sm font-medium">{bike.year}</span>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <Gauge className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">KM Driven</span>
                        <span className="text-sm font-medium">{bike.kmDriven?.toLocaleString() || 'N/A'}</span>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <Fuel className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Fuel</span>
                        <span className="text-sm font-medium">{bike.fuelType}</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md flex items-center">
                        <div className="mr-3">
                          <div className="bg-green-100 dark:bg-green-800/40 p-2 rounded-full">
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-sm">Good Condition</div>
                          <div className="text-xs text-muted-foreground">Inspected and verified</div>
                        </div>
                        <div className="ml-auto">
                          <div className="flex">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <div className="text-xs text-right">4.0 / 5</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 flex items-center shadow-sm justify-center gap-2 py-6">
                        <Phone className="h-5 w-5" />
                        Contact Seller
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Bikes Section */}
        {renderSimilarBikes()}
      </div>
      
      {/* Floating Navigation Bar for Mobile */}
      <FloatingNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isTopNavVisible={isNavVisible}
      />
    </Layout>
  );
};

export default BikeDetail;
