import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Phone } from "lucide-react";
import LocationInput from "../cars/LocationInput";
import CityModal from "../cars/CityModal";
import { useCityStore } from "@/store/useCityStore";
import { Button } from "../ui/button";

const lightThemeBackgroundImages = [
  
"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",

"https://images.unsplash.com/photo-1624880056139-d1212d7ff347?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"

];

const darkThemeBackgroundImages = [
  
"https://images.unsplash.com/photo-1485291571150-772bcfc10da5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",

"https://images.unsplash.com/photo-1622701579527-dcd1bb5fbb9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImagePreloaded, setNextImagePreloaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const { selectedCity } = useCityStore();
  const navigate = useNavigate();
  
  // Check if dark mode is enabled
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };
    
    // Initial check
    checkDarkMode();
    
    // Set up a mutation observer to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          checkDarkMode();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    // Get the current background images array based on theme
    const backgroundImages = isDarkMode ? darkThemeBackgroundImages : lightThemeBackgroundImages;
    
    // Preload the next image
    const nextIndex = (currentImageIndex + 1) % backgroundImages.length;
    const img = new Image();
    img.src = backgroundImages[nextIndex];
    img.onload = () => setNextImagePreloaded(true);
    
    // Change background image every 8 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
      setNextImagePreloaded(false);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentImageIndex, isDarkMode]);
  
  // Get the current background images array based on theme
  const backgroundImages = isDarkMode ? darkThemeBackgroundImages : lightThemeBackgroundImages;

  // Function to open city modal
  const openCityModal = () => {
    setIsCityModalOpen(true);
  };

  // Function to close city modal
  const closeCityModal = () => {
    setIsCityModalOpen(false);
  };
  
  // Function to handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search term.");
      return;
    }
    
    setSearchError("");
    
    // Build query parameters and navigate to search page
    const queryParams = new URLSearchParams();
    queryParams.append("query", searchQuery);
    
    if (selectedCity) {
      queryParams.append("location", selectedCity);
    }
    
    navigate(`/search?${queryParams.toString()}`);
  };
  
  return (
    <div className="relative min-h-[100dvh] lg:min-h-[950px] xl:min-h-[800px] 2xl:min-h-[850px] w-full overflow-hidden">
      {/* Background Images with Fade Transition */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: index === currentImageIndex ? 1 : 0
          }}
        /> 
      ))}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
      
      {/* Hero Content */}
      <div className="relative z-20 h-full w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-10 sm:pb-12 lg:pb-16 flex flex-col items-center justify-center box-border">
        <div className="w-full max-w-full flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center">
          {/* Left Container - Content */}
          <div id="formDiv" className="w-full lg:w-[60%] xl:w-[65%] backdrop-blur-[6px] border-t-2 border-l-2 border-r border-white/30 border-l-white/10 border-r-white/20 rounded-lg shadow-[inset_0_0_0_300px_rgba(255,255,255,0.09)] p-4 sm:p-6 lg:p-8 font-poppins">
            <div className="inline-block px-2 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-primary-foreground text-[clamp(0.75rem,1.5vw,0.875rem)] lg:text-sm font-medium mb-3 sm:mb-4 animate-fade-in">
              The Ultimate Car Marketplace
            </div>
            
            <h1 className="text-[clamp(1.5rem,4vw,3rem)] lg:text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-white mb-4 sm:mb-6 leading-tight animate-slide-up" style={{ animationDelay: '200ms' }}>
              Buy or Sell Your Vehicle - Directly, Without Any Commission
            </h1>
            
            <p className="text-[clamp(0.875rem,2.5vw,1.125rem)] lg:text-[clamp(0.875rem,2vw,1rem)] text-gray-200 mb-6 sm:mb-8 max-w-2xl animate-slide-up" style={{ animationDelay: '400ms' }}>
              No brokers, No hidden charges. Verified buyers and sellers, Price predictor helps you get the best deal!
            </p>
            
            <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-4 lg:w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search car name, bikes name..."
                    className="w-full bg-white/10 border border-white/20 backdrop-blur-md text-white rounded-md pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-[clamp(0.875rem,2vw,1rem)] lg:text-[clamp(0.875rem,1.5vw,0.9375rem)] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                </div>
              </div>
              
              {searchError && (
                <p className="text-red-500 text-[clamp(0.75rem,1.5vw,0.875rem)] lg:text-sm mt-2 sm:mt-3 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded border border-red-500/20">
                  {searchError}
                </p>
              )}
            </div>
            
            <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-white animate-slide-up" style={{ animationDelay: '800ms' }}>
              <div className="flex items-center">
                <div className="bg-primary/20 backdrop-blur-md p-1.5 sm:p-2 lg:p-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="font-medium text-[clamp(0.875rem,2vw,1rem)] lg:text-[clamp(0.875rem,1.5vw,0.9375rem)]">Fast & Easy</p>
                  <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] lg:text-sm text-gray-300">Find vehicles in minutes</p>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center">
                <div className="bg-primary/20 backdrop-blur-md p-1.5 sm:p-2 lg:p-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="font-medium text-[clamp(0.875rem,2vw,1rem)] lg:text-[clamp(0.875rem,1.5vw,0.9375rem)]">Location Based</p>
                  <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] lg:text-sm text-gray-300">Find vehicles near you</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center">
                <div className="bg-primary/20 backdrop-blur-md p-1.5 sm:p-2 lg:p-1.5 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div className="ml-2 sm:ml-3">
                  <p className="font-medium text-[clamp(0.875rem,2vw,1rem)] lg:text-[clamp(0.875rem,1.5vw,0.9375rem)]">Verified Sellers</p>
                  <p className="text-[clamp(0.75rem,1.5vw,0.875rem)] lg:text-sm text-gray-300">Trusted platform</p>
                </div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2 sm:gap-3 animate-slide-up" style={{ animationDelay: '900ms' }}>
              <div className="w-1/1.5 bg-black/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3">
                <p className="font-medium text-[clamp(0.875rem,2vw,1rem)] text-white">Contact : </p>
                <p className="font-medium text-[clamp(0.875rem,2vw,1rem)] text-white">+91 810-810-4175</p>
                <div className="flex items-center gap-2 sm:gap-3 ml-auto">
                  <a 
                    href="tel:+918108104175" 
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                    aria-label="Call us"
                  >
                    <Phone size={20} />
                  </a>
                  <a 
                    href="https://wa.me/918108104175" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-2 rounded-md transition-colors"
                    aria-label="WhatsApp"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      fill="currentColor" 
                      viewBox="0 0 16 16"
                    >
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Container - Image */}
          <div className="backdrop-blur-[6px] border-t-2 border-l-2 border-r border-white/30 border-l-white/10 border-r-white/20 rounded-lg shadow-[inset_0_0_0_300px_rgba(255,255,255,0.09)] p-4 sm:p-6 font-poppins h-auto lg:w-[40%] xl:w-[35%] hidden lg:flex items-center justify-center">
            <img 
              src="/resource-uploads/req.JPG" 
              alt="Vehicle Marketplace" 
              className="rounded-2xl w-full h-auto max-h-[500px] lg:max-h-[550px] xl:max-h-[600px] 2xl:max-h-[650px] object-contain p-2 sm:p-4"
            />
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
      </div>
      
      {/* City Modal */}
      <CityModal
        isOpen={isCityModalOpen}
        onClose={closeCityModal}
        isMandatory={false}
      />
    </div>
  );
};

export default Hero;
