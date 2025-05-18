
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal = ({ isOpen, onClose }: VideoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl" fullScreenOnMobile={true} closeButton={false}>
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            How to Fill Out the Appointment Form
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Close video"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/VNlrhkGySkg?autoplay=1"
            title="How to Fill Out the Appointment Form"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-md"
          ></iframe>
        </div>
        <DialogDescription className="text-center mt-4">
          Watch this quick video to better understand how to book your appointment and fill out the form correctly.
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
