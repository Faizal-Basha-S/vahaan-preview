
import { createClient } from '@supabase/supabase-js';

// Using direct values as specified rather than environment variables
export const supabase = createClient(
  'https://kujjqfvicrazqitxkdwh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1ampxZnZpY3JhenFpdHhrZHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDUwNjUsImV4cCI6MjA2MTUyMTA2NX0.p1rMYOU6rp6im1PaJyeQydxldKeQ4WXbOinDtsDUxl8'
);

/**
 * Handles publishing a vehicle listing to the appropriate Supabase table
 * based on the vehicle type stored in localStorage
 */
export const handlePublishListing = async () => {
  // Determine vehicle type and target table
  const vehicleType = localStorage.getItem('vehicle');
  const table = vehicleType === 'car' ? 'car_seller_listings' : vehicleType === 'bike' ? 'bike_seller_listings' : null;

  if (!table) {
    console.error("Invalid vehicle type, cannot determine target table.");
    return { error: "Invalid vehicle type", success: false };
  }

  console.log(`Publishing ${vehicleType} listing to table: ${table}`);

  // Helper function to safely parse JSON from localStorage
  const parseJSON = (key) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch (error) {
      console.warn(`Failed to parse JSON from key: ${key}`, error);
      return null;
    }
  };

  // Helper function to safely parse nested JSON data from localStorage
  const getNestedValue = (objectKey, propertyKey) => {
    try {
      const objectStr = localStorage.getItem(objectKey);
      if (!objectStr) return null;
      
      const object = JSON.parse(objectStr);
      return object[propertyKey] || null;
    } catch (error) {
      console.warn(`Failed to get nested value: ${objectKey}.${propertyKey}`, error);
      return null;
    }
  };

  // Parse data from various localStorage sources
  // Step 1 data
  const step1Data = parseJSON('appointment_step1_data') || {};
  
  // Step 2 data
  const step2Data = parseJSON('appointment_step2_data') || {};
  
  // Step 3 data
  const step3Data = parseJSON('appointment_step3_data') || {};
  
  // Step 5 data
  const step5Data = parseJSON('appointment_step5_data') || {};
  
  // Step 6 data
  const step6Data = parseJSON('appointment_step6_data') || {};
  
  // Sell form data
  const sellFormData = parseJSON('sellFormData') || {};

  // Extract phone number from localStorage sources
  let phoneNumber = null;
  
  // First try to get it from step5Data
  if (step5Data && step5Data.phone_number) {
    phoneNumber = step5Data.phone_number;
  }
  
  // If not found, check for user profile in localStorage
  if (!phoneNumber) {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("userProfile_")) {
        try {
          const profile = JSON.parse(localStorage.getItem(key) || "{}");
          if (profile && profile.phoneNumber) {
            phoneNumber = profile.phoneNumber;
          }
        } catch (e) {
          console.error("Error parsing user profile:", e);
        }
      }
    });
  }

  // Construct the data object with appropriate type conversions and fallbacks
  const data = {
    registration_number: step1Data.registration_number || null,
    rto_state: step1Data.rto_state || null,
    rto: step1Data.rto || null,
    vehicle_type: step1Data.body_type || null,
    cc: step1Data.engine_cc ? parseInt(step1Data.engine_cc, 10) || null : null,
    load_capacity: step1Data.load_capacity ? parseInt(step1Data.load_capacity, 10) || null : null,
    
    number_of_owners: step2Data.number_of_owners ? parseInt(step2Data.number_of_owners, 10) || null : null,
    ownership_type: step2Data.ownership_type || null,
    fuel_type: step2Data.fuel_type || null,
    color: step2Data.color || null,
    transmission_type: step2Data.transmission_type || null,
    modifications: step2Data.modifications || null,
    battery_health: step2Data.battery_health || null,
    
    warranty_status: step3Data.warranty_status || null,
    loan_status: step3Data.loan_status || null,
    tire_condition: step3Data.tire_condition || null,
    permit_type: step3Data.permit_type || null,
    fitness_certificate: step3Data.fitness_certificate || null,
    vehicle_battery: step3Data.vehicle_battery || null,
    accident_history: step3Data.accident_history || null,
    major_replacements: step3Data.major_replacements || null,
    
    seller_name: step5Data.seller_name || null,
    sell_price: step5Data.seller_price ? parseFloat(step5Data.seller_price) || null : null,
    seller_phone_number: step5Data.phone_number || null,
    seller_location_city: step5Data.location_city || null,
    preferred_contact_time: step5Data.preferred_contact_time || null,
    warranty_details: step5Data.warranty_details || null,
    ev_charger_included: step5Data.ev_charger_included || null,
    reason_for_sale: step5Data.reason_for_sale || null,
    accessories: step5Data.accessories || null,
    
    aadhaar_number: step6Data.aadhaar_number || null,
    pan_number: step6Data.pan_number || null,
    api_location: step6Data.live_location || null,
    
    brand: sellFormData.brand || null,
    year: sellFormData.year ? parseInt(sellFormData.year, 10) || null : null,
    model: sellFormData.model || null,
    variant: sellFormData.variant || null,
    kilometers_driven: sellFormData.kilometersDriven ? parseInt(sellFormData.kilometersDriven, 10) || null : null,
    
    city: localStorage.getItem('selectedCity') || null,
    photos: parseJSON('uploadedFileUrls'),
    phone_number: phoneNumber
  };

  console.log("Target Table:", table);
  console.log("Data to Insert:", data);

  try {
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert([data]);

    if (error) {
      console.error('Error inserting data into Supabase:', error.message, error.details);
      return { error, success: false };
    } else {
      console.log('Data inserted successfully:', insertedData);
      return { data: insertedData, success: true };
    }
  } catch (error) {
    console.error('Exception during data insertion:', error);
    return { error, success: false };
  }
};
