
import React, { useRef, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";

interface OTPInputProps {
  length: number;
  onComplete: (value: string) => void;
  onChange: (value: string) => void;
  value: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onComplete, onChange, value }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize value state
  const valueArray = value.split("");
  
  // When OTP input is mounted, focus the first input field
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newValue = e.target.value;
    
    // If input is not a number, do nothing
    if (!/^\d*$/.test(newValue)) {
      return;
    }

    // Get all values
    const newValueArray = [...valueArray];
    
    // If the input has a value, and it's one character
    if (newValue && newValue.length === 1) {
      // Update the value
      newValueArray[index] = newValue;
      
      // Move to next input if not the last
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    } 
    // If input is empty (e.g. backspace was pressed)
    else if (newValue === "") {
      // Clear the current input
      newValueArray[index] = "";
    }
    
    // Update the parent component
    const combinedValue = newValueArray.join("");
    onChange(combinedValue);
    
    // If all fields are filled, trigger onComplete
    if (combinedValue.length === length) {
      onComplete(combinedValue);
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    if (!/^\d+$/.test(pastedData)) {
      return;
    }
    
    // Only use up to the required length
    const pastedValues = pastedData.slice(0, length).split("");
    
    const newValueArray = Array(length).fill("");
    pastedValues.forEach((val, i) => {
      newValueArray[i] = val;
    });
    
    // Update inputs
    newValueArray.forEach((val, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = val;
      }
    });
    
    // Focus the next empty input or the last one if all are filled
    const nextEmptyIndex = newValueArray.findIndex(v => v === "");
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
    
    // Update the parent component
    const combinedValue = newValueArray.join("");
    onChange(combinedValue);
    
    // If all fields are filled, trigger onComplete
    if (combinedValue.length === length) {
      onComplete(combinedValue);
    }
  };

  // Handle key press
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !valueArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Move left on arrow left
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Move right on arrow right
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Generate input elements
  const inputs = Array(length).fill(0).map((_, i) => (
    <div key={i} className="w-9 mx-1">
      <Input
        ref={(el) => (inputRefs.current[i] = el)}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={1}
        value={valueArray[i] || ""}
        onChange={(e) => handleChange(e, i)}
        onKeyDown={(e) => handleKeyDown(e, i)}
        onPaste={i === 0 ? handlePaste : undefined}
        className="text-center w-full h-12 rounded-md text-lg font-medium border-2 focus:border-primary focus:ring-primary"
        autoComplete="one-time-code"
      />
    </div>
  ));

  return (
    <div ref={containerRef} className="flex justify-center items-center">
      {inputs}
    </div>
  );
};

export default OTPInput;
