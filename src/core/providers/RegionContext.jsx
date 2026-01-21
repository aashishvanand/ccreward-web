"use client";
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

    try {
      const upperCaseRegion = newRegion.toUpperCase();

      try {
        localStorage.setItem("app-region", upperCaseRegion);
        localStorage.setItem("user-set-region", "true");
      } catch (storageError) {
        console.warn("Failed to save region to localStorage:", storageError);
      }

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
    } catch (error) {
      console.error("Error updating region:", error);
      // Fallback: forcefully close modal
      setShowRegionModal(false);
      modalShown = false;
    }
  }, []);

  const handleRegionSelect = useCallback((selectedRegion) => {
    updateRegion(selectedRegion);
  }, [updateRegion]);

  // Add this import at the top
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

  useEffect(() => {
    // Prevent multiple initializations
    if (initRef.current || initializationInProgress) {
      return;
    }
    
    initRef.current = true;
    initializationInProgress = true;

    async function initializeRegion() {
      if (typeof window === "undefined") {
        initializationInProgress = false;
        return;
      }

      try {
        // 1. Check URL Parameter for SEO (Highest Priority)
        // We use window.location because useSearchParams might not be available during initial hydration 
        // effectively outside of Next.js router context in some edge cases compared to Providers
        const urlParams = new URLSearchParams(window.location.search);
        const urlRegion = urlParams.get('region');

        if (urlRegion && isValidRegion(urlRegion)) {
           const upperUrlRegion = urlRegion.toUpperCase();
           setRegion(upperUrlRegion);
           // We do NOT set user-set-region to true for URL params to avoid persistent override from a temporary link
           // But we treat it as initialized.
           setHasUserSetRegion(false); 
           setIsInitialized(true);
           setIsLoading(false);
           initializationInProgress = false;
           return;
        }

        const savedRegion = localStorage.getItem("app-region");
        const userSetRegion = localStorage.getItem("user-set-region") === "true";

        if (savedRegion && isValidRegion(savedRegion)) {
          setRegion(savedRegion.toUpperCase());
          setHasUserSetRegion(userSetRegion);
          setIsInitialized(true);
          setIsLoading(false);
          initializationInProgress = false;
          return;
        }

        try {
          const response = await fetch("https://ipinfo.io/json");
          if (response.ok) {
            const data = await response.json();
            const countryCode = data.country?.toUpperCase();
            setDetectedCountry(countryCode);

            if (Object.keys(REGIONS).includes(countryCode)) {
              // Auto-detect supported region
              // Only save if we are auto-detecting, not overrides
              localStorage.setItem("app-region", countryCode);
              localStorage.setItem("user-set-region", "false");
              setRegion(countryCode);
              setHasUserSetRegion(false);
              setIsInitialized(true);
            } else {
              // Show modal only if not already shown
              if (!modalShown) {
                modalShown = true;
                setShowRegionModal(true);
              }
            }
          } else {
            // Show modal only if not already shown
            if (!modalShown) {
              modalShown = true;
              setShowRegionModal(true);
            }
          }
        } catch (error) {
          console.error("❌ [RegionContext] Error detecting region:", error);
          // Show modal only if not already shown
          if (!modalShown) {
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