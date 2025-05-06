
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ 
  question, 
  answer, 
  value 
}) => (
  <AccordionItem value={value} className="border-b border-gray-200 dark:border-gray-800">
    <AccordionTrigger className="text-left font-medium py-6 text-base">
      {question}
    </AccordionTrigger>
    <AccordionContent className="text-muted-foreground pb-6">
      {answer}
    </AccordionContent>
  </AccordionItem>
);

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "Can I sell a car that's still under loan?",
      answer: "Yes, we help settle the loan directly with the bank before completing the sale."
    },
    {
      question: "When will I receive the payment?",
      answer: "Immediately after you accept our offer and confirm the sale."
    },
    {
      question: "Is car inspection free?",
      answer: "Yes, doorstep car inspection is absolutely free."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel the process anytime before the final payment."
    },
    {
      question: "What documents are required?",
      answer: "RC, insurance copy, and ID proof. Our team will guide you through the rest."
    },
    {
      question: "Will you handle the RTO paperwork?",
      answer: "Yes, our experts manage the entire ownership transfer process for you."
    }
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-black">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-10">
            <HelpCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                value={`item-${index}`}
              />
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
