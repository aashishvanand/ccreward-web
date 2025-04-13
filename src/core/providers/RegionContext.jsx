// src/core/providers/RegionContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from 'react';

// Define supported regions
export const REGIONS = {
  IN: 'India',
  SG: 'Singapore'
};

// Create context with default values
const RegionContext = createContext({
  region: 'IN',
  setRegion: () => {},
  regionName: REGIONS.IN
});

export function RegionProvider({ children }) {
  const [region, setRegion] = useState('IN'); // Default to India
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserSetRegion, setHasUserSetRegion] = useState(false);
  
  useEffect(() => {
    // Try to load from localStorage first (user's previous choice)
    const savedRegion = localStorage.getItem('app-region');
    const userHasChosen = localStorage.getItem('user-set-region') === 'true';
    
    console.log("💼 Initial region from localStorage:", savedRegion);
    console.log("💼 User has previously set region:", userHasChosen);
    
    // If we have a valid saved region, use it and respect user's choice
    if (savedRegion && Object.keys(REGIONS).includes(savedRegion)) {
      setRegion(savedRegion);
      if (userHasChosen) {
        setHasUserSetRegion(true);
      }
      setIsLoading(false);
      return;
    }
    
    // If no saved region or user hasn't chosen, try to detect based on IP
    if (!userHasChosen) {
      console.log("💼 Attempting to detect region by IP...");
      
      // Only attempt IP detection if we haven't loaded a valid region from storage
      const detectRegion = async () => {
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          
          // Set region based on country code
          if (data.country_code === 'SG') {
            console.log("🌍 IP detection suggests region: SG");
            setRegion('SG');
            localStorage.setItem('app-region', 'SG');
          } else {
            // Default to India for all other regions for now
            console.log("🌍 IP detection suggests default region: IN");
            setRegion('IN');
            localStorage.setItem('app-region', 'IN');
          }
        } catch (error) {
          console.error('Error detecting region:', error);
          // Default to India if detection fails
          setRegion('IN');
          localStorage.setItem('app-region', 'IN');
        }
      };
      
      detectRegion();
    }
    
    setIsLoading(false);
  }, []);
  
  const updateRegion = (newRegion) => {
    // Validate the region
    if (!Object.keys(REGIONS).includes(newRegion)) {
      console.error("Invalid region:", newRegion);
      return;
    }
    
    // Skip if trying to set the same region
    if (newRegion === region) {
      console.log(`🚫 Preventing unnecessary region change: ${region} to ${newRegion}`);
      return;
    }
    
    console.log(`💼 Updating region from ${region} to ${newRegion}`);
    
    // Mark this as a user choice
    localStorage.setItem('user-set-region', 'true');
    setHasUserSetRegion(true);
    
    // Update localStorage with new region
    localStorage.setItem('app-region', newRegion);
    
    // Update state to trigger re-renders
    setRegion(newRegion);
    
    // Try dispatching an event first to notify components
    if (typeof window !== 'undefined') {
      console.log("💼 Dispatching region-changed event");
      window.dispatchEvent(new CustomEvent('region-changed', { 
        detail: { region: newRegion } 
      }));
      
      // Force reload after a short delay for reliability
      setTimeout(() => {
        console.log("💼 Forcing page reload to apply region change");
        window.location.reload();
      }, 100);
    }
  };
  
  return (
    <RegionContext.Provider 
      value={{ 
        region, 
        setRegion: updateRegion, 
        regionName: REGIONS[region],
        isLoading,
        hasUserSetRegion
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
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}