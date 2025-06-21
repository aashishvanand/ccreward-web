import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// Define supported regions
export const REGIONS = {
  IN: "India",
  SG: "Singapore",
};

// Create the context with default values
const RegionContext = createContext({
  region: "IN",
  setRegion: () => {},
  regionName: "India",
  isLoading: true,
  hasUserSetRegion: false,
  isInitialized: false,
});

// Simple validation function
const isValidRegion = (regionCode) => {
  return regionCode && Object.keys(REGIONS).includes(regionCode.toUpperCase());
};

export function RegionProvider({ children }) {
  // Initialize states
  const [region, setRegion] = useState("IN");
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserSetRegion, setHasUserSetRegion] = useState(false);

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

    // Dispatch event for other components
    window.dispatchEvent(
      new CustomEvent("region-changed", {
        detail: { region: upperCaseRegion },
      })
    );
  }, []);

  // Initialization effect
  useEffect(() => {
    async function initializeRegion() {

      // Don't do anything during SSR
      if (typeof window === "undefined") {
        console.log(
          "⚠️ [RegionContext] Window undefined, skipping initialization"
        );
        return;
      }

      try {
        // First check if we already have a region in localStorage
        const savedRegion = localStorage.getItem("app-region");
        const userSetRegion =
          localStorage.getItem("user-set-region") === "true";

        if (savedRegion && isValidRegion(savedRegion)) {
          // If we have a valid saved region, use it
          setRegion(savedRegion.toUpperCase());
          setHasUserSetRegion(userSetRegion);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        // If no saved region, try to detect from IP
        try {
          const response = await fetch("https://ipinfo.io/json");
          if (response.ok) {
            const data = await response.json();
            const countryCode = data.country?.toUpperCase();

            // Only set if it's a supported region
            if (Object.keys(REGIONS).includes(countryCode)) {
              localStorage.setItem("app-region", countryCode);
              setRegion(countryCode);
            } else {
              localStorage.setItem("app-region", "IN");
              setRegion("IN");
            }
          } else {
            localStorage.setItem("app-region", "IN");
            setRegion("IN");
          }
        } catch (error) {
          console.error("❌ [RegionContext] Error detecting region:", error);
          // Fallback if anything goes wrong
          localStorage.setItem("app-region", "IN");
          setRegion("IN");
        }
      } catch (error) {
        console.error(
          "❌ [RegionContext] Unexpected error during initialization:",
          error
        );
        // Set default values even on error
        setRegion("IN");
      } finally {
        setIsInitialized(true);
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
