import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import logoSrc from "@/assets/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <div className="flex items-center">
                <img
                  src={logoSrc}
                  alt="VahaanXchange Logo"
                  className="h-8 w-auto"
                />
                <span className="ml-2 font-bold text-xl">VahaanXchange</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">
              VahaanXchange is your trusted partner for buying and selling vehicles in India. 
              We provide a transparent, secure platform with AI-powered pricing and verified listings.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/used-cars" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Buy Used Cars
                </Link>
              </li>
              <li>
                <Link to="/bikes" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Buy Used Bikes
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Sell Your Vehicle
                </Link>
              </li>
              <li>
                <Link to="/partner" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Become a Partner
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about-us" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Connect With Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4 inline mr-2" />
                  admin@vahaanxchange.com
                </span>
              </li>
              <li className="flex items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="h-4 w-4 inline mr-2" />
                  810-810-4175
                </span>
              </li>
              <li className="mt-4">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} VahaanXchange. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/terms" className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Privacy
            </Link>
            <Link to="/contact" className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
