
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, PhoneCall, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 dark:bg-gray-900 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-primary">
              VahaanXchange – Smart & Secure Car Deals!
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Buy and sell with Aadhar-verified safety in a fraud-free marketplace. Get AI-powered price estimates and connect with mechanics, insurers, and more—all in one place.
            </p>
            <Separator className="my-2" />
            <p className="text-muted-foreground">Join now for a seamless experience! 🚗</p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground hover:text-primary transition-colors" aria-label="YouTube">
                <Youtube size={20} />
              </a>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Cars
                </Link>
              </li>
              <li>
                <Link to="/bikes" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Bikes
                </Link>
              </li>
              <li>
                <Link to="/sell?mode=car" className="text-muted-foreground hover:text-primary transition-colors">
                  Sell Your Cars
                </Link>
              </li>
              <li>
                <Link to="/sell?mode=bike" className="text-muted-foreground hover:text-primary transition-colors">
                  Sell Your Bikes
                </Link>
              </li>
              <li>
                <Link to="/ai" className="text-muted-foreground hover:text-primary transition-colors">
                  Ask AI
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Help & Support - Updated links to point to the proper routes */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Help & Support</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Contact Us</h5>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  Egattur, Chennai, Tamil Nadu, India
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <PhoneCall size={20} className="text-primary flex-shrink-0" />
                <a href="https://wa.me/918108104175" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  +91 810-810-4175
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <a href="mailto:info@vahaanxchange.com" className="text-muted-foreground hover:text-primary transition-colors">
                  admin@vahaanxchange.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} VahaanXchange- Matchorax technologies pvt ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
