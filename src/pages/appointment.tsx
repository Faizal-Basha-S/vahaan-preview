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
      case 2: // Vehicle Condition
        if (!currentFormData.warranty_status) {
          toast.error("Please select a warranty status");
          return false;
        }
        break;
      case 3: // Photo Upload - validation happens in the component
        break;
      case 4: // Seller Details
        if (!currentFormData.seller_name || !currentFormData.phone_number || 
            !currentFormData.location_city || !currentFormData.seller_price) {
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
