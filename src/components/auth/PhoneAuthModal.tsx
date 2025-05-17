
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import OTPInput from "./OTPInput";
import ProfileSetupModal from "./ProfileSetupModal";

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhoneAuthModal = ({ isOpen, onClose }: PhoneAuthModalProps) => {
  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  
  const { setupRecaptcha, confirmationResult, setConfirmationResult, setUserPhoneNumber } = useAuth();

  // Autofocus the phone input when modal opens
  useEffect(() => {
    if (isOpen && step === "phone" && phoneInputRef.current) {
      // Small timeout to ensure the input is properly rendered
      setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, step]);

  // Format phone number with country code
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "");
    
    // Ensure the number starts with +91
    if (digits.startsWith("91")) {
      return `+${digits}`;
    } else {
      return `+91${digits}`;
    }
  };

  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Only allow digits
    const digits = input.replace(/\D/g, "");
    setPhoneNumber(digits);
  };

  // Handle send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create recaptcha verifier
      const recaptchaVerifier = setupRecaptcha('recaptcha-container');
      
      // Format phone number with country code
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      
      // Send OTP
      const confirmation = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the OTP",
      });
      
      setStep("otp");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Failed to send OTP",
        description: error?.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmationResult) {
      toast({
        title: "Session Expired",
        description: "Please request a new OTP",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Verify OTP
      await confirmationResult.confirm(otp);
      
      // Update user phone number in context
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      setUserPhoneNumber(formattedPhoneNumber);
      
      toast({
        title: "Authentication Successful",
        description: "You have successfully signed in",
      });
      
      // Show profile setup if it's a new user
      setShowProfileSetup(true);
      setStep("profile");
      
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle close modal
  const handleCloseModal = () => {
    // Reset state
    setStep("phone");
    setPhoneNumber("");
    setOtp("");
    // Close modal
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl">
              {step === "phone" ? "Sign In / Register" : "Verify OTP"}
            </DialogTitle>
          </DialogHeader>
          
          {/* Sign In UI */}
          {step === "phone" && (
            <div className="space-y-4">
              {/* Illustration */}
              <div className="flex justify-center mb-6">
                <img
                  src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Mobile/mobile_signin_illustration.png"
                  alt="Sign In"
                  className="h-48 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 px-2">
                Enter your mobile number to sign in or create a new account
              </p>
              
              <form onSubmit={handleSendOTP} className="space-y-4 mt-4">
                <div className="flex border rounded-md overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary">
                  <div className="bg-muted px-3 py-2 text-sm font-medium flex items-center border-r">
                    +91
                  </div>
                  <Input
                    ref={phoneInputRef}
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit mobile number"
                    className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                
                {/* Recaptcha container */}
                <div id="recaptcha-container" className="flex justify-center"></div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Sending OTP...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </form>
              
              <Separator className="my-4" />
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}
          
          {/* OTP Verification UI */}
          {step === "otp" && (
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <img
                  src="https://kujjqfvicrazqitxkdwh.supabase.co/storage/v1/object/public/vahaanxchange-uploads/Mobile/mobile_otp_verification.png"
                  alt="OTP Verification"
                  className="h-40 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Enter the 6-digit code sent to<br />
                <span className="font-medium">+91 {phoneNumber}</span>
              </p>
              
              <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
                <div className="flex justify-center">
                  <OTPInput length={6} onComplete={setOtp} onChange={setOtp} value={otp} />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm text-primary"
                    onClick={() => {
                      setStep("phone");
                      setOtp("");
                    }}
                    disabled={isLoading}
                  >
                    Change Phone Number
                  </Button>
                </div>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ProfileSetupModal
          isOpen={showProfileSetup && step === "profile"}
          onClose={() => {
            setShowProfileSetup(false);
            handleCloseModal();
          }}
        />
      )}
    </>
  );
};

export default PhoneAuthModal;
