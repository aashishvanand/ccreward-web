"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Define supported regions
export const REGIONS = {
  IN: "India",
  SG: "Singapore",
};

// Create context with default values
const RegionContext = createContext({
  region: "IN",
  setRegion: () => {},
  regionName: REGIONS.IN,
});

export function RegionProvider({ children }) {
  const [region, setRegion] = useState("IN"); // Default to India
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserSetRegion, setHasUserSetRegion] = useState(false);

  // This effect runs once on component mount to initialize from localStorage
  useEffect(() => {
    // Try to load from localStorage first (user's previous choice)
    const savedRegion = localStorage.getItem("app-region");

    // Check user choice - explicitly compare with string 'true'
    const userHasChosen = localStorage.getItem("user-set-region") === "true";
    setHasUserSetRegion(userHasChosen);

    console.log("💼 Initial region from localStorage:", savedRegion);
    console.log("👤 User has chosen region:", userHasChosen);

    // If we have a valid saved region, use it
    if (
      savedRegion &&
      Object.keys(REGIONS).includes(savedRegion.toUpperCase())
    ) {
      setRegion(savedRegion.toUpperCase());
    } else if (!userHasChosen) {
      // Only attempt IP detection if we haven't loaded a valid region from storage
      detectRegion();
    }

    setIsLoading(false);
  }, []);

  // This effect synchronizes region with localStorage on every region change
  useEffect(() => {
    if (!isLoading) {
      const currentStoredRegion = localStorage.getItem("app-region");
      if (currentStoredRegion !== region) {
        console.log(
          `💼 Synchronizing localStorage with current region: ${region}`
        );
        localStorage.setItem("app-region", region);

        // Dispatch custom event to notify other components
        window.dispatchEvent(
          new CustomEvent("region-changed", {
            detail: { region },
          })
        );
      }
    }
  }, [region, isLoading]);

  const detectRegion = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      // Set region based on country code
      if (data.country_code === "SG") {
        console.log("🌍 IP detection suggests region: SG");
        setRegion("SG");
      } else {
        // Default to India for all other regions for now
        console.log("🌍 IP detection suggests default region: IN");
        setRegion("IN");
      }
    } catch (error) {
      console.error("Error detecting region:", error);
      // Default to India if detection fails
      setRegion("IN");
    }
  };

  const updateRegion = (newRegion) => {
    // Validate the region
    if (!Object.keys(REGIONS).includes(newRegion.toUpperCase())) {
      console.error("Invalid region:", newRegion);
      return;
    }
    
    // Mark this as a user choice
    localStorage.setItem('user-set-region', 'true');
    setHasUserSetRegion(true); // Update state immediately
    
    // Store region in localStorage - ALWAYS STORE UPPERCASE for consistency
    localStorage.setItem('app-region', newRegion.toUpperCase());
    
    // Update state
    console.log(`💼 Setting region: ${region} -> ${newRegion}`);
    setRegion(newRegion.toUpperCase());
  };

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion: updateRegion,
        regionName: REGIONS[region],
        isLoading,
        hasUserSetRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

// Custom hook for using the region context
export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}
