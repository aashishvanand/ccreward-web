import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import RegionSelectionModal from '../../shared/components/layout/RegionSelectionModal';

// Define supported regions
export const REGIONS = {
  IN: "India",
  SG: "Singapore",
};

// Create the context with default values
const RegionContext = createContext({
  region: null, // Start with null to indicate uninitialized
  setRegion: () => {},
  regionName: "Unknown",
  isLoading: true,
  hasUserSetRegion: false,
  isInitialized: false,
  showRegionModal: false,
});

// Simple validation function
const isValidRegion = (regionCode) => {
  return regionCode && Object.keys(REGIONS).includes(regionCode.toUpperCase());
};

export function RegionProvider({ children }) {
  // Initialize states
  const [region, setRegion] = useState(null); // Start with null
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserSetRegion, setHasUserSetRegion] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(null);

  // Define updateRegion function
  const updateRegion = useCallback((newRegion) => {
    if (!newRegion || !isValidRegion(newRegion)) return;

    const upperCaseRegion = newRegion.toUpperCase();

    // Save to localStorage
    localStorage.setItem("app-region", upperCaseRegion);
    localStorage.setItem("user-set-region", "true");

    // Update state
    setRegion(upperCaseRegion);
    setHasUserSetRegion(true);
    setShowRegionModal(false);
    setIsInitialized(true);
    setIsLoading(false);

    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("region-changed", {
        detail: { region: upperCaseRegion },
      })
    );
  }, []);

  // Handle region selection from modal
  const handleRegionSelect = useCallback((selectedRegion) => {
    updateRegion(selectedRegion);
  }, [updateRegion]);

  // Initialization effect
  useEffect(() => {
    async function initializeRegion() {
      console.log("🔄 [RegionContext] Starting initialization");

      // Don't do anything during SSR
      if (typeof window === "undefined") {
        console.log("⚠️ [RegionContext] Window undefined, skipping initialization");
        return;
      }

      try {
        // First check if we already have a region in localStorage
        const savedRegion = localStorage.getItem("app-region");
        const userSetRegion = localStorage.getItem("user-set-region") === "true";

        console.log("🔍 [RegionContext] Checking localStorage:", {
          savedRegion,
          userSetRegion,
        });

        if (savedRegion && isValidRegion(savedRegion)) {
          // If we have a valid saved region (either user-set or auto-detected), use it
          console.log("✅ [RegionContext] Using saved region:", savedRegion);
          setRegion(savedRegion.toUpperCase());
          setHasUserSetRegion(userSetRegion);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        console.log("⚠️ [RegionContext] No saved region, detecting from IP");

        // If no saved region, try to detect from IP
        try {
          const response = await fetch("https://ipinfo.io/json");
          if (response.ok) {
            const data = await response.json();
            const countryCode = data.country?.toUpperCase();
            
            console.log("🌎 [RegionContext] Detected country from IP:", countryCode);
            setDetectedCountry(countryCode);

            // Check if it's a supported region
            if (Object.keys(REGIONS).includes(countryCode)) {
              console.log("✅ [RegionContext] Seamlessly setting supported region:", countryCode);
              localStorage.setItem("app-region", countryCode);
              // Mark as NOT user-set since this was auto-detected
              localStorage.setItem("user-set-region", "false");
              setRegion(countryCode);
              setHasUserSetRegion(false);
              setIsInitialized(true);
              setIsLoading(false);
            } else {
              // Show modal for unsupported regions - this is the key change
              console.log("🚨 [RegionContext] Unsupported region detected, showing selection modal");
              setShowRegionModal(true);
              setIsLoading(false);
              // Don't set isInitialized to true yet - wait for user selection
            }
          } else {
            // IP detection failed - show modal
            console.log("❌ [RegionContext] IP detection failed, showing selection modal");
            setShowRegionModal(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("❌ [RegionContext] Error detecting region:", error);
          // Show modal on error
          setShowRegionModal(true);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("❌ [RegionContext] Unexpected error during initialization:", error);
        // Show modal on any error
        setShowRegionModal(true);
        setIsLoading(false);
      }
    }

    initializeRegion();
  }, []);

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion: updateRegion,
        regionName: region ? REGIONS[region] : "Unknown",
        isLoading,
        hasUserSetRegion,
        isInitialized,
        showRegionModal,
      }}
    >
      {children}
      <RegionSelectionModal
        open={showRegionModal}
        onRegionSelect={handleRegionSelect}
        detectedCountry={detectedCountry}
      />
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