import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Define supported regions
export const REGIONS = {
  IN: "India",
  SG: "Singapore",
};

// Get initial region from localStorage if available
const getInitialRegion = () => {
  // Only access localStorage on the client side
  if (typeof window !== 'undefined') {
    const savedRegion = localStorage.getItem("app-region")?.toUpperCase();
    if (savedRegion && Object.keys(REGIONS).includes(savedRegion)) {
      return savedRegion;
    }
  }
  // Default to "IN" if nothing found
  return "IN";
};

// Check if user has explicitly set a region
const getUserRegionPreference = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("user-set-region") === "true";
  }
  return false;
};

// Create the context with values from localStorage
const RegionContext = createContext({
  region: getInitialRegion(),
  setRegion: () => {},
  regionName: REGIONS[getInitialRegion()] || "Unknown Region",
  isLoading: true,
  hasUserSetRegion: getUserRegionPreference(),
});

// Simple validation function
const isValidRegion = (regionCode) => {
  return regionCode && Object.keys(REGIONS).includes(regionCode.toUpperCase());
};

export function RegionProvider({ children }) {
  // Initialize state from localStorage
  const [region, setRegion] = useState(getInitialRegion());
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserSetRegion, setHasUserSetRegion] = useState(getUserRegionPreference());
  
  // Define updateRegion function that was missing
  const updateRegion = useCallback((newRegion) => {
    if (!newRegion || !isValidRegion(newRegion)) return;
    
    const upperCaseRegion = newRegion.toUpperCase();
    
    // Save to localStorage
    localStorage.setItem("app-region", upperCaseRegion);
    localStorage.setItem("user-set-region", "true");
    
    // Update state
    setRegion(upperCaseRegion);
    setHasUserSetRegion(true);
    
    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("region-changed", {
        detail: { region: upperCaseRegion },
      })
    );
  }, []);
  
  useEffect(() => {
    async function initializeRegion() {
      // Don't do anything during SSR
      if (typeof window === 'undefined') return;
      
      const savedRegion = localStorage.getItem("app-region");
      
      if (!savedRegion) {
        try {
          // Try to detect region from IP
          const response = await fetch("https://ipinfo.io/json");
          if (response.ok) {
            const data = await response.json();
            const countryCode = data.country?.toUpperCase();
            
            // Only set if it's a supported region
            if (Object.keys(REGIONS).includes(countryCode)) {
              localStorage.setItem("app-region", countryCode);
              setRegion(countryCode);
            } else {
              // If not a supported region, use IN as default
              localStorage.setItem("app-region", "IN");
              setRegion("IN");
            }
          } else {
            // Fallback if IP detection fails
            localStorage.setItem("app-region", "IN");
            setRegion("IN");
          }
        } catch (error) {
          console.error("Error detecting region:", error);
          // Fallback if anything goes wrong
          localStorage.setItem("app-region", "IN");
          setRegion("IN");
        }
      }
      
      // Mark initialization as complete
      setIsInitialized(true);
      setIsLoading(false);
    }
    
    initializeRegion();
  }, []);
  
  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion: updateRegion,  // Now the function is defined
        regionName: REGIONS[region] || "Unknown Region",
        isLoading,
        hasUserSetRegion,
        isInitialized,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

// Custom hook
export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}