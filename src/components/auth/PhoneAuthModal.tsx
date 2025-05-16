
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { Loader, ChevronDown, ArrowRight, X, ChevronLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import OTPInput from "./OTPInput";
import { auth } from "@/lib/firebase";
import SignInHero from "./SignInHero";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({ isOpen, onClose }) => {
  const { setConfirmationResult, confirmationResult, currentUser, setUserPhoneNumber } = useAuth();
  const isMobile = useIsMobile();
  
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimeLeft, setResendTimeLeft] = useState(0);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);
  const [modalOpen, setModalOpen] = useState(isOpen);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const eventListenerAdded = useRef(false);
  
  // Handle external open modal requests with a ref to prevent duplicate listeners
  useEffect(() => {
    // Only add the event listener if it hasn't been added already
    if (!eventListenerAdded.current) {
      const handleOpenModal = () => {
        setModalOpen(true);
      };
      
      window.addEventListener('openSignInModal', handleOpenModal);
      eventListenerAdded.current = true;
      
      return () => {
        window.removeEventListener('openSignInModal', handleOpenModal);
        eventListenerAdded.current = false;
      };
    }
  }, []);
  
  // Sync props with internal state
  useEffect(() => {
    setModalOpen(isOpen);
  }, [isOpen]);
  
  // Handle modal close
  const handleModalClose = () => {
    setModalOpen(false);
    onClose();
  };
  
  useEffect(() => {
    if (currentUser) {
      handleModalClose();
    }
  }, [currentUser]);
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (resendTimeLeft > 0) {
      interval = window.setInterval(() => {
        setResendTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimeLeft]);
  
  useEffect(() => {
    if (modalOpen) {
      setStep("phone");
      setOtp("");
      setIsLoading(false);
    }
  }, [modalOpen]);

  const setupRecaptcha = (elementId: string) => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'invisible',
      'callback': () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber
      },
      'expired-callback': () => {
        toast({
          variant: "destructive",
          title: "Verification expired",
          description: "Please try again",
        });
      }
    });
    
    return window.recaptchaVerifier;
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const recaptchaVerifier = setupRecaptcha("recaptcha-container");
      const formattedPhoneNumber = `${countryCode}${phoneNumber}`;
      
      const confirmation = await signInWithPhoneNumber(
        auth, 
        formattedPhoneNumber,
        recaptchaVerifier
      );
      
      setConfirmationResult(confirmation);
      setStep("otp");
      setResendTimeLeft(30);
      
      // Store the phone number for admin check
      setUserPhoneNumber(formattedPhoneNumber);
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${formattedPhoneNumber}`,
      });
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: error.message || "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      toast({
        variant: "destructive",
        title: "Session expired",
        description: "Please request a new OTP",
      });
      setStep("phone");
      return;
    }
    
    if (!otp || otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
      
      // Make sure we've set the phone number for admin check
      const formattedPhoneNumber = `${countryCode}${phoneNumber}`;
      setUserPhoneNumber(formattedPhoneNumber);
      
      toast({
        title: "Authentication successful",
        description: "You're now signed in!",
      });
      
      // The modal will close automatically due to the useEffect watching currentUser
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The code you entered is incorrect",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    setStep("phone");
    if (window.recaptchaWidgetId !== null && window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      if (recaptchaContainerRef.current) {
        recaptchaContainerRef.current.innerHTML = '<div id="recaptcha-container"></div>';
      }
    }
  };

  // Mobile-optimized content
  const MobileAuthContent = () => (
    <div className="w-full h-full flex flex-col">
      <AnimatePresence mode="wait">
        {step === "phone" ? (
          <motion.div 
            key="phone-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b">
              <button 
                onClick={handleModalClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-bold">Sign in / Sign up</h2>
              <div className="w-8"></div> {/* Empty div for centering */}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto px-6 py-8">
              <div className="space-y-6">
                {/* Phone number section */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-center">Enter your phone number</h3>
                  <p className="text-gray-500 text-center">We'll send you a verification code</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="flex items-center gap-1 rounded-l-md border border-r-0 bg-background px-3">
                      <span className="text-sm font-medium">{countryCode}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      type="tel"
                      placeholder="999 999 9999"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPhoneNumber(value);
                      }}
                      className="flex-1 rounded-l-none"
                      maxLength={10}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="whatsapp-mobile"
                      checked={whatsappUpdates}
                      onCheckedChange={(checked) => 
                        setWhatsappUpdates(checked as boolean)
                      }
                    />
                    <label
                      htmlFor="whatsapp-mobile"
                      className="text-sm text-muted-foreground"
                    >
                      Get updates on WhatsApp
                    </label>
                  </div>

                  <div ref={recaptchaContainerRef}>
                    <div id="recaptcha-container"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t mt-auto">
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-lg"
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.length < 10}
              >
                {isLoading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
              <p className="mt-4 text-xs text-center text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="otp-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b">
              <button 
                onClick={() => setStep("phone")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-bold">Verify OTP</h2>
              <div className="w-8"></div> {/* Empty div for centering */}
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto px-6 py-8">
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold">
                    Verify your phone
                  </h3>
                  <p className="text-gray-500">
                    We've sent a verification code to {countryCode} {phoneNumber}
                  </p>
                </div>
                
                <div className="mt-8">
                  <Label htmlFor="otp" className="block text-center mb-4">Enter 6-digit OTP</Label>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    className="justify-center"
                  />
                </div>
                
                <div className="flex items-center justify-center text-sm mt-4">
                  <p className="text-gray-500">
                    {resendTimeLeft > 0 ? (
                      `Resend OTP in ${resendTimeLeft}s`
                    ) : (
                      <Button
                        variant="link"
                        onClick={handleResendOTP}
                        className="p-0 h-auto"
                      >
                        Resend OTP
                      </Button>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t mt-auto">
              <Button 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 rounded-lg"
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Desktop-optimized content
  const DesktopAuthContent = () => (
    <div className="flex h-[600px] max-w-[900px] overflow-hidden rounded-lg p-0">
      <SignInHero />
      
      <div className="flex w-1/2 flex-1 flex-col overflow-y-auto px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleModalClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="mx-auto w-full max-w-md space-y-6">
          {step === "phone" ? (
            <>
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold tracking-tight">Log in to continue</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile number</Label>
                  <div className="flex">
                    <div className="flex items-center gap-1 rounded-l-md border bg-background px-3">
                      <span className="text-sm font-medium">{countryCode}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="999 999 9999"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPhoneNumber(value);
                      }}
                      className="flex-1 rounded-l-none"
                      maxLength={10}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsapp"
                    checked={whatsappUpdates}
                    onCheckedChange={(checked) => 
                      setWhatsappUpdates(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="whatsapp"
                    className="text-sm text-muted-foreground"
                  >
                    Get updates on WhatsApp
                  </label>
                </div>

                <div ref={recaptchaContainerRef}>
                  <div id="recaptcha-container"></div>
                </div>

                <Button 
                  className="w-full"
                  onClick={handleSendOTP}
                  disabled={isLoading || phoneNumber.length < 10}
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    "Get OTP"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Verify your phone
                </h2>
                <p className="text-muted-foreground">
                  We've sent a verification code to {countryCode} {phoneNumber}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit OTP</Label>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
                
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">
                    {resendTimeLeft > 0 ? (
                      `Resend OTP in ${resendTimeLeft}s`
                    ) : (
                      <Button
                        variant="link"
                        onClick={handleResendOTP}
                        className="p-0 h-auto"
                      >
                        Resend OTP
                      </Button>
                    )}
                  </p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep("phone")}
                  >
                    Change Number
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && handleModalClose()}>
      <DialogContent 
        className={cn(
          "p-0 overflow-hidden",
          isMobile ? "w-full h-[100dvh] max-w-none rounded-none" : ""
        )}
        closeButton={false}
        fullScreenOnMobile={true}
      >
        {isMobile ? <MobileAuthContent /> : <DesktopAuthContent />}
      </DialogContent>
    </Dialog>
  );
};

export default PhoneAuthModal;

// Add RecaptchaVerifier to Window interface
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    recaptchaWidgetId: number | null;
  }
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
