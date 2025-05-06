
import { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Wrench, ChevronRight, Phone } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ServicesPage = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for the professional services dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("mechanics");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const { toast } = useToast();

  const handleServiceSelection = (value: string) => {
    setSelectedService(value);
  };

  const handleSubmitRequest = () => {
    // Validate phone number (basic validation)
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Handle the service request submission
    toast({
      title: "Request Submitted",
      description: `We'll call you shortly regarding ${getServiceName(selectedService)}.`,
    });

    // Reset and close dialog
    setPhoneNumber("");
    setIsDialogOpen(false);
  };

  const getServiceName = (serviceId: string) => {
    switch (serviceId) {
      case "mechanics":
        return "Mechanic Services";
      case "insurance":
        return "Insurance Consultation";
      case "accessories":
        return "Car Accessories";
      default:
        return "Professional Services";
    }
  };

  const faqs = [
    {
      question: "How do I verify my Aadhar ID on VahaanXchange?",
      answer: "To verify your Aadhar ID, navigate to your profile settings and select 'Verify Identity'. Follow the prompts to securely upload your Aadhar details. Our verification team will review and confirm your identity within 24-48 hours."
    },
    {
      question: "Are all cars on VahaanXchange verified?",
      answer: "Yes, all cars listed on our platform undergo a verification process. Sellers must provide vehicle documentation, and our team verifies the information before listings go live. Look for the 'Verified' badge on listings for added assurance."
    },
    {
      question: "How do I connect with professional mechanics through VahaanXchange?",
      answer: "You can find professional mechanics in the 'Professional Services' section. Browse through profiles based on location, specialization, and ratings. Once you've selected a mechanic, you can contact them directly through our platform."
    },
    {
      question: "What types of professional services are available?",
      answer: "VahaanXchange connects you with various automotive professionals including mechanics, insurance agents, car accessory providers, detailing experts, and documentation assistants to help with all aspects of car ownership."
    },
    {
      question: "Is there a fee to list my car for sale?",
      answer: "Basic listings are free. Premium listing options with enhanced visibility features are available for a nominal fee. You can choose the listing type that best suits your needs during the ad posting process."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/40 via-blue-500/30 to-transparent dark:from-violet-900/60 dark:via-blue-800/40 dark:to-transparent backdrop-blur-sm z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white animate-fade-in">
              Explore Our Services
            </h1>
            <p className="text-lg md:text-xl text-black/90 dark:text-white/90 mb-8 animate-fade-in">
              Discover how VahaanXchange makes buying and selling used cars easier, safer, and more reliable.
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Service Cards Section */}
      <section className="py-12 relative z-10 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: Verified Buy & Sell Platform */}
            <Card className="card-shadow overflow-hidden border-0 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-violet-500/20 dark:from-blue-800/40 dark:to-violet-900/30 opacity-80 z-0"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Verified Buy & Sell Platform</CardTitle>
                <CardDescription className="text-foreground/80 dark:text-foreground/70">
                  Security and trust at the core of every transaction
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 text-foreground/90 dark:text-foreground/80">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Aadhar-verified car listings for enhanced security</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Thorough vehicle history checks and documentation</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Secure payment gateway for hassle-free transactions</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button className="w-full group">
                  Explore Verified Listings
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Button>
              </CardFooter>
            </Card>

            {/* Card 2: Professional Services */}
            <Card className="card-shadow overflow-hidden border-0 rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-blue-500/20 dark:from-violet-900/40 dark:to-blue-800/30 opacity-80 z-0"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-900/30 mb-4">
                  <Wrench className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Professional Services</CardTitle>
                <CardDescription className="text-foreground/80 dark:text-foreground/70">
                  Expert assistance for all your automotive needs
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10 text-foreground/90 dark:text-foreground/80">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Connect with certified mechanics for inspections and repairs</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Insurance consultation and policy comparison services</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Premium car accessories from verified providers</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="relative z-10">
                <Button 
                  className="w-full group"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Find Professionals
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Services Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Professional Services</DialogTitle>
            <DialogDescription>
              Select a service and provide your contact details for a callback.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-6">
              <h4 className="font-medium mb-3">Select service type:</h4>
              <RadioGroup 
                value={selectedService} 
                onValueChange={handleServiceSelection}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="mechanics" id="mechanics" />
                  <Label htmlFor="mechanics" className="flex-1 cursor-pointer">
                    <div className="font-medium">Certified Mechanics</div>
                    <div className="text-sm text-muted-foreground">Expert inspections and repairs</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="insurance" id="insurance" />
                  <Label htmlFor="insurance" className="flex-1 cursor-pointer">
                    <div className="font-medium">Insurance Consultation</div>
                    <div className="text-sm text-muted-foreground">Policy comparison and advice</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-secondary/50 transition-colors">
                  <RadioGroupItem value="accessories" id="accessories" />
                  <Label htmlFor="accessories" className="flex-1 cursor-pointer">
                    <div className="font-medium">Car Accessories</div>
                    <div className="text-sm text-muted-foreground">Premium products from verified providers</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-medium">Your Contact Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                We'll call you back to discuss your requirements.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleSubmitRequest}
              className="w-full sm:w-auto"
            >
              <Phone className="mr-2 h-4 w-4" />
              Request a Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Section */}
      <section className="py-12 bg-secondary/50 dark:bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Find answers to common questions about our services
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-2">
                  <AccordionTrigger className="text-left font-medium text-base py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">
                Didn't find what you were looking for?
              </p>
              <Button variant="outline">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ServicesPage;
