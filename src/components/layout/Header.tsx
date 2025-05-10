import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import SearchBar from "../cars/SearchBar";
import { useVehicle } from "@/context/VehicleContext";
import AuthButtons from "../auth/AuthButtons";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { vehicleType } = useVehicle();
  const { userProfile } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
      
      const heroHeight = window.innerHeight * 0.4;
      setShowSearchBar(scrollPosition > heroHeight);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const getActiveItem = () => {
    const { pathname } = location;
    
    if (pathname === '/') return 'home';
    if (pathname.includes('/about') || pathname.includes('/services')) return 'services';
    if (pathname.includes('/cars-buy-section')) return 'cars';
    if (pathname.includes('/bikes')) return 'bikes';
    
    if (pathname.includes('/sell')) {
      return vehicleType === 'car' ? 'cars' : 'bikes';
    }
    
    return null;
  };

  const activeItem = getActiveItem();

  const isNavItemActive = (item: string) => {
    if (hoveredItem) return hoveredItem === item;
    return activeItem === item;
  };

  const handleProfessionalServicesClick = () => {
    navigate('/about');
    setTimeout(() => {
      const findProfessionalsButton = document.getElementById('find-professionals');
      if (findProfessionalsButton) {
        findProfessionalsButton.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleSellNavigation = (mode: 'car' | 'bike') => {
    navigate(`/sell?mode=${mode}`);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary flex items-center gap-2 group"
          >
            <img 
              src="/resource-uploads/a47ef4ec-4126-4237-8391-444437db8ec1.png" 
              alt="VahaanXchange Logo" 
              className="h-12 w-auto"
            />
            <span className="inline-block bg-gradient-to-r from-orange-600 via-[#552277] to-blue-700 bg-clip-text text-transparent font-bold">VahaanXchange</span>
          </Link>

          <div 
            ref={searchBarRef}
            className={`absolute left-[40%] transform -translate-x-1/2 transition-all duration-500 ease-out ${
              showSearchBar 
                ? 'opacity-100 scale-100 top-1/2 -translate-y-1/2' 
                : 'opacity-0 scale-95 top-0 -translate-y-full pointer-events-none'
            }`}
          >
            <SearchBar isCompact={true} className="w-64 md:w-72 lg:w-80 xl:w-96 shadow transition-all" />
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-link font-medium transition-colors ${
                isNavItemActive('home') 
                  ? 'text-primary link-underline after:scale-x-100 after:origin-bottom-left' 
                  : 'text-foreground hover:text-primary link-underline'
              }`}
              onMouseEnter={() => setHoveredItem('home')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              Home
            </Link>
            
            <div 
              className="relative group"
              onMouseEnter={() => setHoveredItem('cars')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <a 
                href="#" 
                onClick={handleDropdownClick} 
                className={`nav-link font-medium transition-colors flex items-center ${
                  isNavItemActive('cars') 
                    ? 'text-primary link-underline after:scale-x-100 after:origin-bottom-left' 
                    : 'text-foreground hover:text-primary link-underline'
                }`}
              >
                Cars
              </a>
              <ul className="absolute left-0 top-full mt-2 w-60 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <li className="border-b border-gray-100 dark:border-gray-800">
                  <Link to="/used-cars" className="block px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-primary">
                    Buy Cars
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => handleSellNavigation('car')} 
                    className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-primary"
                  >
                    Sell Cars
                  </button>
                </li>
              </ul>
            </div>
            
            <div 
              className="relative group"
              onMouseEnter={() => setHoveredItem('bikes')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <a 
                href="#" 
                onClick={handleDropdownClick}
                className={`nav-link font-medium transition-colors flex items-center ${
                  isNavItemActive('bikes') 
                    ? 'text-primary link-underline after:scale-x-100 after:origin-bottom-left' 
                    : 'text-foreground hover:text-primary link-underline'
                }`}
              >
                Bikes
              </a>
              <ul className="absolute left-0 top-full mt-2 w-60 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <li className="border-b border-gray-100 dark:border-gray-800">
                  <Link to="/bike-buy-section" className="block px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-primary">
                    Buy Bikes
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => handleSellNavigation('bike')} 
                    className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-primary"
                  >
                    Sell Bikes
                  </button>
                </li>
              </ul>
            </div>
            
            <div 
              className="relative group"
              onMouseEnter={() => setHoveredItem('services')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link 
                to="/about" 
                className={`nav-link font-medium transition-colors flex items-center ${
                  isNavItemActive('services') 
                    ? 'text-primary link-underline after:scale-x-100 after:origin-bottom-left' 
                    : 'text-foreground hover:text-primary link-underline'
                }`}
              >
                Services
              </Link>
              <ul className="absolute left-0 top-full mt-2 w-60 rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <li className="border-b border-gray-100 dark:border-gray-800">
                  <Link to="/about" className="block px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-primary">
                    Verified Buy & Sell Platform
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleProfessionalServicesClick} 
                    className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-secondary hover:text-primary"
                  >
                    Professional Services
                  </button>
                </li>
              </ul>
            </div>
            
            <Link to="/sell">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-full"
              >
                Post Ad
              </Button>
            </Link>
            
            <div className="flex items-center space-x-4">
              <AuthButtons className="ml-2" />
              <ThemeToggle />
            </div>
          </nav>
          
          <div className="flex items-center md:hidden space-x-4">
            <Link to="/sell">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-full text-sm"
                size="sm"
              >
                Post Ad
              </Button>
            </Link>
            <AuthButtons />
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary animated-border"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg mt-3">
          <div className="px-3 py-2">
            <SearchBar isCompact={true} className="w-full transition-all" />
          </div>
          
          {userProfile && (
            <div className="px-3 py-2 flex items-center">
              <div className="flex flex-col">
                {userProfile.displayName && (
                  <span className="font-medium">
                    Welcome, {userProfile.displayName.split(' ')[0]}!
                  </span>
                )}
                <span className="text-sm text-muted-foreground">{userProfile.phoneNumber}</span>
              </div>
            </div>
          )}
          
          {userProfile && <Separator className="my-2" />}
          
          <Link 
            to="/" 
            className={`block px-3 py-3 rounded-md text-base font-medium hover:bg-secondary ${
              isNavItemActive('home') ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            Home
          </Link>
          
          <div className="px-3 py-1">
            <div className="flex items-center justify-between w-full py-2 text-base font-medium">
              <a 
                href="#" 
                onClick={handleDropdownClick} 
                className={isNavItemActive('cars') ? 'text-primary' : 'text-foreground hover:text-primary'}
              >
                Cars
              </a>
            </div>
            <div className="pl-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
              <Link to="/used-cars" className="block py-2 text-sm text-foreground hover:text-primary">
                Buy Cars
              </Link>
              <button 
                onClick={() => handleSellNavigation('car')} 
                className="block w-full text-left py-2 text-sm text-foreground hover:text-primary"
              >
                Sell Cars
              </button>
            </div>
          </div>
          
          <div className="px-3 py-1">
            <div className="flex items-center justify-between w-full py-2 text-base font-medium">
              <a 
                href="#" 
                onClick={handleDropdownClick} 
                className={isNavItemActive('bikes') ? 'text-primary' : 'text-foreground hover:text-primary'}
              >
                Bikes
              </a>
            </div>
            <div className="pl-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
              <Link to="/bike-buy-section" className="block py-2 text-sm text-foreground hover:text-primary">
                Buy Bikes
              </Link>
              <button 
                onClick={() => handleSellNavigation('bike')} 
                className="block w-full text-left py-2 text-sm text-foreground hover:text-primary"
              >
                Sell Bikes
              </button>
            </div>
          </div>
          /*
          <div className="px-3 py-1">
            <div className="flex items-center justify-between w-full py-2 text-base font-medium">
              <Link 
                to="/about" 
                className={isNavItemActive('services') ? 'text-primary' : 'text-foreground hover:text-primary'}
              >
                Services
              </Link>
            </div>
            <div className="pl-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700">
              <Link to="/about" className="block py-2 text-sm text-foreground hover:text-primary">
                Verified Buy & Sell Platform
              </Link>
              <button 
                onClick={handleProfessionalServicesClick}
                className="block w-full text-left py-2 text-sm text-foreground hover:text-primary"
              >
                Professional Services
              </button>
            </div>
          </div>
          */
        </div>
      </div>
    </header>
  );
};

export default Header;
