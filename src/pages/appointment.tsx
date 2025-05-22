
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import { toast } from "sonner";
import { addDays, isWeekend } from "date-fns";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import Layout from "@/components/layout/Layout";
import ProgressBar from "@/components/appointment/ProgressBar";
import FloatingVideoButton from "@/components/appointment/FloatingVideoButton";
import VideoGuideModal from "@/components/appointment/VideoGuideModal";
import { CalendarIcon } from "lucide-react";

// Define all step types
type AppointmentStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type StepData = Record<string, any>;

const Appointment: React.FC = () => {
  // Add head meta on component mount to prevent unwanted zoom
  useEffect(() => {
    // Add meta viewport tag to prevent zoom on mobile
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.setAttribute('name', 'viewport');
      document.head.appendChild(metaViewport);
    }
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
    
    // Clean up function to restore default viewport when leaving this page
    return () => {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
    };
  }, []);
  
  const [progressStep, setProgressStep] = useState<AppointmentStep>(0);
  const [appointmentData, setAppointmentData] = useState<StepData>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Define steps for the progress bar
  const steps = [
    "Vehicle Details",
    "Personal Details",
    "Preferred Date",
    "Preferred Time",
    "Confirm Details",
  ];

  // Form validation schema using zod
  const vehicleSchema = z.object({
    vehicleType: z.string().min(1, "Vehicle type is required"),
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.string().min(1, "Year is required"),
  });

  type VehicleSchema = z.infer<typeof vehicleSchema>;

  // Zod form validator
  const form = useForm<VehicleSchema>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vehicleType: "",
      make: "",
      model: "",
      year: "",
    },
  });

  // Function to handle form submission and move to the next step
  const onSubmit = async (data: VehicleSchema) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update appointment data
      setAppointmentData((prev) => ({ ...prev, ...data }));

      // Move to the next step
      setProgressStep((prev) => (prev + 1) as AppointmentStep);
      toast("Vehicle details saved!");
    } catch (error) {
      toast("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    setProgressStep((prev) => (prev + 1) as AppointmentStep);
  };

  const handlePrevStep = () => {
    setProgressStep((prev) => (prev - 1) as AppointmentStep);
  };

  const renderStepContent = () => {
    switch (progressStep) {
      case 0:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Vehicle Details</h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a vehicle type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="truck">Truck</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="motorcycle">Motorcycle</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Vehicle Make" 
                          {...field} 
                          style={{fontSize: '16px'}} // Prevents zoom on mobile
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Vehicle Model" 
                          {...field} 
                          style={{fontSize: '16px'}} // Prevents zoom on mobile
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Vehicle Year" 
                          {...field} 
                          style={{fontSize: '16px'}} // Prevents zoom on mobile
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
                  )}
                  Next
                </Button>
              </form>
            </Form>
          </div>
        );
      case 1:
        return <PersonalDetailsForm onNext={handleNextStep} onPrev={handlePrevStep} />;
      case 2:
        return <PreferredDateForm onNext={handleNextStep} onPrev={handlePrevStep} />;
      case 3:
        return <PreferredTimeForm onNext={handleNextStep} onPrev={handlePrevStep} />;
      case 4:
        return <ConfirmDetails appointmentData={appointmentData} onNext={handleNextStep} onPrev={handlePrevStep} />;
      default:
        return <div>Thank you for your submission!</div>;
    }
  };

  return (
    <Layout>
      <VideoGuideModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
      <FloatingVideoButton onClick={() => setIsVideoModalOpen(true)} />
      
      <div className="container max-w-screen-lg mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress Bar - Make it scrollable horizontally on mobile */}
        <div className="w-full mb-8 overflow-x-auto pb-4">
          <div className="min-w-max lg:min-w-0">
            <ProgressBar steps={steps} currentStep={progressStep} />
          </div>
        </div>
        
        <div>{renderStepContent()}</div>
      </div>
    </Layout>
  );
};

// Personal Details Form Component
const PersonalDetailsForm: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast("Personal details saved!");
      onNext();
    } catch (error) {
      toast("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input 
            type="text" 
            id="firstName" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
            style={{fontSize: '16px'}} // Prevents zoom on mobile
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input 
            type="text" 
            id="lastName" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
            style={{fontSize: '16px'}} // Prevents zoom on mobile
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" 
            style={{fontSize: '16px'}} // Prevents zoom on mobile
          />
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Previous</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <span className="mr-2 h-4 w-4 animate-spin">⟳</span>}
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

// Preferred Date Form Component
const PreferredDateForm: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast("Preferred date saved!");
      onNext();
    } catch (error) {
      toast("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Preferred Date</h2>
      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  `${format(date.from, "MMM dd, yyyy")} - ${format(
                    date.to,
                    "MMM dd, yyyy"
                  )}`
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center" side="bottom">
            <Calendar
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              disabled={(date) =>
                date < new Date() || isWeekend(date)
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Previous</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <span className="mr-2 h-4 w-4 animate-spin">⟳</span>}
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

// Preferred Time Form Component
const PreferredTimeForm: React.FC<{ onNext: () => void; onPrev: () => void }> = ({ onNext, onPrev }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast("Preferred time saved!");
      onNext();
    } catch (error) {
      toast("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Preferred Time</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Select a Time</label>
          <select 
            id="time" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            style={{fontSize: '16px'}} // Prevents zoom on mobile
          >
            <option>9:00 AM</option>
            <option>10:00 AM</option>
            <option>11:00 AM</option>
            <option>1:00 PM</option>
            <option>2:00 PM</option>
            <option>3:00 PM</option>
          </select>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Previous</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <span className="mr-2 h-4 w-4 animate-spin">⟳</span>}
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

// Confirm Details Form Component
interface ConfirmDetailsProps {
  appointmentData: StepData;
  onNext: () => void;
  onPrev: () => void;
}

const ConfirmDetails: React.FC<ConfirmDetailsProps> = ({ appointmentData, onNext, onPrev }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast("Appointment confirmed!");
      onNext();
    } catch (error) {
      toast("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Confirm Details</h2>
      <div className="space-y-4">
        {Object.entries(appointmentData).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium capitalize">{key}:</span> {value}
          </div>
        ))}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>Previous</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <span className="mr-2 h-4 w-4 animate-spin">⟳</span>}
            Confirm Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
