import React, { createContext, useContext, useState, useCallback } from 'react';

// 1. Create the Context
const SpatialContext = createContext();

// 2. Create the Provider Component
export const SpatialProvider = ({ children }) => {
  // State to hold the details of the last map click
  const [clickDetails, setClickDetails] = useState({
    location: null, // e.g., { latitude: number, longitude: number } or map point geometry
    componentId: null, // e.g., 'mapView'
    layerId: null, // e.g., 'NO2_Daily'
    timestamp: null, // Optional: timestamp of the click
  });

  // Function to update the click details
  // This will be called from the component handling map clicks (e.g., MapView)
  const updateClickDetails = useCallback((details) => {
    setClickDetails({
        ...details,
        timestamp: new Date() // Add a timestamp to the update
    });
  }, []);

  // Function to clear click details
  const clearClickDetails = useCallback(() => {
    setClickDetails({
        location: null,
        componentId: null,
        layerId: null,
        timestamp: null,
    });
  }, []);


  // 3. Provide the state and update function to children
  const value = {
    clickDetails,
    updateClickDetails,
    clearClickDetails,
  };

  return (
    <SpatialContext.Provider value={value}>
      {children}
    </SpatialContext.Provider>
  );
};

// 4. Create a custom hook for easy consumption
export const useSpatial = () => {
  const context = useContext(SpatialContext);
  if (!context) {
    throw new Error('useSpatial must be used within a SpatialProvider');
  }
  return context;
};

export default SpatialContext; 