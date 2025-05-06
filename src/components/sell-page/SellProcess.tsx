
import React from "react";
import { Card } from "@/components/ui/card";
import { Car, ClipboardCheck, Banknote } from "lucide-react";

interface ProcessStepProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ 
  step, 
  title, 
  description, 
  icon 
}) => (
  <Card className="p-6 flex flex-col items-center text-center transition-all hover:shadow-lg">
    <div className="bg-primary/10 rounded-full p-4 mb-4">
      {icon}
    </div>
    <div className="text-sm font-semibold text-primary mb-2">{step}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </Card>
);

const SellProcess: React.FC = () => {
  const steps = [
    {
      step: "Step 1",
      title: "Check Your Car's Price",
      description: "Tell us about your car and get a quick, accurate price estimate.",
      icon: <Car className="h-8 w-8 text-primary" />
    },
    {
      step: "Step 2",
      title: "Schedule Free Inspection",
      description: "Our expert will inspect your car at your home or office, at your convenience.",
      icon: <ClipboardCheck className="h-8 w-8 text-primary" />
    },
    {
      step: "Step 3",
      title: "Get Paid Instantly",
      description: "Finalize the offer and receive instant payment on the spot.",
      icon: <Banknote className="h-8 w-8 text-primary" />
    }
  ];
  
  return (
    <section className="py-16 px-4 bg-white dark:bg-black">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Sell Your Car in 3 Simple Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <ProcessStep
              key={index}
              step={step.step}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SellProcess;
