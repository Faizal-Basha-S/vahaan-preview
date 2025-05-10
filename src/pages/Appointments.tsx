
import React from "react";
import Layout from "@/components/layout/Layout";
import { Calendar as CalendarIcon, Calendar, Clock, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Appointments = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Mock data for demonstration
  const mockAppointments = [
    {
      id: 1,
      date: "May 12, 2025",
      time: "10:30 AM",
      type: "Vehicle Inspection",
      location: "VahaanXchange Center, Chennai",
      status: "Confirmed",
      vehicleName: "Honda City"
    },
    {
      id: 2,
      date: "May 15, 2025",
      time: "02:00 PM",
      type: "Vehicle Valuation",
      location: "VahaanXchange Center, Bangalore",
      status: "Pending",
      vehicleName: "Hyundai Creta"
    },
    {
      id: 3,
      date: "May 20, 2025",
      time: "11:45 AM",
      type: "Document Verification",
      location: "VahaanXchange Center, Chennai",
      status: "Confirmed",
      vehicleName: "Royal Enfield Classic 350"
    }
  ];
  
  // Check authentication
  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <Layout>
      <div className="py-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Your Scheduled Appointments</h1>
          <p className="text-muted-foreground mt-2">Keep track of all your sell and service appointments.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg mb-4">Calendar View</h3>
                <div className="flex justify-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={"w-full justify-start text-left font-normal mb-4"}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? date.toLocaleDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Confirmed</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Pending</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full">Schedule New Appointment</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="all">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <TabsList className="overflow-x-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="space-y-4">
                  {mockAppointments.map(appointment => (
                    <Card key={appointment.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="w-full md:w-auto">
                            <div className="flex items-start mb-2">
                              <Badge className={appointment.status === "Confirmed" ? "bg-green-500" : "bg-amber-500"}>
                                {appointment.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg">{appointment.type}</h3>
                            <p className="text-muted-foreground text-sm">{appointment.vehicleName}</p>
                            
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{appointment.date}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>{appointment.time}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>{appointment.location}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">Cancel</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="confirmed" className="mt-0">
                <div className="space-y-4">
                  {mockAppointments
                    .filter(appointment => appointment.status === "Confirmed")
                    .map(appointment => (
                      <Card key={appointment.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="w-full md:w-auto">
                              <div className="flex items-start mb-2">
                                <Badge className="bg-green-500">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg">{appointment.type}</h3>
                              <p className="text-muted-foreground text-sm">{appointment.vehicleName}</p>
                              
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{appointment.time}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{appointment.location}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">Cancel</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <div className="space-y-4">
                  {mockAppointments
                    .filter(appointment => appointment.status === "Pending")
                    .map(appointment => (
                      <Card key={appointment.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div className="w-full md:w-auto">
                              <div className="flex items-start mb-2">
                                <Badge className="bg-amber-500">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg">{appointment.type}</h3>
                              <p className="text-muted-foreground text-sm">{appointment.vehicleName}</p>
                              
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center text-sm">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span>{appointment.time}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <span>{appointment.location}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                              <Button variant="outline" size="sm">Reschedule</Button>
                              <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">Cancel</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
