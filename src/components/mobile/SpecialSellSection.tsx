
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Clock, DollarSign } from "lucide-react";

const SpecialSellSection = () => {
  const [activeTab, setActiveTab] = useState("others");

  return (
    <Card className="w-full mb-8 shadow-sm overflow-hidden">
      <CardHeader className="p-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <Tabs defaultValue="others" value={activeTab} onValueChange={setActiveTab} className="w-full">
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

          <TabsContent value="others" className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">100% Buyer Verification</h3>
                  <p className="text-xs text-muted-foreground">
                    Every buyer is Aadhar-verified for maximum security.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Fast Response Times</h3>
                  <p className="text-xs text-muted-foreground">
                    Get inquiries and schedule viewings quickly.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Zero Brokerage</h3>
                  <p className="text-xs text-muted-foreground">
                    You keep 100% of what you sell for.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="us" className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Fair & Transparent Pricing</h3>
                  <p className="text-xs text-muted-foreground">
                    We offer competitive prices based on market value.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Quick Process</h3>
                  <p className="text-xs text-muted-foreground">
                    We complete the purchase within 24-48 hours.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Hassle-Free Experience</h3>
                  <p className="text-xs text-muted-foreground">
                    We handle all the paperwork and transfer processes.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
};

export default SpecialSellSection;
