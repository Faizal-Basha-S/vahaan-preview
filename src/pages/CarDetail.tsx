import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  Calendar, MapPin, Fuel, Heart, Phone, Gauge, 
  ChevronRight, Star, Share, ThumbsUp
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { mockCarListings } from '@/data/mockCarListings';
import { CarType } from '@/types/car';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import DetailNavBar from '@/components/cars/DetailNavBar';
import SimilarCarsSection from '@/components/cars/SimilarCarsSection';
import CarOverviewSection from '@/components/cars/CarOverviewSection';
import CarPhotosSection from '@/components/cars/CarPhotosSection';
import InspectionReportSection from '@/components/cars/InspectionReportSection';
import FAQSection from '@/components/cars/FAQSection';
import DetailTabs from '@/components/cars/DetailTabs';
import FloatingNavBar from '@/components/cars/FloatingNavBar';
import SimilarCarsCarousel from '@/components/cars/SimilarCarsCarousel';
import { useIsMobile } from '@/hooks/use-mobile';

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const fromMobile = location.state?.fromMobile || false;
  const [car, setCar] = useState<CarType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [layoutReady, setLayoutReady] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const contentRefs = {
    overview: useRef<HTMLDivElement>(null),
    photos: useRef<HTMLDivElement>(null),
    inspection: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null)
  };
  
  const mockImages = [
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&auto=format&fit=crop',
  ];
  
  useEffect(() => {
    const fetchCar = async () => {
      setIsLoading(true);
      try {
        const foundCar = mockCarListings.find(car => car.id === id);
        
        if (foundCar) {
          setCar(foundCar);
        } else {
          console.error('Car not found');
        }
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCar();
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

    // Wait a short moment to ensure stable layout rendering
    // This helps prevent layout flashing
    const timer = setTimeout(() => {
      setLayoutReady(true);
    }, 10);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleBookmark = () => {
    setIsBookmarked(prev => !prev);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return car ? <CarOverviewSection car={car} /> : null;
      case 'photos':
        return car ? <CarPhotosSection images={mockImages} carTitle={car.title} /> : null;
      case 'inspection':
        return <InspectionReportSection />;
      case 'faq':
        return <FAQSection />;
      default:
        return null;
    }
  };

  // Don't render anything until layoutReady is true
  if (!layoutReady) {
    return (
      <Layout>
        <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
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
  
  if (!car) {
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
            <span className="text-foreground font-medium truncate">{car.title}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-2xl overflow-hidden mb-8 shadow-sm">
                <Carousel>
                  <CarouselContent>
                    {mockImages.map((img, idx) => (
                      <CarouselItem key={idx}>
                        <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={img} 
                            alt={`${car.title} view ${idx + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-black/70 px-3 py-1 rounded-full text-xs">
                    1/4 Photos
                  </div>
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
                </Carousel>
              </div>
              
              <div ref={navRef}>
                <DetailTabs 
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              </div>
              
              <div className="transition-all duration-300 ease-in-out">
                {renderTabContent()}
              </div>
            </div>
            
            <div className="w-full lg:w-1/3">
              <div className="sticky top-20">
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h1 className="text-xl font-bold">
                        {car.year} {car.title}
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
                      <span>{car.location}</span>
                    </div>
                    
                    <div className="text-2xl font-bold text-black">
                      ₹{car.price.toLocaleString()}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-4">
                      EMI Starts at ₹{car.emi?.toLocaleString() || '6,500'}/month.
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
                        <span className="text-sm font-medium">{car.mileage.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex flex-col items-center text-center">
                        <Fuel className="h-5 w-5 text-muted-foreground mb-1" />
                        <span className="text-xs text-muted-foreground">Fuel</span>
                        <span className="text-sm font-medium">{car.fuelType || car.fuel || 'Petrol'}</span>
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
        
        <SimilarCarsCarousel 
          currentCarId={car.id}
          currentCarTitle={car.title}
          similarCars={mockCarListings.filter(c => c.id !== id).slice(0, 6)}
        />
      </div>
      
      <FloatingNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isTopNavVisible={isNavVisible}
      />
    </Layout>
  );
};

export default CarDetail;
