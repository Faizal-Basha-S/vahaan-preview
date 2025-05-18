
import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VideoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoGuideModal: React.FC<VideoGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0 flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold">How to Fill Out the Appointment Form</DialogTitle>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        <div className="p-4 pt-2">
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <iframe 
              src="https://www.youtube.com/embed/VNlrhkGySkg" 
              title="How to Fill Out the Appointment Form"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Watch this quick video to better understand how to book your appointment and fill out the form correctly.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoGuideModal;
