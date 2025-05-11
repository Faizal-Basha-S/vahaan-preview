import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProgressBar from "@/components/appointment/ProgressBar";
import PhotoUpload from "@/components/appointment/PhotoUpload";
import PriceInput from "@/components/appointment/PriceInput";
import Pricing from "@/components/appointment/Pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDown, AlertCircle, CheckCircle, MapPin, Upload } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// API key stored in a constant
const OPENCAGE_API_KEY = "9de658a249b54e55a10ea5310398f9b4";

// Define all step types
type AppointmentStep = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type StepData = Record<string, any>;

const Appointment: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<AppointmentStep>(0);
  const [expectedPrice, setExpectedPrice] = useState<string>("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [vehicleType, setVehicleType] = useState<"car" | "bike">("car");
  const [stepData, setStepData] = useState<Record<number, StepData>>({});
  const [isElectric, setIsElectric] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [locationDetails, setLocationDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get vehicle type from localStorage on component mount
  useEffect(() => {
    const storedVehicleType = localStorage.getItem("vehicle");
    if (storedVehicleType === "car" || storedVehicleType === "bike") {
      setVehicleType(storedVehicleType);
    }
    
    // Load any previously saved step data from localStorage
    for (let i = 1; i <= 6; i++) {
      const data = localStorage.getItem(`appointment_step${i}_data`);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setStepData(prev => ({...prev, [i-1]: parsedData}));
          
          // Check if the vehicle is electric
          if (i === 2 && parsedData.fuel_type === "Electric") {
            setIsElectric(true);
          }
        } catch (error) {
          console.error(`Error parsing step ${i} data:`, error);
        }
      }
    }
  }, []);
  
  const steps = [
    "Basic Vehicle Info",
    "Ownership & Usage",
    "Vehicle Condition",
    "Upload Photos",
    "Seller Details",
    "Verification",
    "Payment"
  ];
  
  const handleBack = () => {
    if (currentStep === 0) {
      // Go back to sell page
      navigate("/sell");
    } else {
      setCurrentStep(prev => (prev - 1) as AppointmentStep);
    }
  };
  
  const handleNext = () => {
    // Validate current step
    if (validateCurrentStep()) {
      // Save current step data
      saveCurrentStepData();
      
      // Move to next step
      setCurrentStep(prev => (prev + 1) as AppointmentStep);
    }
  };
  
  const handlePriceSubmit = (price: string, features: string[]) => {
    setExpectedPrice(price);
    setSelectedFeatures(features);
    
    // Store price and features in localStorage
    localStorage.setItem("seller_price", price);
    localStorage.setItem("key_features", JSON.stringify(features));
    
    handleNext();
  };
  
  const validateCurrentStep = (): boolean => {
    const currentFormData = stepData[currentStep] || {};

    // Validate based on current step
    switch (currentStep) {
      case 0: // Basic Vehicle Info
        if (!currentFormData.registration_number || !currentFormData.rto || !currentFormData.body_type) {
          toast.error("Please fill all mandatory fields marked with *");
          return false;
        }
        break;
      case 1: // Ownership & Usage
        if (!currentFormData.number_of_owners || !currentFormData.fuel_type || !currentFormData.color) {
          toast.error("Please fill all mandatory fields marked with *");
          return false;
        }
        break;
      case 2: // Vehicle Condition - no mandatory fields
        break;
      case 3: // Photo Upload - validation happens in the component
        break;
      case 4: // Seller Details
        if (!currentFormData.seller_name || !currentFormData.phone_number || !currentFormData.location_city) {
          toast.error("Please fill all mandatory fields marked with *");
          return false;
        }
        break;
      case 5: // Verification
        if (
          (!currentFormData.aadhaar_number && !currentFormData.pan_number) || 
          !locationDetails
        ) {
          toast.error("Please provide either Aadhaar or PAN, and verify your location");
          return false;
        }
        
        // Validate Aadhaar (must be exactly 16 digits)
        if (currentFormData.aadhaar_number && !/^\d{16}$/.test(currentFormData.aadhaar_number)) {
          toast.error("Aadhaar number must be exactly 16 digits");
          return false;
        }
        
        // Validate PAN (must follow standard Indian PAN format)
        if (currentFormData.pan_number && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(currentFormData.pan_number)) {
          toast.error("PAN must be in correct format (e.g., ABCDE1234F)");
          return false;
        }
        break;
      case 6: // Payment - validation happens in the component
        break;
      default:
        return true;
    }
    
    return true;
  };
  
  const saveCurrentStepData = () => {
    const currentFormData = stepData[currentStep] || {};
    
    // Save to localStorage
    localStorage.setItem(`appointment_step${currentStep + 1}_data`, JSON.stringify(currentFormData));
    
    // Additional logic for specific steps
    if (currentStep === 1 && currentFormData.fuel_type === "Electric") {
      setIsElectric(true);
    }
  };
  
  const updateStepData = (data: StepData) => {
    setStepData(prev => ({...prev, [currentStep]: {...(prev[currentStep] || {}), ...data}}));
  };
  
  const handleInputChange = (field: string, value: any) => {
    updateStepData({[field]: value});
  };

  // Function to fetch location using OpenCage Geocoder API
  const fetchLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error("Failed to fetch location details");
          }
          
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const locationData = data.results[0];
            setLocationDetails(locationData);
            
            // Save location data to stepData
            updateStepData({
              live_location: {
                latitude,
                longitude,
                formatted_address: locationData.formatted,
                components: locationData.components
              }
            });
            
            toast.success("Location verified successfully!");
          } else {
            toast.error("Could not determine your location");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          toast.error("Failed to fetch location details");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to get your location. Please check your browser permissions.");
        setIsLoading(false);
      }
    );
  };
  
  // Calculate the current progress step for the ProgressBar
  const progressStep = currentStep;
  
  const renderStepOne = () => {
    const data = stepData[0] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Basic Vehicle Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.registration_number || ""}
              onChange={(e) => handleInputChange("registration_number", e.target.value)}
              placeholder="Enter registration number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              RTO <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <Select 
                value={data.rto_state || ""}
                onValueChange={(value) => handleInputChange("rto_state", value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
  <SelectItem value="Delhi">DL-Delhi</SelectItem>
  <SelectItem value="Maharashtra">MH-Maharashtra</SelectItem>
  <SelectItem value="Uttar Pradesh">UP-Uttar Pradesh</SelectItem>
  <SelectItem value="Haryana">HR-Haryana</SelectItem>
  <SelectItem value="Karnataka">KA-Karnataka</SelectItem>
  <SelectItem value="Gujarat">GJ-Gujarat</SelectItem>
  <SelectItem value="Tamil Nadu">TN-Tamil Nadu</SelectItem>
  <SelectItem value="Rajasthan">RJ-Rajasthan</SelectItem>
  <SelectItem value="Kerala">KL-Kerala</SelectItem>
  <SelectItem value="Madhya Pradesh">MP-Madhya Pradesh</SelectItem>
  <SelectItem value="Andhra Pradesh">AP-Andhra Pradesh</SelectItem>
  <SelectItem value="Telangana">TS-Telangana</SelectItem>
  <SelectItem value="Bihar">BR-Bihar</SelectItem>
  <SelectItem value="Punjab">PB-Punjab</SelectItem>
  <SelectItem value="West Bengal">WB-West Bengal</SelectItem>
  <SelectItem value="Jharkhand">JH-Jharkhand</SelectItem>
  <SelectItem value="Uttarakhand">UK-Uttarakhand</SelectItem>
  <SelectItem value="Chandigarh">CH-Chandigarh</SelectItem>
  <SelectItem value="Assam">AS-Assam</SelectItem>
  <SelectItem value="Jammu & Kashmir">JK-Jammu & Kashmir</SelectItem>
  <SelectItem value="Chhattisgarh">CG-Chhattisgarh</SelectItem>
  <SelectItem value="Himachal Pradesh">HP-Himachal Pradesh</SelectItem>
  <SelectItem value="Mizoram">MZ-Mizoram</SelectItem>
  <SelectItem value="Goa">GA-Goa</SelectItem>
  <SelectItem value="Nagaland">NL-Nagaland</SelectItem>
  <SelectItem value="Odisha">OD-Odisha</SelectItem>
  <SelectItem value="Sikkim">SK-Sikkim</SelectItem>
  <SelectItem value="Puducherry">PY-Puducherry</SelectItem>
  <SelectItem value="Meghalaya">ML-Meghalaya</SelectItem>
  <SelectItem value="Dadra and Nagar Haveli">DN-Dadra and Nagar Haveli</SelectItem>
  <SelectItem value="Daman and Diu">DD-Daman and Diu</SelectItem>
  <SelectItem value="Arunachal Pradesh">AR-Arunachal Pradesh</SelectItem>
  <SelectItem value="Tripura">TR-Tripura</SelectItem>
  <SelectItem value="Manipur">MN-Manipur</SelectItem>                </SelectContent>
              </Select>
              
              <Select 
                value={data.rto || ""}
                onValueChange={(value) => handleInputChange("rto", value)}
                disabled={!data.rto_state}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select RTO" />
                </SelectTrigger>
                <SelectContent>
  {data.rto_state === "Delhi" && (
  <>
    <SelectItem value="DL-05">DL-05</SelectItem>
    <SelectItem value="DL-09">DL-09</SelectItem>
    <SelectItem value="DL-15">DL-15</SelectItem>
    <SelectItem value="DL-16">DL-16</SelectItem>
    <SelectItem value="DL-17">DL-17</SelectItem>
    <SelectItem value="DL-18">DL-18</SelectItem>
    <SelectItem value="DL-51">DL-51</SelectItem>
  </>
)}
{data.rto_state === "Maharashtra" && (
  <>
    <SelectItem value="MH-07">MH-07</SelectItem>
    <SelectItem value="MH-22">MH-22</SelectItem>
    <SelectItem value="MH-25">MH-25</SelectItem>
    <SelectItem value="MH-28">MH-28</SelectItem>
    <SelectItem value="MH-33">MH-33</SelectItem>
    <SelectItem value="MH-35">MH-35</SelectItem>
    <SelectItem value="MH-36">MH-36</SelectItem>
    <SelectItem value="MH-37">MH-37</SelectItem>
    <SelectItem value="MH-38">MH-38</SelectItem>
    <SelectItem value="MH-39">MH-39</SelectItem>
    <SelectItem value="MH-44">MH-44</SelectItem>
    <SelectItem value="MH-45">MH-45</SelectItem>
    <SelectItem value="MH-50">MH-50</SelectItem>
    <SelectItem value="MH-51">MH-51</SelectItem>
    <SelectItem value="MH-52">MH-52</SelectItem>
    <SelectItem value="MH-99">MH-99</SelectItem>
  </>
)}
{data.rto_state === "Uttar Pradesh" && (
  <>
    <SelectItem value="UP-01">UP-01</SelectItem>
    <SelectItem value="UP-03">UP-03</SelectItem>
    <SelectItem value="UP-04">UP-04</SelectItem>
    <SelectItem value="UP-05">UP-05</SelectItem>
    <SelectItem value="UP-06">UP-06</SelectItem>
    <SelectItem value="UP-08">UP-08</SelectItem>
    <SelectItem value="UP-09">UP-09</SelectItem>
    <SelectItem value="UP-10">UP-10</SelectItem>
    <SelectItem value="UP-17">UP-17</SelectItem>
    <SelectItem value="UP-18">UP-18</SelectItem>
    <SelectItem value="UP-19">UP-19</SelectItem>
    <SelectItem value="UP-20">UP-20</SelectItem>
    <SelectItem value="UP-22">UP-22</SelectItem>
    <SelectItem value="UP-23">UP-23</SelectItem>
    <SelectItem value="UP-24">UP-24</SelectItem>
    <SelectItem value="UP-26">UP-26</SelectItem>
    <SelectItem value="UP-27">UP-27</SelectItem>
    <SelectItem value="UP-28">UP-28</SelectItem>
    <SelectItem value="UP-30">UP-30</SelectItem>
    <SelectItem value="UP-31">UP-31</SelectItem>
    <SelectItem value="UP-34">UP-34</SelectItem>
    <SelectItem value="UP-38">UP-38</SelectItem>
    <SelectItem value="UP-40">UP-40</SelectItem>
    <SelectItem value="UP-41">UP-41</SelectItem>
    <SelectItem value="UP-42">UP-42</SelectItem>
    <SelectItem value="UP-43">UP-43</SelectItem>
    <SelectItem value="UP-44">UP-44</SelectItem>
    <SelectItem value="UP-45">UP-45</SelectItem>
    <SelectItem value="UP-46">UP-46</SelectItem>
    <SelectItem value="UP-47">UP-47</SelectItem>
    <SelectItem value="UP-50">UP-50</SelectItem>
    <SelectItem value="UP-51">UP-51</SelectItem>
    <SelectItem value="UP-52">UP-52</SelectItem>
    <SelectItem value="UP-54">UP-54</SelectItem>
    <SelectItem value="UP-55">UP-55</SelectItem>
    <SelectItem value="UP-56">UP-56</SelectItem>
    <SelectItem value="UP-57">UP-57</SelectItem>
    <SelectItem value="UP-58">UP-58</SelectItem>
    <SelectItem value="UP-60">UP-60</SelectItem>
    <SelectItem value="UP-61">UP-61</SelectItem>
    <SelectItem value="UP-62">UP-62</SelectItem>
    <SelectItem value="UP-63">UP-63</SelectItem>
    <SelectItem value="UP-64">UP-64</SelectItem>
    <SelectItem value="UP-66">UP-66</SelectItem>
    <SelectItem value="UP-67">UP-67</SelectItem>
    <SelectItem value="UP-71">UP-71</SelectItem>
    <SelectItem value="UP-72">UP-72</SelectItem>
    <SelectItem value="UP-73">UP-73</SelectItem>
    <SelectItem value="UP-74">UP-74</SelectItem>
    <SelectItem value="UP-75">UP-75</SelectItem>
    <SelectItem value="UP-76">UP-76</SelectItem>
    <SelectItem value="UP-77">UP-77</SelectItem>
    <SelectItem value="UP-79">UP-79</SelectItem>
    <SelectItem value="UP-82">UP-82</SelectItem>
    <SelectItem value="UP-84">UP-84</SelectItem>
    <SelectItem value="UP-86">UP-86</SelectItem>
    <SelectItem value="UP-87">UP-87</SelectItem>
    <SelectItem value="UP-90">UP-90</SelectItem>
    <SelectItem value="UP-91">UP-91</SelectItem>
    <SelectItem value="UP-92">UP-92</SelectItem>
    <SelectItem value="UP-94">UP-94</SelectItem>
    <SelectItem value="UP-95">UP-95</SelectItem>
    <SelectItem value="UP-96">UP-96</SelectItem>
  </>
)}
{data.rto_state === "Haryana" && (
  <>
    <SelectItem value="HR-04">HR-04</SelectItem>
    <SelectItem value="HR-09">HR-09</SelectItem>
    <SelectItem value="HR-15">HR-15</SelectItem>
    <SelectItem value="HR-17">HR-17</SelectItem>
    <SelectItem value="HR-18">HR-18</SelectItem>
    <SelectItem value="HR-23">HR-23</SelectItem>
    <SelectItem value="HR-25">HR-25</SelectItem>
    <SelectItem value="HR-28">HR-28</SelectItem>
    <SelectItem value="HR-32">HR-32</SelectItem>
    <SelectItem value="HR-33">HR-33</SelectItem>
    <SelectItem value="HR-34">HR-34</SelectItem>
    <SelectItem value="HR-37">HR-37</SelectItem>
    <SelectItem value="HR-39">HR-39</SelectItem>
    <SelectItem value="HR-40">HR-40</SelectItem>
    <SelectItem value="HR-41">HR-41</SelectItem>
    <SelectItem value="HR-43">HR-43</SelectItem>
    <SelectItem value="HR-44">HR-44</SelectItem>
    <SelectItem value="HR-45">HR-45</SelectItem>
    <SelectItem value="HR-46">HR-46</SelectItem>
    <SelectItem value="HR-47">HR-47</SelectItem>
    <SelectItem value="HR-48">HR-48</SelectItem>
    <SelectItem value="HR-49">HR-49</SelectItem>
    <SelectItem value="HR-52">HR-52</SelectItem>
    <SelectItem value="HR-53">HR-53</SelectItem>
    <SelectItem value="HR-54">HR-54</SelectItem>
    <SelectItem value="HR-56">HR-56</SelectItem>
    <SelectItem value="HR-57">HR-57</SelectItem>
    <SelectItem value="HR-58">HR-58</SelectItem>
    <SelectItem value="HR-59">HR-59</SelectItem>
    <SelectItem value="HR-61">HR-61</SelectItem>
    <SelectItem value="HR-62">HR-62</SelectItem>
    <SelectItem value="HR-63">HR-63</SelectItem>
    <SelectItem value="HR-64">HR-64</SelectItem>
    <SelectItem value="HR-65">HR-65</SelectItem>
    <SelectItem value="HR-66">HR-66</SelectItem>
    <SelectItem value="HR-67">HR-67</SelectItem>
    <SelectItem value="HR-68">HR-68</SelectItem>
    <SelectItem value="HR-71">HR-71</SelectItem>
    <SelectItem value="HR-73">HR-73</SelectItem>
    <SelectItem value="HR-74">HR-74</SelectItem>
    <SelectItem value="HR-75">HR-75</SelectItem>
    <SelectItem value="HR-77">HR-77</SelectItem>
    <SelectItem value="HR-78">HR-78</SelectItem>
    <SelectItem value="HR-79">HR-79</SelectItem>
    <SelectItem value="HR-80">HR-80</SelectItem>
    <SelectItem value="HR-81">HR-81</SelectItem>
    <SelectItem value="HR-82">HR-82</SelectItem>
    <SelectItem value="HR-83">HR-83</SelectItem>
    <SelectItem value="HR-84">HR-84</SelectItem>
    <SelectItem value="HR-85">HR-85</SelectItem>
    <SelectItem value="HR-86">HR-86</SelectItem>
    <SelectItem value="HR-87">HR-87</SelectItem>
    <SelectItem value="HR-88">HR-88</SelectItem>
    <SelectItem value="HR-89">HR-89</SelectItem>
    <SelectItem value="HR-90">HR-90</SelectItem>
    <SelectItem value="HR-91">HR-91</SelectItem>
    <SelectItem value="HR-92">HR-92</SelectItem>
    <SelectItem value="HR-93">HR-93</SelectItem>
    <SelectItem value="HR-94">HR-94</SelectItem>
    <SelectItem value="HR-95">HR-95</SelectItem>
    <SelectItem value="HR-96">HR-96</SelectItem>
    <SelectItem value="HR-97">HR-97</SelectItem>
    <SelectItem value="HR-98">HR-98</SelectItem>
    <SelectItem value="HR-99">HR-99</SelectItem>
  </>
)}
{data.rto_state === "Karnataka" && (
  <>
    <SelectItem value="KA-07">KA-07</SelectItem>
    <SelectItem value="KA-08">KA-08</SelectItem>
    <SelectItem value="KA-10">KA-10</SelectItem>
    <SelectItem value="KA-11">KA-11</SelectItem>
    <SelectItem value="KA-13">KA-13</SelectItem>
    <SelectItem value="KA-14">KA-14</SelectItem>
    <SelectItem value="KA-15">KA-15</SelectItem>
    <SelectItem value="KA-16">KA-16</SelectItem>
    <SelectItem value="KA-18">KA-18</SelectItem>
    <SelectItem value="KA-21">KA-21</SelectItem>
    <SelectItem value="KA-23">KA-23</SelectItem>
    <SelectItem value="KA-24">KA-24</SelectItem>
    <SelectItem value="KA-26">KA-26</SelectItem>
    <SelectItem value="KA-27">KA-27</SelectItem>
    <SelectItem value="KA-28">KA-28</SelectItem>
    <SelectItem value="KA-29">KA-29</SelectItem>
    <SelectItem value="KA-30">KA-30</SelectItem>
    <SelectItem value="KA-31">KA-31</SelectItem>
    <SelectItem value="KA-32">KA-32</SelectItem>
    <SelectItem value="KA-33">KA-33</SelectItem>
    <SelectItem value="KA-34">KA-34</SelectItem>
    <SelectItem value="KA-35">KA-35</SelectItem>
    <SelectItem value="KA-36">KA-36</SelectItem>
    <SelectItem value="KA-37">KA-37</SelectItem>
    <SelectItem value="KA-38">KA-38</SelectItem>
    <SelectItem value="KA-39">KA-39</SelectItem>
    <SelectItem value="KA-40">KA-40</SelectItem>
    <SelectItem value="KA-42">KA-42</SelectItem>
    <SelectItem value="KA-43">KA-43</SelectItem>
    <SelectItem value="KA-44">KA-44</SelectItem>
    <SelectItem value="KA-45">KA-45</SelectItem>
    <SelectItem value="KA-46">KA-46</SelectItem>
    <SelectItem value="KA-47">KA-47</SelectItem>
    <SelectItem value="KA-48">KA-48</SelectItem>
    <SelectItem value="KA-49">KA-49</SelectItem>
    <SelectItem value="KA-52">KA-52</SelectItem>
    <SelectItem value="KA-54">KA-54</SelectItem>
    <SelectItem value="KA-56">KA-56</SelectItem>
    <SelectItem value="KA-59">KA-59</SelectItem>
    <SelectItem value="KA-61">KA-61</SelectItem>
    <SelectItem value="KA-62">KA-62</SelectItem>
    <SelectItem value="KA-64">KA-64</SelectItem>
    <SelectItem value="KA-65">KA-65</SelectItem>
    <SelectItem value="KA-66">KA-66</SelectItem>
    <SelectItem value="KA-67">KA-67</SelectItem>
    <SelectItem value="KA-68">KA-68</SelectItem>
    <SelectItem value="KA-69">KA-69</SelectItem>
    <SelectItem value="KA-70">KA-70</SelectItem>
    <SelectItem value="KA-71">KA-71</SelectItem>
  </>
)}

{data.rto_state === "Gujarat" && (
  <>
    <SelectItem value="GJ-14">GJ-14</SelectItem>
    <SelectItem value="GJ-20">GJ-20</SelectItem>
    <SelectItem value="GJ-22">GJ-22</SelectItem>
    <SelectItem value="GJ-25">GJ-25</SelectItem>
    <SelectItem value="GJ-26">GJ-26</SelectItem>
    <SelectItem value="GJ-28">GJ-28</SelectItem>
    <SelectItem value="GJ-29">GJ-29</SelectItem>
    <SelectItem value="GJ-30">GJ-30</SelectItem>
    <SelectItem value="GJ-31">GJ-31</SelectItem>
    <SelectItem value="GJ-32">GJ-32</SelectItem>
    <SelectItem value="GJ-33">GJ-33</SelectItem>
    <SelectItem value="GJ-34">GJ-34</SelectItem>
    <SelectItem value="GJ-35">GJ-35</SelectItem>
    <SelectItem value="GJ-36">GJ-36</SelectItem>
    <SelectItem value="GJ-37">GJ-37</SelectItem>
  </>
)}
{data.rto_state === "Tamil Nadu" && (
  <>
    <SelectItem value="TN-15">TN-15</SelectItem>
    <SelectItem value="TN-15Z">TN-15Z</SelectItem>
    <SelectItem value="TN-16">TN-16</SelectItem>
    <SelectItem value="TN-16Z">TN-16Z</SelectItem>
    <SelectItem value="TN-18Y">TN-18Y</SelectItem>
    <SelectItem value="TN-19Y">TN-19Y</SelectItem>
    <SelectItem value="TN-19Z">TN-19Z</SelectItem>
    <SelectItem value="TN-20X">TN-20X</SelectItem>
    <SelectItem value="TN-23T">TN-23T</SelectItem>
    <SelectItem value="TN-24">TN-24</SelectItem>
    <SelectItem value="TN-25">TN-25</SelectItem>
    <SelectItem value="TN-25Y">TN-25Y</SelectItem>
    <SelectItem value="TN-25Z">TN-25Z</SelectItem>
    <SelectItem value="TN-27">TN-27</SelectItem>
    <SelectItem value="TN-28">TN-28</SelectItem>
    <SelectItem value="TN-28Z">TN-28Z</SelectItem>
    <SelectItem value="TN-29">TN-29</SelectItem>
    <SelectItem value="TN-29W">TN-29W</SelectItem>
    <SelectItem value="TN-30W">TN-30W</SelectItem>
    <SelectItem value="TN-31">TN-31</SelectItem>
    <SelectItem value="TN-32">TN-32</SelectItem>
    <SelectItem value="TN-33">TN-33</SelectItem>
    <SelectItem value="TN-34">TN-34</SelectItem>
    <SelectItem value="TN-36">TN-36</SelectItem>
    <SelectItem value="TN-36W">TN-36W</SelectItem>
    <SelectItem value="TN-36Z">TN-36Z</SelectItem>
    <SelectItem value="TN-37Z">TN-37Z</SelectItem>
    <SelectItem value="TN-39Z">TN-39Z</SelectItem>
    <SelectItem value="TN-40">TN-40</SelectItem>
    <SelectItem value="TN-41">TN-41</SelectItem>
    <SelectItem value="TN-42">TN-42</SelectItem>
    <SelectItem value="TN-42Y">TN-42Y</SelectItem>
    <SelectItem value="TN-43">TN-43</SelectItem>
    <SelectItem value="TN-43Z">TN-43Z</SelectItem>
    <SelectItem value="TN-46">TN-46</SelectItem>
    <SelectItem value="TN-47">TN-47</SelectItem>
    <SelectItem value="TN-48">TN-48</SelectItem>
    <SelectItem value="TN-48X">TN-48X</SelectItem>
    <SelectItem value="TN-48Y">TN-48Y</SelectItem>
    <SelectItem value="TN-48Z">TN-48Z</SelectItem>
    <SelectItem value="TN-49">TN-49</SelectItem>
    <SelectItem value="TN-49Y">TN-49Y</SelectItem>
    <SelectItem value="TN-50">TN-50</SelectItem>
    <SelectItem value="TN-50Z">TN-50Z</SelectItem>
    <SelectItem value="TN-51">TN-51</SelectItem>
    <SelectItem value="TN-52">TN-52</SelectItem>
    <SelectItem value="TN-54">TN-54</SelectItem>
    <SelectItem value="TN-55">TN-55</SelectItem>
    <SelectItem value="TN-55Y">TN-55Y</SelectItem>
    <SelectItem value="TN-55Z">TN-55Z</SelectItem>
    <SelectItem value="TN-56">TN-56</SelectItem>
    <SelectItem value="TN-57">TN-57</SelectItem>
    <SelectItem value="TN-58Z">TN-58Z</SelectItem>
    <SelectItem value="TN-59V">TN-59V</SelectItem>
    <SelectItem value="TN-60">TN-60</SelectItem>
    <SelectItem value="TN-60Z">TN-60Z</SelectItem>
    <SelectItem value="TN-61">TN-61</SelectItem>
    <SelectItem value="TN-63">TN-63</SelectItem>
    <SelectItem value="TN-63Z">TN-63Z</SelectItem>
    <SelectItem value="TN-64">TN-64</SelectItem>
    <SelectItem value="TN-65">TN-65</SelectItem>
    <SelectItem value="TN-65Z">TN-65Z</SelectItem>
    <SelectItem value="TN-67">TN-67</SelectItem>
    <SelectItem value="TN-67W">TN-67W</SelectItem>
    <SelectItem value="TN-68">TN-68</SelectItem>
    <SelectItem value="TN-69">TN-69</SelectItem>
    <SelectItem value="TN-72">TN-72</SelectItem>
    <SelectItem value="TN-72V">TN-72V</SelectItem>
    <SelectItem value="TN-73">TN-73</SelectItem>
    <SelectItem value="TN-73Z">TN-73Z</SelectItem>
    <SelectItem value="TN-74">TN-74</SelectItem>
    <SelectItem value="TN-75">TN-75</SelectItem>
    <SelectItem value="TN-76">TN-76</SelectItem>
    <SelectItem value="TN-76V">TN-76V</SelectItem>
    <SelectItem value="TN-77">TN-77</SelectItem>
    <SelectItem value="TN-78">TN-78</SelectItem>
    <SelectItem value="TN-78Z">TN-78Z</SelectItem>
    <SelectItem value="TN-79">TN-79</SelectItem>
    <SelectItem value="TN-81">TN-81</SelectItem>
    <SelectItem value="TN-82">TN-82</SelectItem>
    <SelectItem value="TN-83">TN-83</SelectItem>
    <SelectItem value="TN-83Y">TN-83Y</SelectItem>
    <SelectItem value="TN-83Z">TN-83Z</SelectItem>
    <SelectItem value="TN-84">TN-84</SelectItem>
    <SelectItem value="TN-86">TN-86</SelectItem>
    <SelectItem value="TN-87">TN-87</SelectItem>
    <SelectItem value="TN-88">TN-88</SelectItem>
    <SelectItem value="TN-88Z">TN-88Z</SelectItem>
    <SelectItem value="TN-90">TN-90</SelectItem>
    <SelectItem value="TN-91">TN-91</SelectItem>
    <SelectItem value="TN-91Y">TN-91Y</SelectItem>
    <SelectItem value="TN-91Z">TN-91Z</SelectItem>
    <SelectItem value="TN-92">TN-92</SelectItem>
    <SelectItem value="TN-93">TN-93</SelectItem>
    <SelectItem value="TN-94">TN-94</SelectItem>
    <SelectItem value="TN-95">TN-95</SelectItem>
    <SelectItem value="TN-96">TN-96</SelectItem>
    <SelectItem value="TN-97Z">TN-97Z</SelectItem>
    <SelectItem value="TN-99">TN-99</SelectItem>
    <SelectItem value="TN-583">TN-583</SelectItem>
  </>
)}
{data.rto_state === "Rajasthan" && (
  <>
    <SelectItem value="RJ-03">RJ-03</SelectItem>
    <SelectItem value="RJ-04">RJ-04</SelectItem>
    <SelectItem value="RJ-08">RJ-08</SelectItem>
    <SelectItem value="RJ-10">RJ-10</SelectItem>
    <SelectItem value="RJ-11">RJ-11</SelectItem>
    <SelectItem value="RJ-12">RJ-12</SelectItem>
    <SelectItem value="RJ-13">RJ-13</SelectItem>
    <SelectItem value="RJ-15">RJ-15</SelectItem>
    <SelectItem value="RJ-16">RJ-16</SelectItem>
    <SelectItem value="RJ-17">RJ-17</SelectItem>
    <SelectItem value="RJ-21">RJ-21</SelectItem>
    <SelectItem value="RJ-22">RJ-22</SelectItem>
    <SelectItem value="RJ-24">RJ-24</SelectItem>
    <SelectItem value="RJ-25">RJ-25</SelectItem>
    <SelectItem value="RJ-26">RJ-26</SelectItem>
    <SelectItem value="RJ-28">RJ-28</SelectItem>
    <SelectItem value="RJ-29">RJ-29</SelectItem>
    <SelectItem value="RJ-30">RJ-30</SelectItem>
    <SelectItem value="RJ-31">RJ-31</SelectItem>
    <SelectItem value="RJ-32">RJ-32</SelectItem>
    <SelectItem value="RJ-33">RJ-33</SelectItem>
    <SelectItem value="RJ-34">RJ-34</SelectItem>
    <SelectItem value="RJ-35">RJ-35</SelectItem>
    <SelectItem value="RJ-36">RJ-36</SelectItem>
    <SelectItem value="RJ-37">RJ-37</SelectItem>
    <SelectItem value="RJ-38">RJ-38</SelectItem>
    <SelectItem value="RJ-39">RJ-39</SelectItem>
    <SelectItem value="RJ-41">RJ-41</SelectItem>
    <SelectItem value="RJ-42">RJ-42</SelectItem>
    <SelectItem value="RJ-43">RJ-43</SelectItem>
    <SelectItem value="RJ-44">RJ-44</SelectItem>
    <SelectItem value="RJ-46">RJ-46</SelectItem>
    <SelectItem value="RJ-47">RJ-47</SelectItem>
    <SelectItem value="RJ-48">RJ-48</SelectItem>
    <SelectItem value="RJ-49">RJ-49</SelectItem>
    <SelectItem value="RJ-50">RJ-50</SelectItem>
    <SelectItem value="RJ-51">RJ-51</SelectItem>
    <SelectItem value="RJ-52">RJ-52</SelectItem>
    <SelectItem value="RJ-53">RJ-53</SelectItem>
    <SelectItem value="RJ-54">RJ-54</SelectItem>
    <SelectItem value="RJ-55">RJ-55</SelectItem>
    <SelectItem value="RJ-56">RJ-56</SelectItem>
    <SelectItem value="RJ-57">RJ-57</SelectItem>
    <SelectItem value="RJ-58">RJ-58</SelectItem>
    <SelectItem value="RJ-59">RJ-59</SelectItem>
  </>
)}

                  {/* Add more states and RTOs as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Body Type <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.body_type || ""}
              onValueChange={(value) => handleInputChange("body_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Body Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
                <SelectItem value="Crossover">Crossover</SelectItem>
                <SelectItem value="MPV">MPV</SelectItem>
                <SelectItem value="Coupe">Coupe</SelectItem>
                <SelectItem value="Convertible">Convertible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Engine CC
            </label>
            <Input 
              type="number"
              value={data.engine_cc || ""}
              onChange={(e) => handleInputChange("engine_cc", e.target.value)}
              placeholder="Enter Engine CC"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Load Capacity
            </label>
            <Input 
              value={data.load_capacity || ""}
              onChange={(e) => handleInputChange("load_capacity", e.target.value)}
              placeholder="Enter load capacity"
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepTwo = () => {
    const data = stepData[1] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Ownership & Usage</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Number of Owners <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.number_of_owners || ""}
              onValueChange={(value) => handleInputChange("number_of_owners", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Number of Owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5+">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Ownership Type
            </label>
            <Select 
              value={data.ownership_type || ""}
              onValueChange={(value) => handleInputChange("ownership_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Ownership Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Own board">Own board</SelectItem>
                <SelectItem value="T-board">T-board</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Insurance Validity
            </label>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={"w-full justify-start text-left font-normal"}
                  >
                    {date ? format(date, "PPP") : "Pick a date"}
                    <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      handleInputChange("insurance_validity", newDate ? format(newDate, "yyyy-MM-dd") : null);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Fuel Type <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.fuel_type || ""}
              onValueChange={(value) => {
                handleInputChange("fuel_type", value);
                setIsElectric(value === "Electric");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
                <SelectItem value="CNG">CNG</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="LPG">LPG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Transmission Type
            </label>
            <Select 
              value={data.transmission_type || ""}
              onValueChange={(value) => handleInputChange("transmission_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Transmission Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="CVT">CVT</SelectItem>
                <SelectItem value="AMT">AMT</SelectItem>
                <SelectItem value="DCT">DCT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Color <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.color || ""}
              onChange={(e) => handleInputChange("color", e.target.value)}
              placeholder="Enter vehicle color"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Service History Documents
            </label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="service-history" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PDF or images (MAX. 5MB)</p>
                </div>
                <input 
                  id="service-history" 
                  type="file" 
                  accept=".pdf,image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleInputChange("service_history_docs", e.target.files[0].name);
                    }
                  }} 
                />
              </label>
            </div>
            {data.service_history_docs && (
              <p className="text-sm text-green-600 mt-1">File selected: {data.service_history_docs}</p>
            )}
          </div>
          
          {isElectric && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Battery Health
              </label>
              <Select 
                value={data.battery_health || ""}
                onValueChange={(value) => handleInputChange("battery_health", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Battery Health" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent (greater than 90%)">Excellent (&gt; 90%)</SelectItem>
                  <SelectItem value="Good (75-90%)">Good (75-90%)</SelectItem>
                  <SelectItem value="Average (60-75%)">Average (60-75%)</SelectItem>
                  <SelectItem value="Poor (less than 60%)">Poor (&lt; 60%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Any Modifications
            </label>
            <Textarea 
              value={data.modifications || ""}
              onChange={(e) => handleInputChange("modifications", e.target.value)}
              placeholder="Enter details of any modifications made to the vehicle"
              className="h-24"
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepThree = () => {
    const data = stepData[2] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Vehicle Condition</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Loan Status
            </label>
            <Select 
              value={data.loan_status || ""}
              onValueChange={(value) => handleInputChange("loan_status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Loan Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No Loan</SelectItem>
                <SelectItem value="Yes-not completed">Yes - Not Completed</SelectItem>
                <SelectItem value="Yes-got NOC">Yes - Got NOC</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Tire Condition
            </label>
            <Select 
              value={data.tire_condition || ""}
              onValueChange={(value) => handleInputChange("tire_condition", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Tire Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Bad">Bad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isElectric && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Battery Condition
              </label>
              <Select 
                value={data.battery_condition || ""}
                onValueChange={(value) => handleInputChange("battery_condition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Battery Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Bad">Bad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Permit Type
            </label>
            <Select 
              value={data.permit_type || ""}
              onValueChange={(value) => handleInputChange("permit_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Permit Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="National">National</SelectItem>
                <SelectItem value="State">State</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Fitness Certificate
            </label>
            <Select 
              value={data.fitness_certificate || ""}
              onValueChange={(value) => handleInputChange("fitness_certificate", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Battery Condition of Vehicle
            </label>
            <Select 
              value={data.vehicle_battery || ""}
              onValueChange={(value) => handleInputChange("vehicle_battery", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Good</SelectItem>
                <SelectItem value="No">Not Good</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Accident History
            </label>
            <Textarea 
              value={data.accident_history || ""}
              onChange={(e) => handleInputChange("accident_history", e.target.value)}
              placeholder="Enter details of any accidents the vehicle has been in"
              className="h-24"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Major Replacements
            </label>
            <Textarea 
              value={data.major_replacements || ""}
              onChange={(e) => handleInputChange("major_replacements", e.target.value)}
              placeholder="Enter details of any major parts replaced"
              className="h-24"
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepFour = () => {
    // Enhanced version of PhotoUpload with additional buttons
    return (
      <div className="space-y-6">
        <PhotoUpload onBack={handleBack} onNext={handleNext} />
        
        {/* Additional buttons for odometer photo and walkaround video */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Additional Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Odometer Photo
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="odometer-photo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> odometer photo
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                  <input 
                    id="odometer-photo" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        // Store in localStorage using the same pattern as the main component
                        const uploadedFileUrls = JSON.parse(localStorage.getItem("uploadedFileUrls") || "{}");
                        uploadedFileUrls.odometer = [URL.createObjectURL(e.target.files[0])];
                        localStorage.setItem("uploadedFileUrls", JSON.stringify(uploadedFileUrls));
                        
                        toast.success("Odometer photo uploaded successfully!");
                      }
                    }} 
                  />
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Walkaround Video
              </label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="walkaround-video" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> walkaround video
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">MP4, MOV or AVI (MAX. 100MB)</p>
                  </div>
                  <input 
                    id="walkaround-video" 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        // Store in localStorage using the same pattern as the main component
                        const uploadedFileUrls = JSON.parse(localStorage.getItem("uploadedFileUrls") || "{}");
                        uploadedFileUrls.walkaround_video = [URL.createObjectURL(e.target.files[0])];
                        localStorage.setItem("uploadedFileUrls", JSON.stringify(uploadedFileUrls));
                        
                        toast.success("Walkaround video uploaded successfully!");
                      }
                    }} 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepFive = () => {
    const data = stepData[4] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Seller Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Seller Name <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.seller_name || ""}
              onChange={(e) => handleInputChange("seller_name", e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input 
              value={data.phone_number || ""}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              placeholder="Enter your phone number"
              type="tel"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Location City <span className="text-red-500">*</span>
            </label>
            <Select 
              value={data.location_city || ""}
              onValueChange={(value) => handleInputChange("location_city", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Kolkata">Kolkata</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
                <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                <SelectItem value="Jaipur">Jaipur</SelectItem>
                <SelectItem value="Lucknow">Lucknow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Preferred Contact Time
            </label>
            <Select 
              value={data.preferred_contact_time || ""}
              onValueChange={(value) => handleInputChange("preferred_contact_time", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Preferred Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Anytime">Anytime</SelectItem>
                <SelectItem value="Above 9 AM">Above 9 AM</SelectItem>
                <SelectItem value="3 PM">3 PM</SelectItem>
                <SelectItem value="7 PM">7 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Reason for Sale
            </label>
            <Textarea 
              value={data.reason_for_sale || ""}
              onChange={(e) => handleInputChange("reason_for_sale", e.target.value)}
              placeholder="Why are you selling this vehicle?"
              className="h-24"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Additional Accessories
            </label>
            <Textarea 
              value={data.accessories || ""}
              onChange={(e) => handleInputChange("accessories", e.target.value)}
              placeholder="List any additional accessories included with the vehicle"
              className="h-24"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Warranty Details
            </label>
            <Select 
              value={data.warranty_details || ""}
              onValueChange={(value) => handleInputChange("warranty_details", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isElectric && (
            <div>
              <label className="block text-sm font-medium mb-1">
                EV Charger Included
              </label>
              <Select 
                value={data.ev_charger_included || ""}
                onValueChange={(value) => handleInputChange("ev_charger_included", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderStepSix = () => {
    const data = stepData[5] || {};
    
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Verification & Legal Compliance</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Important Note</h4>
                <p className="text-sm mt-1">
                  To ensure legal compliance and verify your identity, we require either your Aadhaar or PAN details. 
                  This information will be securely stored and only used for verification purposes.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Identification Document <span className="text-red-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Aadhaar Number (16 digits)
                </label>
                <Input 
                  value={data.aadhaar_number || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                    handleInputChange("aadhaar_number", value);
                  }}
                  placeholder="Enter Aadhaar number"
                  maxLength={16}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  OR PAN Number
                </label>
                <Input 
                  value={data.pan_number || ""}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().slice(0, 10);
                    handleInputChange("pan_number", value);
                  }}
                  placeholder="Enter PAN number"
                  maxLength={10}
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">
              Location Verification <span className="text-red-500">*</span>
            </label>
            
            <Button 
              onClick={fetchLocation}
              disabled={isLoading}
              className="flex items-center gap-2"
              type="button"
            >
              <MapPin className="h-4 w-4" />
              {isLoading ? "Verifying Location..." : "Verify My Current Location"}
            </Button>
            
            {locationDetails && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 rounded-md">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Location Verified</h4>
                    <p className="text-sm mt-1">
                      Address: {locationDetails.formatted}
                    </p>
                    {locationDetails.components.city && (
                      <p className="text-xs mt-1">
                        City: {locationDetails.components.city}
                      </p>
                    )}
                    {locationDetails.components.state && (
                      <p className="text-xs">
                        State: {locationDetails.components.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <input
                id="terms-agree"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={data.terms_agreed || false}
                onChange={(e) => handleInputChange("terms_agreed", e.target.checked)}
              />
              <label htmlFor="terms-agree" className="ml-2 block text-sm">
                I confirm that the information provided above is accurate and I agree to the 
                <a href="/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer"> Terms of Service</a> and 
                <a href="/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderStepSeven = () => {
    // Reuse existing components for Payment & Confirmation
    return (
      <Pricing
        onBack={handleBack}
        expectedPrice={expectedPrice}
        selectedFeatures={selectedFeatures}
      />
    );
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Vehicle Info
        return renderStepOne();
      case 1: // Ownership & Usage
        return renderStepTwo();
      case 2: // Vehicle Condition
        return renderStepThree();
      case 3: // Upload Photos
        return renderStepFour();
      case 4: // Seller Details
        return renderStepFive();
      case 5: // Verification
        return renderStepSix();
      case 6: // Payment and Confirmation
        return renderStepSeven();
      default:
        return null;
    }
  };
  
  // Navigation buttons
  const renderNavigationButtons = () => {
    if (currentStep === 3 || currentStep === 6) {
      // These steps have their own navigation buttons
      return null;
    }
    
    return (
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          className="flex items-center gap-2"
        >
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex items-center gap-2"
        >
          {currentStep === 5 ? "Continue to Payment" : "Continue"}
        </Button>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <ProgressBar currentStep={progressStep} steps={steps} />
        
        <div className="bg-white dark:bg-[#1F2633] rounded-xl p-6 shadow-lg">
          {renderStepContent()}
          {renderNavigationButtons()}
        </div>
      </div>
    </Layout>
  );
};

export default Appointment;
