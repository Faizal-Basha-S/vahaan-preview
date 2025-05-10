
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, Calendar, Timer, MapPin, Car, RotateCw, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`
                ${service.status === "Pending" ? "bg-amber-500" : ""}
                ${service.status === "Scheduled" ? "bg-blue-500" : ""}
                ${service.status === "Completed" ? "bg-green-500" : ""}
                ${service.status === "Cancelled" ? "bg-red-500" : ""}
              `}>
                {service.status}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Request ID: {service.id}
              </span>
            </div>
            
            <h3 className="font-semibold text-lg">{service.type}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{service.vehicle}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{service.date}</span>
              </div>
              <div className="flex items-center text-sm">
                <Timer className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{service.time}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{service.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <CircleDollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{service.price}</span>
              </div>
            </div>
          </div>
          
          {service.notes && (
            <div className="mt-4 md:mt-0 md:ml-4 md:max-w-xs">
              <div className="text-sm p-2 bg-muted rounded">
                <span className="font-medium">Notes:</span> {service.notes}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/20 px-4 py-3 flex justify-end gap-2">
        {service.status !== "Completed" && service.status !== "Cancelled" && (
          <>
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="h-4 w-4" /> Details
            </Button>
            {service.status === "Pending" && (
              <Button size="sm" className="gap-1">
                Confirm
              </Button>
            )}
            {service.status === "Scheduled" && (
              <Button size="sm" className="gap-1">
                <Calendar className="h-4 w-4" /> Reschedule
              </Button>
            )}
          </>
        )}
        {service.status === "Completed" && (
          <Button size="sm" className="gap-1">
            <RotateCw className="h-4 w-4" /> Request Again
          </Button>
        )}
        {service.status !== "Cancelled" && service.status !== "Completed" && (
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const ServicesPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Mock data for demonstration
  const mockServices = [
    {
      id: "SRV-1001",
      type: "Full Vehicle Inspection",
      vehicle: "Honda City (2020)",
      date: "May 14, 2025",
      time: "10:30 AM",
      location: "VahaanXchange Service Center, Chennai",
      price: "₹2,500",
      status: "Scheduled",
      notes: "Please bring vehicle documentation"
    },
    {
      id: "SRV-1002",
      type: "Engine Oil Change",
      vehicle: "Hyundai Creta (2021)",
      date: "May 20, 2025",
      time: "02:45 PM",
      location: "VahaanXchange Service Center, Chennai",
      price: "₹1,200",
      status: "Pending"
    },
    {
      id: "SRV-1003",
      type: "Battery Replacement",
      vehicle: "Royal Enfield Classic 350 (2022)",
      date: "Apr 25, 2025",
      time: "11:15 AM",
      location: "VahaanXchange Service Center, Bangalore",
      price: "₹3,500",
      status: "Completed"
    },
    {
      id: "SRV-1004",
      type: "Wheel Alignment",
      vehicle: "Maruti Swift (2022)",
      date: "Apr 18, 2025",
      time: "09:00 AM",
      location: "VahaanXchange Service Center, Chennai",
      price: "₹800",
      status: "Cancelled"
    }
  ];
  
  // Check authentication
  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Your Requested Services</h1>
          <p className="text-muted-foreground mt-2">Review and manage the services you've requested for your vehicle.</p>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            <Button size="sm" onClick={() => navigate("/appointment")}>
              Request New Service
            </Button>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              {mockServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <div className="space-y-4">
              {mockServices
                .filter(service => ["Pending", "Scheduled"].includes(service.status))
                .map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <div className="space-y-4">
              {mockServices
                .filter(service => service.status === "Completed")
                .map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-0">
            <div className="space-y-4">
              {mockServices
                .filter(service => service.status === "Cancelled")
                .map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ServicesPage;
