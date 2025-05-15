
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Handshake, BadgePercent, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SpecialSellSection = () => {
  const [activeTab, setActiveTab] = useState("others");

  return (
    <Card className="w-full mb-8 shadow-sm overflow-hidden">
      <CardHeader className="p-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent h-auto rounded-none">
            <TabsTrigger 
              value="others" 
              className={`py-3 ${
                activeTab === "others" 
                  ? "bg-white dark:bg-gray-800 border-b-2 border-primary shadow-sm" 
                  : "bg-transparent"
              }`}
            >
              Sell to Others
            </TabsTrigger>
            <TabsTrigger 
              value="us" 
              className={`py-3 ${
                activeTab === "us" 
                  ? "bg-white dark:bg-gray-800 border-b-2 border-primary shadow-sm" 
                  : "bg-transparent"
              }`}
            >
              Sell to Us
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="others" className="mt-0 animate-fade-in">
            <div className="py-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Selling with Value</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    List your vehicle on our platform and connect directly with buyers. 
                    No middleman fees, just honest transactions.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Direct negotiations with buyers
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Set your own price
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      AI-suggested fair market value
                    </li>
                  </ul>
                  <Link to="/sell">
                    <Button className="w-full bg-primary hover:bg-primary/90 mt-2">
                      Post Your Ad <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="us" className="mt-0 animate-fade-in">
            <div className="py-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                  <BadgePercent className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Zero Commission Sale</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Sell your vehicle directly to us. Quick assessment, instant payment, 
                    and absolutely no commission or hidden charges.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Fast transaction within hours
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Immediate payment transfer
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mr-2">
                        <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      Zero paperwork hassle
                    </li>
                  </ul>
                  <Link to="/appointment">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-2">
                      Get Instant Quote <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SpecialSellSection;
