
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Youtube } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingVideoButtonProps {
  onClick: () => void;
}

const FloatingVideoButton = ({ onClick }: FloatingVideoButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              size="icon"
              className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 shadow-lg group animate-pulse hover:animate-none"
              aria-label="Watch guide video"
            >
              <Youtube className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Watch Guide Video</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingVideoButton;
