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
  
  useEffect(() => {
    // Try to load from localStorage first
    const savedRegion = localStorage.getItem('app-region');
    if (savedRegion && Object.keys(REGIONS).includes(savedRegion)) {
      setRegion(savedRegion);
      setIsLoading(false);
      return;
    }
    
    // If no saved region, try to detect based on IP
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Set region based on country code
        if (data.country_code === 'SG') {
          setRegion('SG');
        } else {
          // Default to India for all other regions for now
          setRegion('IN');
        }
        
        // Save to localStorage
        localStorage.setItem('app-region', data.country_code === 'SG' ? 'SG' : 'IN');
      } catch (error) {
        console.error('Error detecting region:', error);
        // Default to India if detection fails
        setRegion('IN');
      } finally {
        setIsLoading(false);
      }
    };
    
    detectRegion();
  }, []);
  
  const updateRegion = (newRegion) => {
    if (Object.keys(REGIONS).includes(newRegion)) {
      setRegion(newRegion);
      localStorage.setItem('app-region', newRegion);
    }
  };
  
  return (
    <RegionContext.Provider 
      value={{ 
        region, 
        setRegion: updateRegion, 
        regionName: REGIONS[region],
        isLoading 
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