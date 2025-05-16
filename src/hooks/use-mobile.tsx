
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Function to check if device is mobile
    const checkIsMobile = () => {
      return window.innerWidth < MOBILE_BREAKPOINT;
    };

    // Set initial value
    setIsMobile(checkIsMobile());

    // Add event listener for resize
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
