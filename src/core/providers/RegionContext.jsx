"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

// --- Configuration ---
// Define supported regions statically
export const REGIONS = {
  IN: "India",
  SG: "Singapore",
};
// Fallback region if detection/loading fails or yields unsupported region
const DEFAULT_REGION_CODE = "SG"; // Default to Singapore
const IP_DETECTION_API = "https://ipapi.co/json/"; // API for IP-based region detection

// Helper: Validate region code against our static list
const isValidRegion = (regionCode) => {
    return regionCode && Object.keys(REGIONS).includes(regionCode.toUpperCase());
}

// --- Context Definition ---
const RegionContext = createContext({
  region: DEFAULT_REGION_CODE,
  setRegion: (newRegion) => {},
  regionName: REGIONS[DEFAULT_REGION_CODE],
  isLoading: true, // True while determining initial region
  hasUserSetRegion: false,
});

// --- Provider Component ---
export function RegionProvider({ children }) {
  const [currentRegion, setCurrentRegion] = useState(DEFAULT_REGION_CODE);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial determination
  const [hasUserSetRegion, setHasUserSetRegion] = useState(false);

  // --- Function to Detect Region via IP ---
  const detectRegionViaIP = useCallback(async () => {
    console.log("🔍 Detecting region via IP...");
    try {
      const response = await fetch(IP_DETECTION_API);
      if (!response.ok) throw new Error(`IP detection failed: ${response.status}`);
      const data = await response.json();
      const detectedCode = data?.country_code?.toUpperCase();

      // Validate against the static REGIONS list
      if (isValidRegion(detectedCode)) {
        console.log(`✅ Region detected via IP: ${detectedCode}`);
        return detectedCode;
      } else {
        console.warn(`⚠️ IP detected region '${detectedCode || 'N/A'}' not in supported list [${Object.keys(REGIONS).join(', ')}].`);
        return null; // Detected region is not supported
      }
    } catch (error) {
      console.error("❌ Error detecting region via IP:", error);
      return null; // Indicate detection failed
    }
  }, []); // No dependencies needed as REGIONS is static

  // --- Effect 1: Determine Initial Region on Mount ---
  useEffect(() => {
    const determineInitialRegion = async () => {
      let initialRegionCode = DEFAULT_REGION_CODE;
      let userHasChosen = localStorage.getItem("user-set-region") === "true";
      setHasUserSetRegion(userHasChosen);

      console.log("🚀 Determining initial region...");
      console.log("👤 User has previously chosen:", userHasChosen);

      // 1. Try loading user's previously saved choice
      const savedRegion = localStorage.getItem("app-region")?.toUpperCase();
      if (isValidRegion(savedRegion)) {
          console.log(`💾 Using saved region from localStorage: ${savedRegion}`);
          initialRegionCode = savedRegion;
      }
      // 2. If no valid saved region AND user hasn't explicitly chosen before, try IP detection
      else if (!userHasChosen) {
          console.log("🤔 No valid saved region or user hasn't chosen, attempting IP detection...");
          const detectedRegion = await detectRegionViaIP();
          if (detectedRegion) { // Already validated inside detectRegionViaIP
              initialRegionCode = detectedRegion;
          } else {
              console.warn(`⚠️ IP detection failed or yielded unsupported region. Falling back to default: ${DEFAULT_REGION_CODE}`);
              // Keep the initialRegionCode as DEFAULT_REGION_CODE (already set)
          }
      } else {
           console.log(`🤔 User chose previously, but saved region '${savedRegion}' is invalid/unsupported. Falling back to default: ${DEFAULT_REGION_CODE}`);
           // Keep the initialRegionCode as DEFAULT_REGION_CODE (already set)
      }

      console.log(`🏁 Initial region set to: ${initialRegionCode}`);
      setCurrentRegion(initialRegionCode); // Update state

      // Pre-populate localStorage if it wasn't set correctly
      if (localStorage.getItem("app-region")?.toUpperCase() !== initialRegionCode) {
           localStorage.setItem("app-region", initialRegionCode);
      }

      setIsLoading(false); // Mark initial determination as complete
    };

    determineInitialRegion();
  }, [detectRegionViaIP]); // Only depends on the memoized detection function

  // --- Effect 2: Synchronize `currentRegion` State with localStorage ---
  useEffect(() => {
    // Only synchronize after initial load is complete
    if (!isLoading) {
      const currentStoredRegion = localStorage.getItem("app-region");
      if (currentStoredRegion !== currentRegion) {
        console.log(
          `🔄 Synchronizing localStorage: ${currentStoredRegion} -> ${currentRegion}`
        );
        localStorage.setItem("app-region", currentRegion);

        // Optional: Dispatch custom event
        window.dispatchEvent(
          new CustomEvent("region-changed", {
            detail: { region: currentRegion },
          })
        );
      }
    }
  }, [currentRegion, isLoading]);

  // --- Function to Update Region (called by components) ---
  const updateRegion = useCallback((newRegion) => {
    const upperCaseRegion = newRegion?.toUpperCase();

    // Validate against the static REGIONS list
    if (!isValidRegion(upperCaseRegion)) {
      console.error(`❌ Invalid or unsupported region selected: ${newRegion}`);
      return;
    }

    console.log(`➡️ User updating region: ${currentRegion} -> ${upperCaseRegion}`);

    // Mark that the user has made an explicit choice
    localStorage.setItem('user-set-region', 'true');
    setHasUserSetRegion(true); // Update state

    // Update the region state (triggers Effect 2 for localStorage sync)
    setCurrentRegion(upperCaseRegion);

  }, [currentRegion]); // Depends on currentRegion for logging comparison


  // --- Context Value ---
  const contextValue = {
    region: currentRegion,
    setRegion: updateRegion,
    regionName: REGIONS[currentRegion] || REGIONS[DEFAULT_REGION_CODE], // Get name from static list
    isLoading: isLoading,
    hasUserSetRegion: hasUserSetRegion,
    // No need to expose supportedRegions or error if they are static/internal
  };

  return (
    <RegionContext.Provider value={contextValue}>
      {children}
    </RegionContext.Provider>
  );
}

// --- Custom Hook ---
export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}