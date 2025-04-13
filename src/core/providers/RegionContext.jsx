"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

// --- Configuration ---
// Define supported regions statically
export const REGIONS = {
  IN: "India",
  SG: "Singapore",
};

// Language to region mapping
const LANGUAGE_TO_REGION = {
  // Hindi and other Indian languages
  "hi": "IN",
  "hi-IN": "IN", 
  "ta": "IN", // Tamil
  "te": "IN", // Telugu
  "ml": "IN", // Malayalam
  "kn": "IN", // Kannada
  "bn": "IN", // Bengali
  "pa": "IN", // Punjabi
  "gu": "IN", // Gujarati
  "mr": "IN", // Marathi
  "or": "IN", // Odia
  
  // Chinese (simplified and traditional) and other Singapore languages
  "zh-SG": "SG",
  "ms-SG": "SG", // Malay (Singapore)
  "ta-SG": "SG", // Tamil (Singapore)
  "en-SG": "SG", // English (Singapore)
  "zh-Hans-SG": "SG", // Chinese Simplified (Singapore)
  "zh-Hant-SG": "SG", // Chinese Traditional (Singapore)
};

// Multiple API providers for redundancy
const API_PROVIDERS = [
  { 
    url: "https://ipapi.co/json/", 
    extractRegion: (data) => data?.country_code?.toUpperCase()
  },
  { 
    url: "https://ipinfo.io/json", 
    extractRegion: (data) => data?.country?.toUpperCase() 
  }
];

// Helper: Validate region code against our static list
const isValidRegion = (regionCode) => {
    return regionCode && Object.keys(REGIONS).includes(regionCode.toUpperCase());
}

// Get initial region from localStorage if available
const getInitialRegion = () => {
  if (typeof window !== 'undefined') {
    const savedRegion = localStorage.getItem("app-region")?.toUpperCase();
    if (isValidRegion(savedRegion)) {
      return savedRegion;
    }
  }
  // If no valid region is found, use "SG" as a fallback
  return "SG";
};

// --- Context Definition ---
const RegionContext = createContext({
  region: "",  // This will be properly initialized in the provider
  setRegion: () => {},
  regionName: "",
  isLoading: true,
  hasUserSetRegion: false,
});

// --- Provider Component ---
export function RegionProvider({ children }) {
  // Initialize with value from localStorage if available
  const [currentRegion, setCurrentRegion] = useState(getInitialRegion());
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserSetRegion, setHasUserSetRegion] = useState(false);

  // --- Function to Detect Region via Browser Language ---
  const detectRegionViaLanguage = useCallback(() => {
    console.log("🔍 Detecting region via browser language...");
    
    if (typeof window === 'undefined') {
      return null; // SSR - no browser language available
    }
    
    try {
      // Get browser languages in order of preference
      const languages = [
        navigator.language, // Primary language
        ...(navigator.languages || []) // All preferred languages
      ];
      
      console.log("🌐 Browser languages:", languages);
      
      // Try to match a language to a region
      for (const lang of languages) {
        if (!lang) continue;
        
        // Try exact match first
        if (LANGUAGE_TO_REGION[lang]) {
          const region = LANGUAGE_TO_REGION[lang];
          console.log(`✅ Found region match for language ${lang}: ${region}`);
          return region;
        }
        
        // Try language code without region specifier (e.g., "en-US" -> "en")
        const primaryLang = lang.split('-')[0];
        if (LANGUAGE_TO_REGION[primaryLang]) {
          const region = LANGUAGE_TO_REGION[primaryLang];
          console.log(`✅ Found region match for primary language ${primaryLang}: ${region}`);
          return region;
        }
      }
      
      console.log("⚠️ No region match found for browser languages");
      return null;
    } catch (error) {
      console.error("❌ Error detecting region via browser language:", error);
      return null;
    }
  }, []);

  // --- Function to Detect Region via IP ---
  const detectRegionViaIP = useCallback(async () => {
    console.log("🔍 Detecting region via IP...");
    
    // Try each provider in sequence until one succeeds
    for (const provider of API_PROVIDERS) {
      try {
        console.log(`🌐 Trying IP detection provider: ${provider.url}`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch(provider.url, { 
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.warn(`⚠️ Provider ${provider.url} failed with status: ${response.status}`);
          continue; // Try next provider
        }
        
        const data = await response.json();
        const detectedCode = provider.extractRegion(data);

        // Validate against the static REGIONS list
        if (isValidRegion(detectedCode)) {
          console.log(`✅ Region detected via ${provider.url}: ${detectedCode}`);
          return detectedCode;
        } else {
          console.warn(`⚠️ Provider ${provider.url} returned unsupported region: '${detectedCode || 'N/A'}'`);
          // Continue to next provider instead of returning null
        }
      } catch (error) {
        console.error(`❌ Error with provider ${provider.url}:`, error);
        // Continue to next provider
      }
    }
    
    // If we get here, all providers failed
    console.error("❌ All region detection providers failed");
    return null;
  }, []);

  // --- Effect 1: Determine Initial Region on Mount ---
  useEffect(() => {
    const determineInitialRegion = async () => {
      // Check if user has made an explicit choice before
      const userHasChosen = localStorage.getItem("user-set-region") === "true";
      setHasUserSetRegion(userHasChosen);

      console.log("🚀 Determining initial region...");
      console.log("👤 User has previously chosen:", userHasChosen);
      console.log("🌐 Starting with region:", currentRegion);

      // If user hasn't chosen, try to detect the region
      if (!userHasChosen) {
        console.log("🤔 User hasn't explicitly chosen, attempting detection...");
        
        // Try IP detection first (more accurate)
        const ipDetectedRegion = await detectRegionViaIP();
        if (ipDetectedRegion) {
          console.log(`✅ Using IP-detected region: ${ipDetectedRegion}`);
          setCurrentRegion(ipDetectedRegion);
          localStorage.setItem("app-region", ipDetectedRegion);
        } 
        // If IP detection fails, try browser language
        else {
          console.log("⚠️ IP detection failed, trying browser language...");
          const languageDetectedRegion = detectRegionViaLanguage();
          if (languageDetectedRegion) {
            console.log(`✅ Using language-detected region: ${languageDetectedRegion}`);
            setCurrentRegion(languageDetectedRegion);
            localStorage.setItem("app-region", languageDetectedRegion);
          }
          // If all detection methods fail, we keep the existing value from initialization
        }
      }

      console.log(`🏁 Final region set to: ${currentRegion}`);
      setIsLoading(false); // Mark initial determination as complete
    };

    determineInitialRegion();
  }, [detectRegionViaIP, detectRegionViaLanguage, currentRegion]);

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

        // Dispatch custom event
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
    if (!newRegion) return;
    
    const upperCaseRegion = newRegion.toUpperCase();

    // Validate against the static REGIONS list
    if (!isValidRegion(upperCaseRegion)) {
      console.error(`❌ Invalid or unsupported region selected: ${newRegion}`);
      return;
    }

    console.log(`➡️ User updating region: ${currentRegion} -> ${upperCaseRegion}`);

    // Mark that the user has made an explicit choice
    localStorage.setItem('user-set-region', 'true');
    setHasUserSetRegion(true);

    // Update the region state (triggers Effect 2 for localStorage sync)
    setCurrentRegion(upperCaseRegion);
  }, [currentRegion]);

  // --- Context Value ---
  const contextValue = {
    region: currentRegion,
    setRegion: updateRegion,
    regionName: REGIONS[currentRegion] || "Unknown Region",
    isLoading,
    hasUserSetRegion,
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