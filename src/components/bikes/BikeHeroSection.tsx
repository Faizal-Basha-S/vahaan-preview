
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bike } from "lucide-react";

const BikeHeroSection = () => {
  return (
    <div className="relative rounded-xl overflow-hidden mb-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          filter: "brightness(0.9)"
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-indigo-900/70 z-10" />
      
      {/* Content */}
      <div className="relative z-20 p-8 md:p-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          The Bike You Need. The Price You Want.
        </h1>
        
        <p className="text-lg text-white/90 mb-6">
          Find your perfect ride today — browse our collection of quality used bikes at unbeatable prices.
        </p>
        
        <Link to="/bikes">
          <Button size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600">
            <Bike className="h-5 w-5" />Buy Used Bikes
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BikeHeroSection;
