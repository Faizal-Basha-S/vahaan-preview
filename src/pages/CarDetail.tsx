
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, MapPin, Fuel, Heart, Phone, Gauge, 
  ChevronRight, Star, Share, ThumbsUp, Lock, BatteryCharging
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useVehicleDetails } from '@/hooks/useVehicleData';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicle: car, loading, error } = useVehicleDetails(id || '', 'car');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activePhotoCategory, setActivePhotoCategory] = useState<string>('');
  
  const formatIndianCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getFuelIcon = (fuelType: string) => {
    if (fuelType?.toLowerCase().includes('electric')) {
      return <BatteryCharging className="h-5 w-5 text-muted-foreground mb-1" />;
    }
    return <Fuel className="h-5 w-5 text-muted-foreground mb-1" />;
  };

  const handleBookmark = () => {
    setIsBookmarked(prev => !prev);
  };

  const getPhotoCategories = () => {
    if (!car?.photos || typeof car.photos !== 'object') return {};
    return car.photos as Record<string, string[]>;
  };

  const photoCategories = getPhotoCategories();
  const categoryNames = Object.keys(photoCategories);

  useEffect(() => {
    if (categoryNames.length > 0 && !activePhotoCategory) {
      setActivePhotoCategory(categoryNames[0]);
    }
  }, [categoryNames, activePhotoCategory]);

  const handleImageClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const getMainImage = () => {
    const categories = Object.values(photoCategories);
    for (const category of categories) {
      if (Array.isArray(category) && category.length > 0) {
        return category[0];
      }
    }
    return "/placeholder.svg";
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
  
  if (error || !car) {
    return (
      <Layout>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
          <p className="mb-6">The car you are looking for does not exist or has been removed.</p>
          <Link to="/search">
            <Button>Browse Other Cars</Button>
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
            <Link to="/search" className="hover:underline">Used Cars</Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-foreground font-medium truncate">{car.brand} {car.model}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              {/* Main Image */}
              <div className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm">
                <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={getMainImage()} 
                    alt={`${car.brand} ${car.model}`} 
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handleImageClick(getMainImage())}
                  />
                </div>
              </div>
              
              {/* Overview Section */}
              <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Overview</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="flex flex-col items-center text-center">
                    <Calendar className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Year</span>
                    <span className="font-semibold">{car.year}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    {getFuelIcon(car.fuel_type)}
                    <span className="text-sm text-muted-foreground">Fuel Type</span>
                    <span className="font-semibold">{car.fuel_type || 'N/A'}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <Gauge className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Engine</span>
                    <span className="font-semibold">{car.cc ? `${car.cc}cc` : 'N/A'}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <Gauge className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">KM Driven</span>
                    <span className="font-semibold">{car.kms_driven?.toLocaleString() || 0}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">Registration Number</h3>
                        <div className="flex items-center mt-1">
                          <span className="blur-sm select-none pointer-events-none">UP-14-CD-2706</span>
                          <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">Seller Contact</h3>
                        <div className="flex items-center mt-1">
                          <span className="blur-sm select-none pointer-events-none">+91 9898989898</span>
                          <Lock className="h-4 w-4 ml-2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {car.features && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Features</h3>
                    <p className="text-muted-foreground">{car.features}</p>
                  </div>
                )}
              </div>
              
              {/* Photos Section */}
              {categoryNames.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6">Photos</h2>
                  
                  {/* Category Tabs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categoryNames.map((category) => (
                      <button
                        key={category}
                        onClick={() => setActivePhotoCategory(category)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          activePhotoCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {category} ({photoCategories[category]?.length || 0})
                      </button>
                    ))}
                  </div>
                  
                  {/* Photo Grid */}
                  {activePhotoCategory && photoCategories[activePhotoCategory] && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photoCategories[activePhotoCategory].map((photo, index) => (
                        <div 
                          key={index}
                          className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleImageClick(photo)}
                        >
                          <img 
                            src={photo} 
                            alt={`${activePhotoCategory} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="sticky top-20">
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h1 className="text-xl font-bold">
                        {car.year} {car.brand} {car.model}
                      </h1>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Share className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={handleBookmark}
                        >
                          <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{car.vehicle_city}</span>
                    </div>
                    
                    <div className="text-2xl font-bold text-primary mb-4">
                      {formatIndianCurrency(car.sell_price)}
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col items-center text-center">
                        <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Year</span>
                        <span className="text-sm font-medium">{car.year}</span>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <Gauge className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">KM Driven</span>
                        <span className="text-sm font-medium">{car.kms_driven?.toLocaleString() || 0}</span>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        {getFuelIcon(car.fuel_type)}
                        <span className="text-xs text-muted-foreground">Fuel</span>
                        <span className="text-sm font-medium">{car.fuel_type || 'N/A'}</span>
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
      </div>
    </Layout>
  );
};

export default CarDetail;
