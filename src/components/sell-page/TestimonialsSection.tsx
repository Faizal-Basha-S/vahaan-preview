
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialProps {
  rating: number;
  quote: string;
  name: string;
  location: string;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex mb-2">
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    ))}
  </div>
);

const Testimonial: React.FC<TestimonialProps> = ({ 
  rating, 
  quote, 
  name, 
  location 
}) => (
  <Card className="p-6 h-full">
    <StarRating rating={rating} />
    <p className="my-4 text-md">&quot;{quote}&quot;</p>
    <div className="mt-auto">
      <p className="font-semibold">— {name}, <span className="text-muted-foreground">{location}</span></p>
    </div>
  </Card>
);

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      rating: 5,
      quote: "I sold my car in just 2 days without stepping out! The payment was instant and hassle-free.",
      name: "Priya",
      location: "Chennai"
    },
    {
      rating: 4,
      quote: "Superb experience! The inspection at home made it very convenient for me.",
      name: "Aravind",
      location: "Coimbatore"
    },
    {
      rating: 5,
      quote: "The best price for my car and the team helped with all the paperwork. Highly recommended!",
      name: "Rahul",
      location: "Madurai"
    },
    {
      rating: 5,
      quote: "I was skeptical at first, but the price offered was better than other dealers. Fast and efficient service.",
      name: "Kavita",
      location: "Tiruchirappalli"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-black">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Testimonials from Happy Sellers</h2>
        
        <Carousel className="mx-auto max-w-5xl">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <Testimonial
                    rating={testimonial.rating}
                    quote={testimonial.quote}
                    name={testimonial.name}
                    location={testimonial.location}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-8">
            <CarouselPrevious className="static transform-none mx-2" />
            <CarouselNext className="static transform-none mx-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialsSection;
