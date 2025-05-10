
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, FileText, Car, Calendar, MapPin, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const BookingCard = ({ booking }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <Badge className={`
                ${booking.status === "Confirmed" ? "bg-green-500" : ""}
                ${booking.status === "In Progress" ? "bg-blue-500" : ""}
                ${booking.status === "Completed" ? "bg-gray-500" : ""}
              `}>
                {booking.status}
              </Badge>
              <span className="text-sm ml-2 text-muted-foreground">
                Booking ID: {booking.id}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <img 
                src={booking.image} 
                alt={booking.vehicleName}
                className="w-full sm:w-32 h-24 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-lg">{booking.vehicleName}</h3>
                <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-x-3 gap-y-1 mt-1">
                  <span>{booking.year}</span>
                  <span>•</span>
                  <span>{booking.variant}</span>
                  <span>•</span>
                  <span>{booking.kilometers} km</span>
                </div>
                <div className="mt-3">
                  <div className="text-lg font-bold">{booking.price}</div>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Booked on: {booking.bookingDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{booking.pickupLocation}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{booking.sellerContact}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col justify-start gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="gap-1">
              <FileText className="h-4 w-4" /> Invoice
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <MessageCircle className="h-4 w-4" /> Chat
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Bookings = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  // Mock data for demonstration
  const mockBookings = [
    {
      id: "BOK-12345",
      vehicleName: "Honda City ZX",
      year: "2020",
      variant: "Petrol",
      kilometers: "25,000",
      price: "₹8,90,000",
      image: "/placeholder.svg",
      status: "Confirmed",
      bookingDate: "May 5, 2025",
      pickupLocation: "VahaanXchange Chennai Center",
      sellerContact: "+91 9876543210"
    },
    {
      id: "BOK-12346",
      vehicleName: "Hyundai i20",
      year: "2021",
      variant: "Diesel",
      kilometers: "18,000",
      price: "₹7,25,000",
      image: "/placeholder.svg",
      status: "In Progress",
      bookingDate: "May 2, 2025",
      pickupLocation: "VahaanXchange Bangalore Center",
      sellerContact: "+91 9876543211"
    },
    {
      id: "BOK-12347",
      vehicleName: "Royal Enfield Classic 350",
      year: "2022",
      variant: "Petrol",
      kilometers: "5,000",
      price: "₹2,10,000",
      image: "/placeholder.svg",
      status: "Completed",
      bookingDate: "Apr 20, 2025",
      pickupLocation: "VahaanXchange Mumbai Center",
      sellerContact: "+91 9876543212"
    }
  ];
  
  // Check authentication
  if (!currentUser) {
    navigate("/");
    return null;
  }
  
  const filteredBookings = activeTab === "all" 
    ? mockBookings 
    : mockBookings.filter(booking => booking.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <Layout>
      <div className="py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Vehicle Bookings</h1>
          <p className="text-muted-foreground mt-2">Manage all your vehicle purchase bookings in one place.</p>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <TabsList className="overflow-x-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in progress">In Progress</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Car className="h-4 w-4" /> New Booking
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No bookings available</h3>
                <p className="text-muted-foreground mt-1">Start browsing vehicles to book</p>
                <Button className="mt-4" onClick={() => navigate("/search")}>Browse Vehicles</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="in progress" className="mt-0">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No in-progress bookings</h3>
                <p className="text-muted-foreground mt-1">Your in-progress bookings will appear here</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="confirmed" className="mt-0">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No confirmed bookings</h3>
                <p className="text-muted-foreground mt-1">Your confirmed bookings will appear here</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No completed bookings</h3>
                <p className="text-muted-foreground mt-1">Your completed bookings will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Bookings;
