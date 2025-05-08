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
      console.log("🔄 [RegionContext] Starting initialization");

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

        console.log("🔍 [RegionContext] Checking localStorage:", {
          savedRegion,
          userSetRegion,
        });

        if (savedRegion && isValidRegion(savedRegion)) {
          // If we have a valid saved region, use it
          console.log("✅ [RegionContext] Using saved region:", savedRegion);
          setRegion(savedRegion.toUpperCase());
          setHasUserSetRegion(userSetRegion);
          setIsInitialized(true);
          setIsLoading(false);
          return;
        }

        console.log(
          "⚠️ [RegionContext] No valid region in localStorage, detecting from IP"
        );

        // If no saved region, try to detect from IP
        try {
          const response = await fetch("https://ipinfo.io/json");
          if (response.ok) {
            const data = await response.json();
            const countryCode = data.country?.toUpperCase();

            console.log(
              "🌎 [RegionContext] Detected country from IP:",
              countryCode
            );

            // Only set if it's a supported region
            if (Object.keys(REGIONS).includes(countryCode)) {
              console.log(
                "✅ [RegionContext] Setting detected region:",
                countryCode
              );
              localStorage.setItem("app-region", countryCode);
              setRegion(countryCode);
            } else {
              // If not a supported region, use IN as default
              console.log(
                "ℹ️ [RegionContext] Detected region not supported, using default (IN)"
              );
              localStorage.setItem("app-region", "IN");
              setRegion("IN");
            }
          } else {
            // Fallback if IP detection fails
            console.log(
              "❌ [RegionContext] IP detection failed, using default (IN)"
            );
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
        // Mark initialization as complete regardless of outcome
        console.log(
          "✅ [RegionContext] Initialization complete, setting flags"
        );
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
