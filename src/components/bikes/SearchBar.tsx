
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Bike } from "lucide-react";

interface SearchBarProps {
  className?: string;
  isCompact?: boolean;
}

const SearchBar = ({ className = "", isCompact = false }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submit logic here
    console.log({ searchQuery, location });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div 
      className={`
        w-full rounded-lg 
        shadow-light-searchbar dark:shadow-dark-searchbar 
        bg-card dark:bg-card p-3 
        ${isCompact ? 'scale-95 shadow-md' : ''} 
        ${className}
      `}
    >
      <form onSubmit={handleSubmit}>
        <div className={`flex flex-col md:flex-row gap-2 ${isCompact ? 'md:h-10 items-center' : ''}`}>
          {/* Bike Icon - Hide in compact mode */}
          {!isCompact && (
            <div className="hidden md:flex items-center justify-center p-2 bg-primary/10 rounded-lg">
              <Bike className="h-5 w-5 text-primary" />
            </div>
          )}
          
          {/* Search Input */}
          <div className={`flex-1 ${isCompact ? 'px-2' : 'px-3 py-2'}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${isCompact ? 'h-4 w-4' : 'h-5 w-5'}`} />
              <input
                type="text"
                name="query"
                placeholder={isCompact ? "Search Bikes or Brands " : "Search by make, model, or keyword..."}
                className={`w-full pl-10 pr-4 ${isCompact ? 'py-2 text-sm' : 'py-3'} bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground`}
                value={searchQuery}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Location Input - Hide in compact mode */}
          {!isCompact && (
            <div className="relative md:w-48">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Location" 
                className="pl-10 bg-background dark:bg-background"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          )}
          
          {/* Search Button - Hide in compact mode */}
          {!isCompact && (
            <Button type="submit">Search</Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
