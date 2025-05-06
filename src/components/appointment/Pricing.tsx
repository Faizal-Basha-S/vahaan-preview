
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PricingProps {
  onBack: () => void;
  expectedPrice: string;
  selectedFeatures: string[];
}

const Pricing: React.FC<PricingProps> = ({ onBack, expectedPrice, selectedFeatures }) => {
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  
  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value.toUpperCase());
    // Reset promo applied state when changing the code
    if (promoApplied) setPromoApplied(false);
  };
  
  const applyPromo = () => {
    if (promoCode === "FRIEND") {
      setPromoApplied(true);
      toast.success("🎉 Promo applied! Listing is free.");
    } else {
      toast.error("Invalid promo code");
    }
  };
  
  const handleProceedToPay = () => {
    // This will be integrated with Razorpay in a future phase
    toast.info("Payment integration will be available in a future update");
  };
  
  // Format the expected price for display
  const formattedPrice = expectedPrice 
    ? new Intl.NumberFormat("en-IN").format(parseInt(expectedPrice))
    : "0";
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Pricing</h2>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 dark:text-gray-300">Expected Selling Price</span>
          <span className="font-semibold">₹ {formattedPrice}</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-600 dark:text-gray-300">Listing Fee</span>
          <span className={`font-semibold ${promoApplied ? "line-through text-gray-400" : ""}`}>
            ₹ 199
          </span>
        </div>
        
        {promoApplied && (
          <div className="flex justify-between items-center py-4 text-green-600 dark:text-green-400">
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Promo Applied
            </span>
            <span className="font-semibold">- ₹ 199</span>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4 text-lg font-bold">
          <span>Total</span>
          <span>₹ {promoApplied ? "0" : "199"}</span>
        </div>
      </div>
      
      {/* Promo code section */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Have a promo code?</label>
        <div className="flex gap-2">
          <Input
            value={promoCode}
            onChange={handlePromoChange}
            placeholder="Enter promo code"
            disabled={promoApplied}
          />
          <Button
            onClick={applyPromo}
            variant="outline"
            disabled={!promoCode || promoApplied}
          >
            Apply
          </Button>
        </div>
        {promoApplied && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            🎉 Promo code FRIEND applied successfully!
          </p>
        )}
      </div>
      
      {/* Selected features section */}
      {selectedFeatures.length > 0 && (
        <div className="mb-8">
          <h3 className="font-medium text-lg mb-3">Selected Features:</h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedFeatures.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleProceedToPay} className="flex items-center gap-2">
          {promoApplied ? "List for Free" : "Proceed to Pay"}
        </Button>
      </div>
    </div>
  );
};

export default Pricing;
