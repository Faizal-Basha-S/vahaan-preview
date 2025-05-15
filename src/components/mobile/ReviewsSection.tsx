
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Review {
  id: number;
  name: string;
  photoUrl?: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Michael Brown",
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "I found my dream car within a week of searching on VahaanXchange. The filters made it easy to narrow down exactly what I was looking for."
  },
  {
    id: 2,
    name: "Sarah Johnson",
    photoUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Selling my car on VahaanXchange was incredibly simple. I had multiple inquiries within days and sold for a great price."
  },
  {
    id: 3,
    name: "David Wilson",
    photoUrl: "https://randomuser.me/api/portraits/men/62.jpg",
    rating: 4,
    text: "As a small dealership, VahaanXchange has become an essential part of our business. The platform's reach and user-friendly interface has helped us connect with more customers."
  },
  {
    id: 4,
    name: "Priya Sharma",
    photoUrl: "https://randomuser.me/api/portraits/women/25.jpg",
    rating: 5,
    text: "The verification process gave me confidence that I was dealing with genuine sellers. Found and purchased my bike hassle-free!"
  }
];

const ReviewsSection = () => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">What Our Users Say</h2>
      
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex space-x-4 w-max">
          {reviews.map((review) => (
            <Card key={review.id} className="w-[280px] flex-shrink-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={review.photoUrl} />
                    <AvatarFallback>{review.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">{review.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">"{review.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ReviewsSection;
