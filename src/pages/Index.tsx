import React from "react";
import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import { Button } from "../components/ui/button";
import { Check } from "lucide-react";
import { Card } from "../components/ui/card";
import { DollarSign, Car, Handshake, Shield, Lock, PriceTag } from "lucide-react";

const IndexPage = () => {
  return (
    <Layout>
      <Hero />
      
      {/* Other sections... */}
      
      {/* Why VahaanXchange is Different section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why VahaanXchange is Different
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-white border-2 border-primary/20 shadow-md">
                <DollarSign size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Zero Brokerage, Zero Commission</h3>
                <p className="text-gray-700">No middlemen. Buyers and sellers connect directly – no extra charges.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-white border-2 border-primary/20 shadow-md">
                <Car size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Transparent Pricing with AI-Powered Prediction</h3>
                <p className="text-gray-700">Our smart price predictor suggests a fair market price to help both parties decide confidently.</p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-white border-2 border-primary/20 shadow-md">
                <Handshake size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Direct Negotiation & Deal Finalization</h3>
                <p className="text-gray-700">We don't interfere in your deal. You meet directly and decide on the price yourself.</p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-white border-2 border-primary/20 shadow-md">
                <Shield size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verified Buyers & Sellers</h3>
                <p className="text-gray-700">Every buyer is Aadhar-verified. Every seller is matched with their vehicle's RC name and Aadhar – ensuring authenticity.</p>
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-white border-2 border-primary/20 shadow-md">
                <Lock size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Security & Trust Built-In</h3>
                <p className="text-gray-700">With document verification and a monitored platform, you can transact with peace of mind.</p>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="flex gap-4 items-start">
              <div className="p-3 rounded-full bg-white border-2 border-primary/20 shadow-md">
                <PriceTag size={28} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No Hidden Charges, Ever</h3>
                <p className="text-gray-700">What you see is what you get. No last-minute surprises.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Car</h3>
              <p className="text-gray-700">
                Create a detailed listing with photos, specs, and your asking price.
              </p>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Buyers</h3>
              <p className="text-gray-700">
                Interested buyers will contact you directly through our secure platform.
              </p>
            </Card>
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete the Sale</h3>
              <p className="text-gray-700">
                Finalize the deal, transfer ownership, and get paid securely.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Features that make selling easy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4 items-start">
              <div className="p-1">
                <Check className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Price Prediction</h3>
                <p className="text-gray-700">
                  Get an accurate estimate of your car's market value based on its condition, mileage, and market trends.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-1">
                <Check className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verified Buyers</h3>
                <p className="text-gray-700">
                  All buyers on our platform are verified, ensuring safe and legitimate transactions.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-1">
                <Check className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
                <p className="text-gray-700">
                  Communicate with potential buyers through our secure messaging system without sharing personal contact details.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="p-1">
                <Check className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Document Assistance</h3>
                <p className="text-gray-700">
                  Get guidance on all the paperwork needed for a smooth ownership transfer.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button size="lg">Start Selling Now</Button>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            What our users say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <p className="italic mb-4">
                "I sold my Honda City within just 3 days of listing it on VahaanXchange. The AI price prediction was spot on!"
              </p>
              <p className="font-semibold">- Rahul Sharma</p>
            </Card>
            <Card className="p-6">
              <p className="italic mb-4">
                "As a first-time car buyer, I was nervous about the process. VahaanXchange made it simple and transparent."
              </p>
              <p className="font-semibold">- Priya Patel</p>
            </Card>
            <Card className="p-6">
              <p className="italic mb-4">
                "No hidden fees, no last-minute surprises. Just a straightforward platform for buying and selling cars."
              </p>
              <p className="font-semibold">- Amit Verma</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who have successfully bought and sold vehicles on VahaanXchange.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Sell Your Car
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
              Browse Cars
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default IndexPage;
