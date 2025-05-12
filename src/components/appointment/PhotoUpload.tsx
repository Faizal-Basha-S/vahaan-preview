
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Image, FileVideo } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PhotoUploadProps {
  onBack: () => void;
  onNext: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onBack, onNext }) => {
  const vehicle = localStorage.getItem("vehicle") || "car";
  const carCategories = ["Exterior", "Interior", "Tyres", "Features", "Defects", "Odometer"];
  const bikeCategories = ["Front", "Rear", "Left", "Right", "Defects", "Odometer"];
  const categories = vehicle === "bike" ? bikeCategories : carCategories;
  
  // Separate video category for walkaround videos
  const videoCategory = "Walkaround";

  type PhotoCategory = typeof categories[number] | typeof videoCategory;

  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>(categories[0]);
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, File[]>>(() => {
    const initialState: Record<string, File[]> = {};
    categories.forEach(category => {
      initialState[category] = [];
    });
    initialState[videoCategory] = []; // Initialize video category
    return initialState;
  });
  const [isUploading, setIsUploading] = useState(false);
  
  // Update selected category when vehicle type changes
  useEffect(() => {
    setSelectedCategory(categories[0]);
    
    // Reset uploaded photos when vehicle type changes
    const initialState: Record<string, File[]> = {};
    categories.forEach(category => {
      initialState[category] = [];
    });
    initialState[videoCategory] = []; // Initialize video category
    setUploadedPhotos(initialState);
  }, [vehicle]);
  
  const getCategoryInstruction = (category: string): string => {
    if (category === "Odometer") {
      return "Upload a clear photo of your vehicle's odometer showing the current mileage reading.";
    } else if (category === "Walkaround") {
      return "Upload a video walking around your vehicle showing all sides in a continuous shot. Maximum 30 seconds.";
    } else if (vehicle === "bike") {
      switch (category) {
        case "Front":
          return "Upload clear photos of the front view of your bike including headlights and front wheel.";
        case "Rear":
          return "Upload photos of the rear view including tail lights and exhaust.";
        case "Left":
          return "Upload clear side view photos from the left side of your bike.";
        case "Right":
          return "Upload clear side view photos from the right side of your bike.";
        case "Defects":
          return "Upload close-up photos of any scratches, dents, or other defects on your bike.";
        default:
          return "Please upload clear photos.";
      }
    } else {
      switch (category) {
        case "Exterior":
          return "Upload clear photos of all sides of your vehicle including front, back, and side views.";
        case "Interior":
          return "Upload photos of your vehicle's interior including dashboard, seats, and boot space.";
        case "Tyres":
          return "Upload close-up photos of all tyres showing tread pattern and condition.";
        case "Features":
          return "Upload photos of special features like infotainment system, sunroof, etc.";
        case "Defects":
          return "Upload close-up photos of any scratches, dents, or other defects on your vehicle.";
        default:
          return "Please upload clear photos.";
      }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Check file size and type
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    // Determine if we're uploading to the video category
    const isVideo = selectedCategory === "Walkaround";
    
    Array.from(files).forEach(file => {
      if (isVideo) {
        // Check video file type
        if (!file.type.match('video/mp4|video/webm|video/ogg')) {
          invalidFiles.push(`${file.name} (invalid format)`);
          return;
        }
        
        // Check video file size (30MB = 30 * 1024 * 1024 bytes)
        if (file.size > 30 * 1024 * 1024) {
          invalidFiles.push(`${file.name} (exceeds 30MB)`);
          return;
        }
        
        // Only 1 video allowed
        if (uploadedPhotos[selectedCategory].length + validFiles.length >= 1) {
          toast.error(`Only 1 video allowed for ${selectedCategory}`);
          return;
        }
      } else {
        // Check image file type
        if (!file.type.match('image/jpeg|image/png|image/jpg')) {
          invalidFiles.push(`${file.name} (invalid format)`);
          return;
        }
        
        // Check image file size (5MB = 5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
          invalidFiles.push(`${file.name} (exceeds 5MB)`);
          return;
        }
        
        // Max 10 images per category
        if (uploadedPhotos[selectedCategory].length + validFiles.length >= 10) {
          toast.error(`Maximum 10 images allowed for ${selectedCategory} category`);
          return;
        }
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      toast.error(`Some files couldn't be uploaded: ${invalidFiles.join(", ")}`);
    }
    
    if (validFiles.length > 0) {
      setUploadedPhotos(prev => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], ...validFiles]
      }));
      toast.success(`${validFiles.length} ${isVideo ? 'video' : 'photo'}(s) uploaded successfully!`);
    }
  };
  
  const removePhoto = (category: string, index: number) => {
    setUploadedPhotos(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };
  
  const uploadPhotosToSupabase = async () => {
    // Check if at least one photo is uploaded for each category including Walkaround video
    const allCategories = [...categories, videoCategory];
    const missingCategories = allCategories.filter(category => uploadedPhotos[category].length === 0);
    
    if (missingCategories.length > 0) {
      toast.error(`Please upload at least one item for each category: ${missingCategories.join(", ")}`);
      return false;
    }
    
    setIsUploading(true);
    const vehicleType = vehicle === "bike" ? "bike" : "car";
    const basePath = `temp/${vehicleType}`;
    
    try {
      const uploadedFileNames: Record<string, string[]> = {};
      const uploadedFileUrls: Record<string, string[]> = {};
      
      // Initialize categories
      allCategories.forEach(category => {
        uploadedFileNames[category] = [];
        uploadedFileUrls[category] = [];
      });
      
      // Upload files for each category
      for (const category of allCategories) {
        const files = uploadedPhotos[category];
        const isVideo = category === "Walkaround";
        
        // Use Promise.all for parallel uploads
        await Promise.all(files.map(async (file) => {
          // Create a unique filename to avoid conflicts
          const timestamp = new Date().getTime();
          const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
          const filePath = `${basePath}/${category.toLowerCase()}/${fileName}`;

          
          const { data, error } = await supabase.storage
            .from("seller-uploads")
            .upload(filePath, file, { upsert: true });
            
          if (error) {
            console.error(`Error uploading ${fileName}:`, error);
            toast.error(`Failed to upload ${file.name}`);
            return;
          }
          
          // Get public URL for the file
          const { data: publicUrlData } = supabase.storage
            .from("seller-uploads")
            .getPublicUrl(filePath);
            
          if (publicUrlData) {
            uploadedFileNames[category].push(fileName);
            uploadedFileUrls[category].push(publicUrlData.publicUrl);
          }
        }));
      }
      
      // Store metadata in localStorage
      localStorage.setItem("uploadedFileNames", JSON.stringify(uploadedFileNames));
      localStorage.setItem("uploadedFileUrls", JSON.stringify(uploadedFileUrls));
      
      toast.success("All photos and videos uploaded successfully!");
      return true;
      
    } catch (error) {
      console.error("Error during upload:", error);
      toast.error("An error occurred while uploading your files. Please try again.");
      return false;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleNext = async () => {
    const uploadSuccess = await uploadPhotosToSupabase();
    if (uploadSuccess) {
      onNext();
    }
  };
  
  // Determine if current category is video
  const isVideoCategory = selectedCategory === "Walkaround";
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Upload Your Photos & Videos</h2>
      
      {/* Category buttons */}
      <div className="flex overflow-x-auto space-x-3 pb-3 mb-4">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="px-4 py-2 flex items-center whitespace-nowrap"
          >
            {category}
            {uploadedPhotos[category].length > 0 && (
              <span className="ml-2 text-xs bg-white dark:bg-gray-800 text-primary rounded-full w-5 h-5 flex items-center justify-center">
                {uploadedPhotos[category].length}
              </span>
            )}
          </Button>
        ))}
        
        {/* Walkaround video button */}
        <Button
          key={videoCategory}
          variant={selectedCategory === videoCategory ? "default" : "outline"}
          onClick={() => setSelectedCategory(videoCategory)}
          className="px-4 py-2 flex items-center whitespace-nowrap"
        >
          <FileVideo className="h-4 w-4 mr-2" />
          {videoCategory}
          {uploadedPhotos[videoCategory].length > 0 && (
            <span className="ml-2 text-xs bg-white dark:bg-gray-800 text-primary rounded-full w-5 h-5 flex items-center justify-center">
              {uploadedPhotos[videoCategory].length}
            </span>
          )}
        </Button>
      </div>
      
      {/* Instructions */}
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {getCategoryInstruction(selectedCategory)}
      </p>
      
      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-6">
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-lg font-medium mb-2">
            Drag and drop your {isVideoCategory ? 'video' : 'images'} here
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {isVideoCategory 
              ? 'MP4, WebM or OGG, max 30MB per file (1 file only)'
              : 'JPG or PNG, max 5MB per file (up to 10 files)'}
          </p>
          <label htmlFor={`file-upload-${selectedCategory}`} className="cursor-pointer">
            <div className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Browse files
            </div>
            <input
              id={`file-upload-${selectedCategory}`}
              name={`file-upload-${selectedCategory}`}
              type="file"
              className="sr-only"
              accept={isVideoCategory 
                ? "video/mp4,video/webm,video/ogg" 
                : "image/jpeg,image/png,image/jpg"}
              multiple={!isVideoCategory}
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      
      {/* Preview uploaded files */}
      {uploadedPhotos[selectedCategory].length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">{selectedCategory} {isVideoCategory ? 'Video' : 'Photos'}</h3>
          <div className={`grid ${isVideoCategory ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
            {uploadedPhotos[selectedCategory].map((file, index) => (
              <div key={index} className="relative">
                <div className={`${isVideoCategory ? 'aspect-video w-full' : 'aspect-square'} rounded-md overflow-hidden border dark:border-gray-600`}>
                  {isVideoCategory ? (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`${selectedCategory} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button
                  onClick={() => removePhoto(selectedCategory, index)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white text-xs"
                  aria-label="Remove file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2" disabled={isUploading}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex items-center gap-2"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Continue to Tell Us Your Price"}
        </Button>
      </div>
    </div>
  );
};

export default PhotoUpload;
