
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [initialRenderComplete, setInitialRenderComplete] = React.useState(false)

  React.useEffect(() => {
    // Mark initial render complete (fixes hydration issues)
    setInitialRenderComplete(true)
    
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

  // During initial server-side rendering and first client render
  // return undefined to avoid incorrect initial state
  if (!initialRenderComplete) {
    return undefined;
  }

  return isMobile;
}
