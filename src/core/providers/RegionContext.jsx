// src/core/providers/RegionContext.jsx

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

export function RegionProvider({ children }) {
  const [region, setRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserSetRegion, setHasUserSetRegion] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState(null);

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
    async function initializeRegion() {
      if (typeof window === "undefined") {
        return;
      }

      const savedRegion = localStorage.getItem("app-region");
      const userSetRegion = localStorage.getItem("user-set-region") === "true";

      if (savedRegion && isValidRegion(savedRegion)) {
        setRegion(savedRegion.toUpperCase());
        setHasUserSetRegion(userSetRegion);
        setIsInitialized(true);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("https://ipinfo.io/json");
        if (response.ok) {
          const data = await response.json();
          const countryCode = data.country?.toUpperCase();
          setDetectedCountry(countryCode);

          if (Object.keys(REGIONS).includes(countryCode)) {
            localStorage.setItem("app-region", countryCode);
            localStorage.setItem("user-set-region", "false");
            setRegion(countryCode);
            setHasUserSetRegion(false);
            setIsInitialized(true);
          } else {
            setShowRegionModal(true);
          }
        } else {
          setShowRegionModal(true);
        }
      } catch (error) {
        console.error("Error detecting region:", error);
        setShowRegionModal(true);
      } finally {
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

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  return context;
}