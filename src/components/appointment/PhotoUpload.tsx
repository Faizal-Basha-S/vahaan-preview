
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Image } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  onBack: () => void;
  onNext: () => void;
}

type PhotoCategory = "Exterior" | "Interior" | "Tyres" | "Features" | "Defects";

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onBack, onNext }) => {
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory>("Exterior");
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<PhotoCategory, File[]>>({
    Exterior: [],
    Interior: [],
    Tyres: [],
    Features: [],
    Defects: []
  });
  
  const categories: PhotoCategory[] = ["Exterior", "Interior", "Tyres", "Features", "Defects"];
  
  const getCategoryInstruction = (category: PhotoCategory): string => {
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
        return "Upload photos of any scratches, dents, or other defects on your vehicle.";
      default:
        return "Please upload clear photos.";
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Check file size and type
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.match('image/jpeg|image/png|image/jpg')) {
        invalidFiles.push(`${file.name} (invalid format)`);
        return;
      }
      
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (exceeds 5MB)`);
        return;
      }
      
      // Max 10 images per category
      if (uploadedPhotos[selectedCategory].length + validFiles.length >= 10) {
        toast.error(`Maximum 10 images allowed for ${selectedCategory} category`);
        return;
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
      toast.success(`${validFiles.length} photo(s) uploaded successfully!`);
    }
  };
  
  const removePhoto = (category: PhotoCategory, index: number) => {
    setUploadedPhotos(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };
  
  const handleNext = () => {
    // Check if at least one photo is uploaded for each category
    const missingCategories = categories.filter(category => uploadedPhotos[category].length === 0);
    
    if (missingCategories.length > 0) {
      toast.error(`Please upload at least one photo for each category: ${missingCategories.join(", ")}`);
      return;
    }
    
    // Convert uploaded photos to a format that can be stored in localStorage
    try {
      // Store photo paths or references
      const photoReferences: Record<PhotoCategory, string[]> = {} as Record<PhotoCategory, string[]>;
      
      categories.forEach(category => {
        photoReferences[category] = uploadedPhotos[category].map(file => file.name);
      });
      
      localStorage.setItem("uploaded_photos", JSON.stringify(photoReferences));
      onNext();
    } catch (error) {
      toast.error("Failed to process photos. Please try again.");
      console.error("Error processing photos:", error);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Upload Your Photos</h2>
      
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
      </div>
      
      {/* Instructions */}
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {getCategoryInstruction(selectedCategory)}
      </p>
      
      {/* Upload area */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-6">
        <div className="flex flex-col items-center justify-center">
          <Upload className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-lg font-medium mb-2">Drag and drop your images here</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            JPG or PNG, max 5MB per file (up to 10 files)
          </p>
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Browse files
            </div>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/jpg"
              multiple
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      
      {/* Preview uploaded photos */}
      {uploadedPhotos[selectedCategory].length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">{selectedCategory} Photos</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedPhotos[selectedCategory].map((file, index) => (
              <div key={index} className="relative">
                <div className="aspect-square rounded-md overflow-hidden border dark:border-gray-600">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`${selectedCategory} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removePhoto(selectedCategory, index)}
                  className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white text-xs"
                  aria-label="Remove photo"
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
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} className="flex items-center gap-2">
          Continue to Tell Us Your Price
        </Button>
      </div>
    </div>
  );
};

export default PhotoUpload;
