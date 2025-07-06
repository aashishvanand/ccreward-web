// src/core/providers/RegionContext.jsx - FIXED: Single Modal Instance
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import RegionSelectionModal from '../../shared/components/layout/RegionSelectionModal';

// Define supported regions
export const REGIONS = {
  IN: "India",
  SG: "Singapore",
};

// Create the context with default values
const RegionContext = createContext({
  region: null,
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

// Global flag to prevent multiple modal instances
let modalShown = false;
let initializationInProgress = false;

export function RegionProvider({ children }) {
  const [region, setRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserSetRegion, setHasUserSetRegion] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(null);
  const initRef = useRef(false);

  const updateRegion = useCallback((newRegion) => {
    if (!newRegion || !isValidRegion(newRegion)) return;

    const upperCaseRegion = newRegion.toUpperCase();

    localStorage.setItem("app-region", upperCaseRegion);
    localStorage.setItem("user-set-region", "true");

    setRegion(upperCaseRegion);
    setHasUserSetRegion(true);
    setShowRegionModal(false);
    setIsInitialized(true);
    setIsLoading(false);
    
    // Reset global flag when modal is closed
    modalShown = false;

    window.dispatchEvent(
      new CustomEvent("region-changed", {
        detail: { region: upperCaseRegion },
      })
    );
  }, []);

  const handleRegionSelect = useCallback((selectedRegion) => {
    updateRegion(selectedRegion);
  }, [updateRegion]);

  useEffect(() => {
    // Prevent multiple initializations
    if (initRef.current || initializationInProgress) {
      return;
    }
    
    initRef.current = true;
    initializationInProgress = true;

    async function initializeRegion() {
      console.log("🔄 [RegionContext] Starting initialization");
      
      if (typeof window === "undefined") {
        initializationInProgress = false;
        return;
      }

      try {
        const savedRegion = localStorage.getItem("app-region");
        const userSetRegion = localStorage.getItem("user-set-region") === "true";

        if (savedRegion && isValidRegion(savedRegion)) {
          console.log("✅ [RegionContext] Found saved region:", savedRegion);
          setRegion(savedRegion.toUpperCase());
          setHasUserSetRegion(userSetRegion);
          setIsInitialized(true);
          setIsLoading(false);
          initializationInProgress = false;
          return;
        }

        console.log("🌍 [RegionContext] No saved region, detecting location...");
        
        try {
          const response = await fetch("https://ipinfo.io/json");
          if (response.ok) {
            const data = await response.json();
            const countryCode = data.country?.toUpperCase();
            console.log("🗺️ [RegionContext] Detected country:", countryCode);
            setDetectedCountry(countryCode);

            if (Object.keys(REGIONS).includes(countryCode)) {
              // Auto-detect supported region
              localStorage.setItem("app-region", countryCode);
              localStorage.setItem("user-set-region", "false");
              setRegion(countryCode);
              setHasUserSetRegion(false);
              setIsInitialized(true);
              console.log("✅ [RegionContext] Auto-selected region:", countryCode);
            } else {
              // Show modal only if not already shown
              if (!modalShown) {
                console.log("❓ [RegionContext] Unsupported region, showing modal");
                modalShown = true;
                setShowRegionModal(true);
              }
            }
          } else {
            // Show modal only if not already shown
            if (!modalShown) {
              console.log("⚠️ [RegionContext] IP detection failed, showing modal");
              modalShown = true;
              setShowRegionModal(true);
            }
          }
        } catch (error) {
          console.error("❌ [RegionContext] Error detecting region:", error);
          // Show modal only if not already shown
          if (!modalShown) {
            console.log("🆘 [RegionContext] Fallback to modal");
            modalShown = true;
            setShowRegionModal(true);
          }
        }
      } catch (error) {
        console.error("❌ [RegionContext] Unexpected error:", error);
        // Fallback to default
        setRegion("IN");
        setIsInitialized(true);
      } finally {
        setIsLoading(false);
        initializationInProgress = false;
      }
    }

    // Small delay to ensure DOM is ready and prevent race conditions
    const timeoutId = setTimeout(initializeRegion, 100);
    
    return () => {
      clearTimeout(timeoutId);
      initializationInProgress = false;
    };
  }, []);

  // Global event listener to prevent multiple modals across different provider instances
  useEffect(() => {
    const handleRegionModalEvent = (event) => {
      if (event.detail.action === 'close') {
        setShowRegionModal(false);
        modalShown = false;
      }
    };

    window.addEventListener('region-modal-control', handleRegionModalEvent);
    return () => {
      window.removeEventListener('region-modal-control', handleRegionModalEvent);
    };
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
      {/* Only render modal if this is the primary instance and modal should be shown */}
      {showRegionModal && !initializationInProgress && (
        <RegionSelectionModal
          open={showRegionModal}
          onRegionSelect={handleRegionSelect}
          detectedCountry={detectedCountry}
        />
      )}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}